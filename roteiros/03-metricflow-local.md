# Episódio 3 — MetricFlow local: métricas como código

**Duração alvo:** 22–25 minutos
**Nível:** intermediário
**Rótulos na tela:** `OPEN`, `MetricFlow 0.212.0`, `dbt-metricflow 0.14.0: integração`, `Core 1.12`

## Gancho

“Se `ticket médio` aparece em cinco dashboards, quantas implementações você mantém? Hoje vamos declarar uma vez, validar semântica, gerar SQL e executar tudo localmente — sem uma conta dbt Platform e sem esconder onde começa o produto pago.”

## Objetivo e pré-requisitos

Implementar entidades, dimensões, métricas simples, métrica derivada e time spine; validar configurações e consultar métricas no MetricFlow aberto.

Pré-requisitos: checkpoints 01 e 02 executados; ambiente `requirements-local.txt` instalado.

## Roteiro falado

### 00:00–02:00 — O compilador entre pergunta e SQL

“MetricFlow recebe uma consulta em termos de métricas e dimensões e compila o SQL necessário. Ele não é um LLM e não adivinha significado. Sua força vem justamente do contrário: trabalha sobre definições explícitas.

O motor instalado é `metricflow 0.212.0`, aberto sob Apache 2.0. O comando `mf --version` mostra `dbt-metricflow 0.14.0`, que é o pacote de integração; não é a versão do motor. A Semantic Layer gerenciada acrescenta operação, autenticação, APIs, cache e integrações. Neste episódio ficamos do lado aberto.”

**Visual:** `mf query -> grafo semântico -> SQL -> DuckDB`.

### 02:00–06:00 — Entidades e grão

“Começamos pelo `commerce_orders`, um registro por pedido. `order_id` é entidade primária. `customer_id` é entidade estrangeira. A entidade não é só documentação: ela informa como modelos podem ser ligados sem inventar um join.

O maior erro numa camada semântica é declarar entidade sem verificar grão. Se `order_id` aparece repetido porque juntamos itens, `count` e `sum(payment)` explodem. Por isso o contrato e os testes de unicidade vêm antes da métrica.”

```yaml
semantic_model:
  enabled: true
  name: commerce_orders
columns:
  - name: order_id
    entity:
      name: order
      type: primary
  - name: customer_id
    entity:
      name: customer
      type: foreign
```

“Na especificação recente do dbt, as anotações ficam junto ao modelo e às colunas. Sempre confira a versão da documentação: exemplos antigos usam um bloco diferente.”

### 06:00–10:00 — Dimensões, tempo e time spine

“`order_status` é dimensão categórica. `order_purchase_date` é dimensão temporal diária e também a dimensão de agregação padrão. Isso responde qual calendário uma métrica usa quando o consumidor pede mês.

O time spine é um calendário canônico. Ele se torna necessário para operações temporais como acumulados e preenchimento de períodos. No laboratório geramos datas de 2024 a 2025 com uma macro despachada, então o mesmo projeto compila em DuckDB e Databricks.

Não use a data de compra por hábito. Receita reconhecida pode pedir data de entrega ou aprovação. A escolha precisa estar no contrato semântico.”

### 10:00–14:00 — Métricas simples e derivada

“Uma métrica simples combina expressão e agregação.”

```yaml
metrics:
  - name: orders
    type: simple
    agg: count_distinct
    expr: order_id
  - name: gross_revenue
    type: simple
    agg: sum
    expr: total_payment
```

“Receita entregue soma uma coluna já calculada na Gold. Essa é uma escolha deliberada: a condição funcional `status = delivered` fica testada no pipeline; o MetricFlow agrega o resultado.

Ticket médio é derivado.”

```yaml
metrics:
  - name: average_order_value
    type: ratio
    numerator: gross_revenue
    denominator: orders
```

“Uma razão reutiliza métricas nomeadas em vez de copiar a fórmula. Ainda precisamos decidir comportamento com denominador zero e precisão monetária no modelo real.”

### 14:00–19:30 — Demonstração completa

“Vamos validar primeiro. Uma configuração semanticamente inválida deve falhar antes da consulta.”

```bash
cd lab/dabdbt
source .venv/bin/activate
python scripts/run_checkpoint.py 03
```

“O checkpoint executa:”

```bash
DBT_PROFILES_DIR=dbt_profiles mf validate-configs
DBT_PROFILES_DIR=dbt_profiles mf query \
  --metrics orders,gross_revenue,delivered_revenue,average_order_value \
  --group-by metric_time__month
```

“O resultado esperado por mês é: janeiro 2 pedidos, 150 brutos e ticket 75; fevereiro 2, 230 e 115; março 2, 150 e 75; abril 2, 210 e 105. Receita entregue difere nos meses com pedido não entregue.

Agora gere ou inspecione o SQL. Procure agregações e a dimensão temporal. O ponto não é que o SQL seja impossível de escrever; é que ele foi produzido da mesma definição que os demais consumidores usarão.”

**Sugestão visual:** tela dividida com YAML à esquerda, comando no centro e tabela mensal à direita; sublinhar a métrica derivada.

### 19:30–22:00 — Case e leitura responsável

“A Inventa reporta ter saído de dois para treze contribuidores e manter 83 métricas, com 90% de redução de manutenção. O número pertence ao case da empresa publicado pela dbt Labs. O aprendizado generalizável é o mecanismo: definição central, composição de métricas e menos fórmulas duplicadas.

No nosso laboratório, a evidência é mais modesta e auditável: configuração valida, SQL executa e os valores mensais reconciliam com o ground truth.”

### 22:00–24:00 — Limites e fechamento

“MetricFlow não decide o que receita significa, não corrige fonte atrasada e não aplica sozinho autorização por linha. Também não significa que toda consulta será barata: uma dimensão de alta cardinalidade ou join grande continua custando.

No próximo episódio vamos consumir a mesma definição em interfaces diferentes e marcar exatamente a fronteira entre componente aberto e serviço gerenciado.”

### Inserção obrigatória na demonstração — Como depurar uma métrica

“Quando a validação falha, evite editar tudo ao mesmo tempo. Siga quatro passos. Primeiro, confirme o grão físico com `count(*)` e `count(distinct order_id)`. Segundo, confirme que a entidade primária é realmente única. Terceiro, execute a expressão base diretamente na fachada. Quarto, só então compare o SQL compilado pelo MetricFlow.

Se `gross_revenue` está errada, mas `sum(total_payment)` na fachada está correta, o problema está na definição ou na consulta semântica. Se ambos estão errados, volte à Gold. Se o total está certo e o mês está errado, investigue dimensão temporal e timezone. Essa árvore de diagnóstico evita culpar a ferramenta errada.

Também vou mostrar uma alteração deliberadamente inválida numa cópia de tela: trocar a entidade `order` de `primary` para `foreign`. A validação semântica deve apontar que o modelo não tem a chave esperada para servir de base. Não salvamos essa mudança; ela serve para mostrar que `mf validate-configs` é parte da CI, não um comando de documentação.

Por fim, apresento uma convenção de revisão para novas métricas: pergunta de negócio, owner, grão, entidade, expressão, filtros, dimensão temporal, reconciliação, consumidores e classificação de custo. Uma métrica só entra no catálogo quando esses campos estão respondidos. Isso reduz a tentação de publicar dezenas de nomes sem semântica e cria contexto que BI, API e agente conseguem reutilizar.”

## Resultado esperado

- `mf validate-configs`: zero erros e warnings semânticos.
- Consulta mensal: quatro linhas, janeiro a abril.
- Ground truth total: 8 pedidos, 740 de receita bruta, 630 de receita entregue, ticket 92,50.

## Governança, FinOps e IA

- Governança: métricas revisáveis em Git e ligadas a entidades/dimensões.
- FinOps: composição e reuso evitam consultas exploratórias duplicadas; cardinalidade ainda importa.
- IA: agente escolhe métricas nomeadas em vez de inventar SQL de negócio.

## Anti-patterns e limitações

- Copiar exemplos da spec antiga sem conferir versão.
- Declarar chave primária em um modelo cujo grão não é único.
- Esconder filtro funcional complexo apenas dentro da métrica sem testá-lo.
- Confundir biblioteca MetricFlow com Semantic Layer hospedada.

## Radar — máximo de dois minutos

“A especificação semântica ainda evolui e a matriz de suporte do Core 2.0/Fusion não é igual à do Core 1.12. O Radar acompanha mudanças de schema e referências cross-project; o YAML executado no vídeo permanece o baseline estável.”

## CTA

“Implemente uma métrica simples e uma razão, rode a validação e publique o YAML junto com uma consulta de reconciliação. No comentário, diga qual dimensão temporal causou mais discussão.”

## Fontes

- [Repositório MetricFlow — Apache 2.0](https://github.com/dbt-labs/metricflow)
- [Especificação recente de métricas](https://docs.getdbt.com/docs/build/latest-metrics-spec)
- [Semantic Layer gerenciada](https://docs.getdbt.com/docs/use-dbt-semantic-layer/dbt-sl)
- [Case Inventa — resultado reportado pelo fornecedor](https://www.getdbt.com/case-studies/inventa)
- [Checkpoint executável](../lab/dabdbt/checkpoints/03-metricflow.md)
