# Episódio 9 — CI inteligente com artifacts, state e defer

**Duração alvo:** 20–23 minutos
**Nível:** intermediário/avançado
**Rótulos na tela:** `manifest é artefato de CI`, `state:modified+`, `defer pode misturar ambientes`

## Gancho

“Você alterou uma linha em `orders_s`. Precisa reconstruir quarenta e cinco recursos? A resposta não é ‘sempre sim’ nem ‘rode só esse modelo’. A resposta está no grafo e no estado anterior.”

## Objetivo e pré-requisitos

Usar manifest, seleção por estado e descendentes; explicar defer e seus riscos; comparar escopo integral e impactado.

Pré-requisito: checkpoint 08 e build que produza `target/manifest.json`.

## Roteiro falado

### 00:00–03:30 — Artifact não é lixo de build

“`manifest.json` descreve modelos, fontes, testes, métricas, exposures, dependências e configurações. `run_results.json` registra execução. Se a CI apaga esses arquivos sem armazená-los, perde a base de comparação.

State compara o projeto atual com um manifest anterior. `state:modified` encontra mudanças lógicas; o `+` à direita inclui descendentes. Assim uma alteração em Silver alcança Gold, contrato, métricas, testes e agente exposto.”

**Visual:** dois manifests, diff, ramo do DAG aceso.

### 03:30–07:00 — Seleção correta não é seleção mínima ingênua

“Rodar somente o arquivo modificado ignora impacto downstream. Rodar tudo é seguro, mas pode ser caro. `state:modified+` é o meio-termo baseado no grafo.

Ainda precisamos pensar em mudanças indiretas: macro, var, package ou source podem afetar muitos nós. O dbt tem subseletores de estado e regras específicas. A política de CI deve começar conservadora e ser ajustada com evidência.”

```bash
dbt ls --select state:modified+ --state target/state-baseline
```

### 07:00–11:00 — O que defer faz

“Imagine que a CI cria um schema temporário apenas para modelos alterados. Seus pais não existem ali. Com `--defer --state manifest-de-producao`, refs não selecionados podem apontar para relações já materializadas no estado anterior.

Isso economiza construção de upstream, mas mistura ambientes. Um teste de relacionamento pode comparar uma tabela nova de CI com uma tabela de produção. Limites de desenvolvimento e dados sensíveis também exigem cuidado. A documentação recomenda entender exatamente as duas condições de resolução.

State responde ‘o que mudou’. Defer responde ‘onde encontrar o que não vou construir’. São relacionados, não sinônimos.”

### 11:00–16:30 — Demonstração reproduzível

“Nosso script evita alterar o checkout. Primeiro gera um manifest baseline. Depois copia o projeto para uma pasta temporária, acrescenta um comentário em `orders_s` e executa `dbt ls state:modified+`.”

```bash
cd lab/dabdbt
source .venv/bin/activate
python scripts/run_checkpoint.py 09
```

“A prova exige que `orders_s`, `order_fulfillment_g` e `commerce_orders` estejam selecionados. Na execução validada, apareceram 36 recursos, incluindo testes, cinco métricas e a exposure do agente. Não foram 36 modelos: o número inclui tipos de recurso diferentes.

Essa distinção é essencial ao comunicar economia. Contar nós selecionados não é o mesmo que contar queries caras. Métricas e exposures podem aparecer no grafo sem materializar tabela.”

**Visual:** saída agrupada por resource type, não apenas uma lista longa.

### 16:30–19:30 — Política de CI em três níveis

“Uma política prática:

Primeiro, parse e unit tests para feedback barato. Segundo, build de `state:modified+`, possivelmente com defer e ambiente isolado. Terceiro, full build periódico ou antes de release crítico para capturar interações que a seleção não cobriu.

Armazene manifest de uma execução bem-sucedida, não de uma tentativa parcial. Versione a política de seleção em `selectors.yml`. E sempre compare resultado funcional nas otimizações de pipeline.”

### 19:30–22:00 — Caso, impacto e fechamento

“No projeto privado, a automação já identifica quais projetos mudaram, mas os workflows auditados ainda executam amplamente dentro de cada projeto; não encontramos `state:modified` ou `--defer`. O próximo ganho de granularidade é sair de projeto alterado para nó impactado.

No laboratório, uma mudança controlada não selecionou ramos independentes, mas propagou impacto até o agente. O tempo de parse e a contagem variam por máquina e versão, então publicamos a lista e a metodologia, não uma promessa de porcentagem.

Governança melhora porque a exposure entra no impacto. FinOps melhora quando evitamos builds irrelevantes. Agentes melhoram indiretamente porque a interface que consomem participa da CI.

No próximo episódio vamos medir execução, recomputação e equivalência funcional de forma mais explícita.”

### Inserção obrigatória — Desenho do workflow

“Na tela, o workflow terá quatro jobs. `lint-parse` roda sempre. `unit` roda sempre e não precisa de dados completos. `modified-build` baixa o manifest da produção, calcula `state:modified+` e constrói o ramo em schema isolado. `full-regression` roda por agenda e em releases críticos.

Se não existe manifest anterior — primeira execução ou artifact expirado — a política faz fallback para full build. Falhar aberto e executar tudo é mais seguro do que concluir verde sem teste. Se o manifest foi produzido por uma versão incompatível, o job também deve detectar e ampliar escopo.

Vamos examinar três mudanças. Editar `orders_s` propaga ao fulfillment, semântica e agente. Editar apenas uma descrição pode exigir parse/docs, mas talvez não materialização; ainda assim pode afetar o contexto do agente. Alterar uma macro de data deve selecionar todos os modelos que a usam. Isso mostra que custo não é o único critério: metadado também é comportamento para consumidores de IA.

Por fim, salve `manifest.json`, `run_results.json` e logs com identificação do commit. Eles permitem reproduzir por que um nó foi selecionado e alimentam histórico de duração. CI inteligente sem artifact retido vira uma decisão impossível de auditar.”

## Demonstração e resultado esperado

- `python scripts/run_checkpoint.py 09`.
- JSON com tempo do parse baseline, contagem e nós selecionados.
- Presença mínima: `orders_s`, `order_fulfillment_g`, `commerce_orders`.
- Projeto original permanece sem alteração.

## Limitações e anti-patterns

- State depende de manifest correto e compatível.
- Um comentário pode ser considerado mudança; ajuste política sem esconder mudanças reais.
- Defer pode misturar dados dev/prod e afetar testes de múltiplos pais.
- Seleção menor não garante custo menor se o nó selecionado faz full scan.

## Radar — máximo de dois minutos

“`state:modified` e `--defer` deste vídeo são recursos abertos do Core. O produto chamado dbt State é outra coisa: está em preview e possui oferta própria. Não use o mesmo nome para atribuir preço ao recurso aberto; dbt State aparece apenas no Radar e na segunda temporada.”

## CTA

“Guarde o manifest do seu build principal, altere um modelo e rode `dbt ls state:modified+`. Classifique a saída por tipo de recurso antes de estimar economia.”

## Fontes

- [Métodos de seleção](https://docs.getdbt.com/reference/node-selection/methods)
- [Defer e seus critérios](https://docs.getdbt.com/reference/node-selection/defer)
- [Auditoria anonimizada do projeto](../pesquisa/auditoria-projeto-privado.md)
- [Checkpoint executável](../lab/dabdbt/checkpoints/09-state-ci.md)
