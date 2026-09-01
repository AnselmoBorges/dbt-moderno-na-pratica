# Episódio 10 — FinOps do pipeline

**Duração alvo:** 22–25 minutos
**Nível:** intermediário/avançado
**Rótulos na tela:** `medição local ≠ billing cloud`, `microbatch: Core 1.9+`, `suporte depende do adaptador`

## Gancho

“Um pipeline verde pode estar correto e caro. Um pipeline rápido pode estar errado porque processou menos dados do que deveria. FinOps começa quando custo e resultado funcional entram no mesmo teste.”

## Objetivo e pré-requisitos

Revisar incrementais, lookback, microbatch, materializações e seleção por impacto; medir duração, recursos e proxy de custo; provar que a otimização preserva o ground truth.

Pré-requisito: checkpoint 09 e banco DuckDB construído.

## Roteiro falado

### 00:00–04:00 — A equação que falta

“O custo de transformação depende de dados lidos, dados escritos, tempo, paralelismo, preço do warehouse e repetição. Contar modelos não basta. Um único modelo com full scan pode custar mais que cinquenta views pequenas.

No local não existem créditos Databricks. Então medimos proxies: duração de parede, soma do tempo de recursos, quantidade executada e equivalência funcional. Em cloud, acrescentaríamos bytes lidos, créditos/DBUs, tamanho do warehouse e preço do período.”

**Visual:** `custo = compute x tempo + storage + orquestração + retries`; ao lado `correção = ground truth igual`.

### 04:00–08:30 — Incremental com responsabilidade

“`orders_s` é incremental por `order_id`. Na segunda execução, filtra eventos a partir do maior timestamp já carregado. `on_schema_change: fail` impede adaptação silenciosa da forma.

Essa implementação responde a um achado do projeto privado: encontramos estratégias `merge` e `insert_overwrite`, mas nenhum `is_incremental()` nos SQL auditados. A materialização pode escrever incrementalmente e ainda assim reler a origem inteira. Isso é hipótese de custo, não diagnóstico de incidente; sem query history não sabemos o impacto real.

Esse exemplo é didático. Em produção, usar apenas `max(timestamp)` pode perder eventos atrasados. Uma janela de lookback reprocessa alguns dias; a chave única faz upsert. Quanto maior a janela, mais robustez e mais custo. A decisão precisa medir atraso real da fonte.

Outro risco é definir `unique_key` que não é realmente única. O teste de unicidade não é opcional. Incremental sem idempotência transforma retry em duplicação.”

### 08:30–12:00 — Microbatch e backfill

“Microbatch é uma estratégia incremental para séries temporais grandes. O dbt divide o período em lotes independentes usando `event_time` e `batch_size`. Isso permite retry e backfill por lote e, onde suportado, paralelismo.

O detalhe crítico da documentação: se os pais não têm `event_time`, cada lote pode fazer full scan upstream. Você acha que particionou o trabalho, mas multiplica leitura. Microbatch é disponível no Core 1.9+ e o suporte varia por adaptador.

Não implementamos microbatch no dataset de oito pedidos porque ele não demonstraria escala e poderia ensinar uma otimização sem necessidade. Mostramos a configuração conceitual e mantemos o checkpoint determinístico.”

```yaml
config:
  materialized: incremental
  incremental_strategy: microbatch
  event_time: event_timestamp
  batch_size: day
```

### 12:00–15:30 — Materialização e recomputação

“View adia compute para o consumidor. Table antecipa compute e storage. Incremental atualiza parte. Ephemeral incorpora CTE e pode duplicar trabalho em vários consumidores. A escolha deve considerar frequência de atualização, frequência de leitura, complexidade e SLA.

Para a camada semântica do laboratório usamos tabelas pequenas por previsibilidade. Em produção, uma fachada simples poderia ser view enquanto a Gold pesada é incremental. Não existe materialização universalmente mais barata.”

### 15:30–20:00 — Demonstração mensurável

```bash
cd lab/dabdbt
source .venv/bin/activate
python scripts/run_checkpoint.py 10
```

“O checkpoint primeiro compara full refresh e incremental de `orders_s`. Na fixture, o full considera oito linhas da origem e a segunda execução incremental considera apenas a linha no maior timestamp; ambas terminam com os mesmos oito pedidos, sem duplicação. Depois executa um full build lógico e um build focal `order_fulfillment_g+`, lê `run_results.json` e calcula resource-seconds. Por fim recalcula as dez perguntas de negócio.

Numa execução de referência, o full build executou 45 recursos e o focal, 5; a redução de contagem foi 88,89%. A duração foi aproximadamente 5,0 contra 4,2 segundos, uma redução muito menor porque o overhead fixo domina uma amostra pequena. Esse contraste é uma ótima aula: menos nós não significa economia proporcional.

O relatório marca `local_cost: 0` e `measurement: local DuckDB proxy; not cloud billing`. Finalmente, `functional_result_equal: true`. Sem essa última linha, a otimização não está aprovada.”

**Visual:** duas barras para recursos, duas para segundos; não misturar escalas. Rodapé: “resultado varia por máquina”.

### 20:00–23:30 — Case Symend e leitura responsável

“A Symend reporta 70% de redução no consumo do warehouse e 90% no tempo de debugging em case da dbt Labs. Incrementais aparecem como parte do mecanismo. Esses números pertencem ao contexto da Symend.

O aprendizado transferível é a disciplina: identificar full recomputation, mudar estratégia e medir consumo. No nosso ambiente, mostramos metodologia e equivalência, não créditos.

Para agentes, FinOps também inclui número de tool calls, queries, tokens e retries. Um agente que pergunta cinco vezes ao warehouse pode apagar a economia do pipeline. Essa conta entra no episódio final.”

### 23:30–25:00 — Fechamento

“O anti-pattern é começar com microbatch porque parece moderno. Comece pela query profile, volume, atraso e frequência. Otimize o gargalo e prove o mesmo resultado.

No próximo episódio vamos abrir uma interface MCP com privilégio mínimo para que o agente receba contexto sem ganhar o warehouse inteiro.”

### Inserção obrigatória — Planilha de decisão FinOps

“Para cada modelo caro, registre seis números antes de mudar: frequência, linhas/bytes lidos, linhas escritas, duração, falhas/retries e custo do warehouse. Depois associe o padrão de uso. Se o modelo muda pouco e é lido muito, tabela incremental pode ajudar. Se muda sempre e é lido raramente, uma view pode ser melhor. Se é série temporal grande com backfills, avalie microbatch.

Agora inclua custo de manutenção. Um incremental complexo que economiza 10% de compute e gera incidentes mensais pode ter custo total maior. FinOps não é só fatura; é decisão conjunta de dinheiro, confiabilidade e tempo de engenharia.

Na demonstração, vou abrir `run_results.json` e mostrar que `execution_time` existe por recurso. Em Databricks, cruzaríamos tags de job/modelo com system tables de billing. As tags do episódio sete ajudam rateio, mas a granularidade disponível depende da plataforma. Nunca atribua custo por modelo com uma fórmula inventada se o provedor só mede por job/warehouse; declare o método e sua incerteza.

Uma boa conclusão de experimento tem três linhas: custo antes/depois, resultado funcional igual e janela observada. Sem janela, cache ou sazonalidade podem distorcer. Sem ground truth, a versão ‘barata’ pode ter omitido dados.”

## Resultado esperado

- JSON com full/focused build, duração, recursos e resource-seconds.
- `functional_result_equal: true` após dez queries.
- Valores monetários cloud não são inventados; ficam fora do relatório local.

## Governança, FinOps e IA

- Governança: incremento exige chave, schema policy e reconciliação.
- FinOps: medir billing real em produção e proxy local em CI; considerar overhead fixo.
- IA: incluir consultas, tool calls, tokens e retries no custo total.

## Limitações e anti-patterns

- Dataset pequeno não mede ganho de microbatch.
- `max(timestamp)` sem lookback perde evento tardio.
- Full/focused no mesmo banco podem aproveitar cache de forma diferente.
- Case comercial não é baseline do laboratório.

## Radar — máximo de dois minutos

“O projeto privado possui flags relacionadas a microbatch/materialização nova, mas não encontramos `event_time`, lote e lookback suficientes para provar o comportamento. O Radar acompanha suporte por adapter; só haverá demo quando a configuração completa for estável e o volume permitir medição honesta.”

## CTA

“Escolha seu modelo mais caro, registre bytes/créditos, duração e resultado antes da mudança. Só depois aplique incremental, materialização ou state e repita a mesma reconciliação.”

## Fontes

- [Microbatch incremental](https://docs.getdbt.com/docs/build/incremental-microbatch)
- [Incremental models](https://docs.getdbt.com/docs/build/incremental-models-overview)
- [Case Symend — resultado reportado pelo fornecedor](https://www.getdbt.com/case-studies/symend)
- [Auditoria anonimizada do projeto](../pesquisa/auditoria-projeto-privado.md)
- [Checkpoint executável](../lab/dabdbt/checkpoints/10-finops.md)
