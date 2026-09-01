# Checkpoints da temporada

Cada checkpoint é uma porta de qualidade executável. Rode `python scripts/run_checkpoint.py NN` na raiz de `dabdbt`. O projeto é cumulativo: os arquivos representam o estado final, enquanto os checkpoints isolam a capacidade apresentada em cada episódio.

| # | Capacidade comprovada | Critério automático |
|---|---|---|
| 01 | Playlist auditada/Core 1.12 | seed, parse, build e artifacts estáveis |
| 02 | Gold e semântica | Gold constrói e ground truth confere |
| 03 | MetricFlow | configuração valida e SQL mensal executa |
| 04 | Interoperabilidade aberta | MetricFlow, OSI e ground truth concordam |
| 05 | Contratos/versões | remoção incompatível de coluna é rejeitada |
| 06 | Qualidade | unit/data tests, contratos e freshness determinística passam |
| 07 | Governança | manifest contém owner, group, access e exposure |
| 08 | Data products abertos | interface pública, versão e grupo estão declarados sem Mesh pago |
| 09 | State/defer | mudança controlada seleciona apenas impacto e descendentes |
| 10 | FinOps | full/focused builds são medidos e preservam ground truth |
| 11 | MCP | servidor expõe somente cinco ferramentas de leitura |
| 12 | Agentes | dez perguntas e três modos de trace são avaliados |

Os resultados de duração variam por máquina. Os custos das fixtures de IA são sintéticos e servem apenas para testar o cálculo; não constituem evidência de economia real.
