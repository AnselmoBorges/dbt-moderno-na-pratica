# Roteiros — dbt Moderno na Prática

## Da Gold aos Agentes de IA

## Temporada 1 — open source e estável

Os 12 episódios usam dbt Core 1.12, DuckDB, MetricFlow e dbt MCP local. Cada roteiro termina em um checkpoint executável e possui um quadro Radar separado, sem dependência beta/preview.

Antes deles, a [Aula 0](aula-00-ambiente.md) prepara Windows, macOS, Linux ou Codespaces sem renumerar a temporada.

| # | Episódio | Duração |
|---|---|---|
| 01 | [O que a série ensinou e o baseline Core 1.12](01-playlist-core-1-12.md) | 20–23 min |
| 02 | [Gold não é camada semântica](02-gold-nao-e-semantica.md) | 18–20 min |
| 03 | [MetricFlow local: métricas como código](03-metricflow-local.md) | 22–25 min |
| 04 | [Semântica aberta e interoperável](04-semantica-aberta-interoperavel.md) | 20–23 min |
| 05 | [Contratos e versões: Gold como API](05-contratos-versoes.md) | 20–23 min |
| 06 | [A pirâmide moderna de qualidade](06-piramide-qualidade.md) | 20–23 min |
| 07 | [Governança como código](07-governanca-como-codigo.md) | 19–22 min |
| 08 | [Data products sem depender de Mesh](08-data-products-open.md) | 19–22 min |
| 09 | [CI inteligente com artifacts, state e defer](09-ci-state-defer.md) | 20–23 min |
| 10 | [FinOps do pipeline](10-finops-pipeline.md) | 22–25 min |
| 11 | [dbt MCP local e somente leitura](11-dbt-mcp.md) | 20–23 min |
| 12 | [Gold governada versus agente solto](12-gold-governada-agente-solto.md) | 23–25 min |

## Temporada 2 — dbt Platform e acesso contratado

Estes roteiros só serão gravados depois da temporada open. Todos possuem rota com acesso real e fallback documental; nenhuma tela ou fixture será apresentada como execução do produto.

| # | Episódio | Dependência | Duração |
|---|---|---|---|
| 13 | [Developer e Starter trial](13-developer-starter-trial.md) | conta/trial | 18–22 min |
| 14 | [Semantic Layer gerenciada](14-semantic-layer-gerenciada.md) | Starter ou superior compatível | 20–24 min |
| 15 | [Mesh e governança Enterprise](15-mesh-governanca-enterprise.md) | Enterprise/demo ou fallback | 20–24 min |
| 16 | [MCP gerenciado e agentes](16-mcp-gerenciado-agentes.md) | Platform compatível | 21–25 min |

## Convenções editoriais

- **OPEN:** software e caminho executável abertos.
- **GRATUITO:** serviço sem cobrança dentro dos limites, não necessariamente open source.
- **PAGO/ENTERPRISE:** depende de plano ou contrato.
- **BETA/PREVIEW:** apenas Radar; nunca requisito do laboratório.
- **LAB:** resultado reproduzido localmente.
- **FORNECEDOR:** número ou conclusão reportado em case/blog comercial.
- **FIXTURE:** dado sintético que valida CI, não benchmark de LLM.

## Apresentações

O piloto público contém PPTX e PDF da Aula 0 e do episódio 1 em [`assets/decks`](../assets/decks/README.md). Os demais decks serão produzidos somente depois da aprovação visual e didática do piloto.

## Material complementar

- [dbt Learn](https://www.getdbt.com/dbt-learn) — dbt Labs, cursos/EN; referência de progressão didática; toda a série; verificado em 2026-09-01.
- [Catálogo visual e atribuições](../assets/README.md) — Rescue Point, documentação/PT-BR; regras de imagens, diagramas e licença; toda a série; verificado em 2026-09-01.
