# Checkpoints da temporada

Na raiz do repositório, rode `python course.py setup` se o ambiente estiver pendente e execute `python course.py checkpoint 01`. Ele cria o banco e os artefatos usados pelas demais aulas. Depois, rode `python course.py checkpoint NN` para o tema escolhido. Os arquivos representam o estado final do curso.

O [guia ilustrado dos checkpoints](../../../docs/resultados-dos-checkpoints.md) mostra os resultados de uma execução no Codespaces e indica o que procurar no terminal.

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

A [aula bônus do dbt OSS v2](../../../roteiros/bonus-migracao-v2.md) usa `python course.py bonus-v2 compare` e tem seu próprio laboratório.

Os resultados de duração variam por máquina. Os custos das fixtures de IA são sintéticos e servem apenas para testar o cálculo; não constituem evidência de economia real.
