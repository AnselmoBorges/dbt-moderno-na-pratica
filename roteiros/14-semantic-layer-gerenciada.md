# Episódio 14 — Semantic Layer gerenciada: API, cache e consumidores

**Duração alvo:** 20–24 minutos
**Temporada:** dbt Platform
**Rótulos na tela:** `PROPRIETÁRIO`, `plano compatível`, `resultado reconciliado`, `case: FORNECEDOR`

## Gancho

“Nos episódios open nós já provamos que uma métrica gera SQL e resultado corretos. Então o que estamos pagando para gerenciar? Hoje vamos medir a camada operacional: autenticação, API, integrações, cache e observabilidade do consumo.”

## Objetivo e pré-requisitos

Implantar as mesmas métricas Olist na Semantic Layer gerenciada, consultar por interface suportada e reconciliar com MetricFlow/DuckDB sem esconder fronteiras de plano.

Pré-requisitos: episódio 13, trial Starter ativo ou acesso compatível, métricas do episódio 3 e autorização para usar credencial temporária.

## Roteiro falado

### 00:00–04:00 — O que continua igual

“Entidade, grão, dimensão, métrica e owner continuam no código. Se `delivered_revenue` estiver errada, a hospedagem não corrige a regra. O serviço acrescenta endpoint, autenticação, integrações e operação.”

### 04:00–08:00 — O contrato da consulta

“Registre métrica, dimensões, filtros, timezone, ambiente, freshness e formato de resposta. Uma API que retorna 200 com conceito errado continua sendo falha.”

**Visual:** request lógico, SQL compilado, resultado e ground truth; token oculto.

### 08:00–14:00 — Rota A: demonstração com acesso

1. Publicar o projeto/manifest no ambiente de demonstração.
2. Confirmar `orders`, `gross_revenue`, `delivered_revenue` e `average_order_value`.
3. Consultar janeiro–abril por interface/API oficialmente disponível no plano.
4. Repetir uma consulta e registrar se há informação observável de cache/latência.
5. Consultar abril e reconciliar 210; reconciliar total 740/630/92,50.
6. Revogar o token de demonstração ao final.

“Não mostre curl inventado. Use o exemplo gerado pela documentação da conta e oculte headers, host e IDs.”

### 14:00–17:00 — Rota B: fallback documental

“Sem acesso, execute o checkpoint 04 e mostre a documentação da API gerenciada. Marque `não executado`. Explique o que seria medido: autenticação, latência, cache hit, limites e reconciliação. Não atribua resultado ao produto.”

### 17:00–21:00 — Cases e decisão

“A Inventa reporta 83 métricas e 90% menos manutenção. A Bilt reporta 80% menos custo de analytics. São resultados da empresa/dbt Labs. Use-os para formular hipóteses: manutenção por métrica, consultas repetidas, custo do BI e tempo de integração. O trial mede apenas a amostra Olist.”

### 21:00–23:00 — Fechamento

“Adote o serviço quando múltiplos consumidores precisam de operação que sua equipe não quer manter. Se o único consumidor é SQL local e dez métricas, MetricFlow aberto pode bastar. A decisão é custo total e governança, não prestígio da arquitetura.”

## Demonstração e resultado esperado

- Mesmas cinco métricas do laboratório, sem fórmulas duplicadas.
- Valores Platform iguais ao ground truth local.
- Plano, interface e data identificados.
- Cache só recebe claim se houver evidência observável.

## Sugestões visuais

- request/response saneados;
- matriz `definição / operação / consumidor`;
- reconciliação lado a lado;
- selo FORNECEDOR em todos os números de case.

## Governança, FinOps e IA

- Governança: tokens por ambiente e métricas com owner.
- FinOps: medir consultas de métricas, cache e compute subjacente separadamente.
- IA: interface semântica reduz payload, mas IAM e budget continuam externos.

## Limitações e anti-patterns

- Integrações e limites variam por plano.
- Não concluir causalidade com uma execução de oito pedidos.
- Não expor token em terminal ou histórico.
- Não chamar disponibilidade de API de “camada semântica pronta” sem owner/testes.

## Radar — máximo de dois minutos

“A especificação, os conectores e limites de consulta podem mudar. Revalide a página de preços e documentação. Recursos preview ficam rotulados e fora da conclusão de adoção.”

## CTA

“Escolha uma métrica e reconcilie local e gerenciada com o mesmo filtro. Publique a diferença operacional e o custo, não só o fato de a API responder.”

## Fontes

- [dbt Semantic Layer](https://docs.getdbt.com/docs/use-dbt-semantic-layer/dbt-sl)
- [Preços e limites](https://www.getdbt.com/pricing)
- [Case Inventa — resultado reportado](https://www.getdbt.com/case-studies/inventa)
- [Case Bilt — resultado reportado](https://www.getdbt.com/case-studies/bilt-rewards)
- [Checkpoint open de referência](../lab/dabdbt/checkpoints/04-interfaces.md)
