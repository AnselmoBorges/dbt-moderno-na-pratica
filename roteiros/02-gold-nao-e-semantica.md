# Episódio 2 — Gold não é camada semântica

**Duração alvo:** 18–20 minutos
**Nível:** iniciante/intermediário
**Rótulos na tela:** `Gold: dados preparados`, `Semântica: significado + caminhos de consulta`

## Gancho

“Duas tabelas Gold podem estar tecnicamente corretas e ainda responder ‘receita’ com números diferentes. Se cada dashboard e cada agente precisa decidir filtro, grão e join, a regra não está governada — ela só foi empurrada para o consumidor.”

## Objetivo e pré-requisitos

Distinguir tabela Gold, modelo dimensional, semantic model, métrica e serviço de métricas; identificar métricas duplicáveis no Olist; e construir a fachada que separa transformação física de significado.

Pré-requisito: checkpoint 01 e noções de `ref` e agregação SQL.

## Roteiro falado

### 00:00–02:00 — O teste das quatro perguntas

“Mostre uma tabela chamada `vendas_gold` e faça quatro perguntas: qual é o grão? Receita inclui pedido cancelado? A data é compra, aprovação ou entrega? Cliente se relaciona por qual chave? Se as respostas estão apenas na cabeça do autor, não existe interface semântica.

Gold significa que dados foram curados para consumo. É uma decisão de arquitetura física e lógica. Camada semântica significa que entidades, dimensões, métricas e relações estão explicitadas para que diferentes consumidores peçam a mesma coisa do mesmo jeito.”

**Visual:** mesma tabela Gold alimentando dois dashboards com fórmulas diferentes; depois ambos apontando para uma métrica comum.

### 02:00–06:00 — Cinco conceitos, sem misturar

“Tabela Gold é uma relação materializada ou view com regras aplicadas. Modelo dimensional organiza fatos e dimensões em grãos e chaves. Semantic model descreve entidades, dimensões temporais e categóricas e campos agregáveis. Métrica dá nome e regra a uma medida: receita entregue, por exemplo. Serviço de métricas é a infraestrutura que recebe consultas, gera SQL, aplica cache, autenticação e integrações.

Você pode ter Gold sem modelo dimensional, dimensional sem uma API de métricas, e MetricFlow local sem contratar um serviço hospedado. Essa separação evita vender produto quando a aula é sobre conceito.”

### 06:00–10:00 — Quatro definições no Olist

“Vamos usar pedidos. `orders` será contagem distinta de `order_id`. `gross_revenue` será soma de pagamentos de todos os status. `delivered_revenue` será pagamento reconhecido somente quando o pedido está entregue. `average_order_value` será receita bruta dividida pela contagem de pedidos.

Observe que receita bruta e receita entregue são ambas válidas, mas respondem perguntas diferentes. O erro não é ter duas métricas. O erro é chamar ambas simplesmente de receita.

Prazo de entrega também exige semântica: média de dias apenas quando há data de entrega. Nulos representam pedido ainda sem entrega; zero não é substituto neutro. Esse detalhe precisa estar na Gold e documentado na métrica.”

**Visual:** cartões com nome, fórmula, grão, filtro e dimensão temporal.

### 10:00–14:30 — Demonstração da fronteira

“Primeiro, construímos a Gold e a fachada semântica.”

```bash
cd lab/dabdbt
source .venv/bin/activate
python scripts/run_checkpoint.py 02
```

“Abra `order_fulfillment_g.sql`. Ele calcula prazo e reúne pagamentos no grão pedido. Agora abra `order_metrics_v2.sql`. Ele apresenta uma API contratada, acrescenta `delivered_revenue` e separa receita de itens de pagamentos. Por último, `commerce_orders.sql` aponta para a versão vigente. Consumidores não precisam conhecer o arquivo físico da versão.”

```sql
select
  count(distinct order_id) as orders,
  sum(total_payment) as gross_revenue,
  sum(delivered_revenue) as delivered_revenue
from semantic.commerce_orders;
```

“Na amostra, esperamos 8 pedidos, 740 de receita bruta e 630 de receita entregue. O checkpoint calcula dez respostas de negócio, não só verifica que o SQL executou.”

**Visual:** lineage destacando `orders_s -> order_metrics_v2 -> commerce_orders -> metrics`.

### 14:30–17:00 — Por que isso importa para agentes

“Um agente sobre o schema bruto precisa escolher entre pagamentos, itens e pedidos; pode multiplicar valores num join um-para-muitos; e precisa inventar o filtro de status. Um agente sobre a fachada já recebe um registro por pedido e colunas com nomes definidos. Com métricas, ele pode pedir `delivered_revenue` sem reconstruir a regra.

Isso não torna o agente infalível. Apenas remove decisões determinísticas do espaço probabilístico. Governança melhora porque a regra tem owner e revisão. FinOps melhora potencialmente porque consultas e tentativas duplicadas diminuem. A palavra é potencialmente: nós vamos medir no episódio 12.”

### 17:00–19:30 — Caso, limites e fechamento

“No projeto privado auditado, tabelas Gold já alimentam dashboards e aplicações conversacionais, mas não encontramos semantic models nem métricas como código. Esse é um caso real da diferença: a regra materializada existe; a interface única de significado ainda pode evoluir. No laboratório, reproduzimos o padrão sem copiar código privado.

A Inventa reporta 83 métricas e redução de 90% na manutenção ao centralizar definições. É um case publicado pela dbt Labs, não uma taxa esperada para qualquer empresa. O mecanismo relevante é a substituição de fórmulas espalhadas por definições versionadas.

O anti-pattern oposto é criar uma semantic layer gigantesca sem acordar o que receita significa. YAML não resolve desacordo de negócio; ele registra a decisão depois que owner e consumidores chegam a um consenso.

No próximo episódio vamos transformar esses nomes em código executável com MetricFlow local e aberto.”

### Inserção obrigatória na demonstração — O join que multiplica dinheiro

“Antes de fechar, vale provocar o erro ao vivo. Um pedido pode ter dois itens e dois pagamentos. Se eu juntar `orders`, `order_items` e `order_payments` diretamente por `order_id`, obtenho quatro combinações. A soma de pagamentos dobra e a soma de itens também. O SQL é válido; o número é falso.

Vamos contar linhas em cada etapa. Primeiro, oito pedidos. Depois, dez itens e nove pagamentos. Agora faço o join bruto e mostro que o grão deixou de ser pedido. A solução não é colocar `distinct` no final sem pensar. `distinct` pode esconder duplicação e eliminar transações legítimas de mesmo valor. A solução é agregar cada relação ao grão pedido antes do join — exatamente o que a Gold faz.

Esse exemplo explica por que a entidade primária da camada semântica precisa corresponder ao grão real. Também explica por que um agente com acesso ao schema bruto está em desvantagem: ele precisa inferir cardinalidade e ordem de agregação em cada pergunta.

Na tela, vou escrever uma ficha de métrica:

```text
nome: delivered_revenue
pergunta: quanto pagamento foi reconhecido em pedidos entregues?
grão base: pedido
regra: total_payment quando status = delivered; caso contrário 0
tempo padrão: data da compra neste laboratório
owner: commerce
teste: 0 <= delivered_revenue <= total_payment
```

Repare na escolha temporal. Uma área financeira pode preferir data de entrega. Nesse caso não renomeamos silenciosamente a mesma métrica: discutimos se é outra dimensão temporal, outro filtro ou até outra métrica. A camada semântica torna o desacordo visível.”

## Demonstração e resultado esperado

- Comando: `python scripts/run_checkpoint.py 02`.
- Resultado: build do ramo Gold/semântico e `Ground truth OK: 10 perguntas`.
- Arquivos-chave: `order_fulfillment_g.sql`, `order_metrics_v2.sql`, `commerce_orders.sql`, `benchmarks/questions.json`.

## Governança, FinOps e IA

- Governança: nomes diferentes para conceitos diferentes; fachada pública versionável.
- FinOps: evita duplicação de transformação e joins exploratórios, a confirmar por medição.
- IA: reduz ambiguidade de grão, status, data e relacionamento.

## Limitações

- Semantic model não substitui modelagem dimensional bem-feita.
- Uma métrica correta pode usar dados atrasados; freshness é outra camada.
- A amostra sintética não representa volume ou distribuição real do Olist.

## Radar — máximo de dois minutos

“Core 2.0/Fusion pode ampliar validação semântica, mas continua fora do laboratório enquanto beta/preview. O formato novo do Core 1.12 é a referência executável; capacidades gerenciadas só aparecem na segunda temporada.”

## CTA

“Escolha três métricas do seu negócio e escreva, antes do SQL: nome, pergunta respondida, grão, filtro, data padrão e owner. Se duas pessoas discordarem, você encontrou a pauta do próximo refinement.”

## Fontes

- [Especificação recente de métricas do dbt](https://docs.getdbt.com/docs/build/latest-metrics-spec)
- [MetricFlow](https://github.com/dbt-labs/metricflow)
- [Case Inventa — resultado reportado pelo fornecedor](https://www.getdbt.com/case-studies/inventa)
- [Auditoria anonimizada do projeto](../pesquisa/auditoria-projeto-privado.md)
- [Checkpoint executável](../lab/dabdbt/checkpoints/02-gold-semantica.md)
