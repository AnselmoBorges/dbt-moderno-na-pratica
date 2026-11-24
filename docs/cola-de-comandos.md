# Cola de comandos

Execute na raiz do repositório:

| Objetivo | Comando |
|---|---|
| Diagnosticar | `python course.py doctor` |
| Preparar | `python course.py setup` |
| Conferir caminhos do ambiente | `python course.py paths` |
| Rodar uma aula | `python course.py checkpoint NN` |
| Abrir o explorador DuckDB do curso | `python course.py data-ui` |
| Validar tudo | `python course.py validate` |
| Gerar relatório de ajuda | `python course.py support-report` |

Comandos dbt mostrados nas aulas são executados pelo launcher, mas continuam disponíveis dentro de `lab/dabdbt/.venv` para exploração avançada.

## Material complementar

- `python course.py data-ui` abre o Explorador DuckDB. `python course.py sql 02` roda o SQL da aula 02 no terminal.
- `python course.py docs` serve a documentação gerada pelo checkpoint 01 na porta 8080.
- [Consultas, prints e gráfico das aulas](praticas-duckdb.md) — passos de execução e como ler os resultados.

- [Referência de comandos dbt](https://docs.getdbt.com/reference/dbt-commands) — dbt Labs, documentação/EN; verificado em 2026-09-01.
