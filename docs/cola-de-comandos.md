# Cola de comandos

Execute na raiz do repositório. Se `python` estiver indisponível, use o [comando do Python do seu sistema](instalacao/README.md).

| Objetivo | Comando |
|---|---|
| Ver pré-requisitos e versão instalada | `python course.py doctor` |
| Preparar ou atualizar o ambiente | `python course.py setup` |
| Conferir os caminhos usados no computador ou no Codespaces | `python course.py paths` |
| Gerar o banco e a documentação pela primeira vez | `python course.py checkpoint 01` |
| Rodar uma aula após o checkpoint 01 | `python course.py checkpoint NN`, com `NN` de 02 a 12 |
| Executar a consulta da Aula 02 no terminal | `python course.py sql 02` |
| Obter os dados do gráfico final no terminal | `python course.py sql 12-insight` |
| Rodar a suíte principal do curso | `python course.py validate` |
| Gerar relatório sanitizado para pedir ajuda | `python course.py support-report` |

## Interfaces no navegador

| Interface | Comando | Porta padrão | Pré-requisito |
|---|---|---|---|
| Explorador do curso | `python course.py data-ui` | 4213 | Checkpoint 01 ou o checkpoint da consulta escolhida |
| dbt Docs da temporada | `python course.py docs` | 8080 | Checkpoint 01 |
| dbt Docs da aula bônus | `python course.py bonus-v2 docs` | 8580 | `python course.py bonus-v2 setup` e `python course.py bonus-v2 compare` |

Mantenha o terminal aberto. No Codespaces, use **Ports** com visibilidade **Private**. Localmente, abra `http://localhost` com a porta correspondente, como `http://localhost:8080`. Use **Ctrl+C** para sair. A [DuckDB UI oficial por túnel](codespaces.md#alternativa-avançada--duckdb-ui-oficial-por-túnel) também usa 4213 por padrão. Encerre o Explorador antes de iniciar essa opção.

## Comandos internos do laboratório para demonstração

Os slides usam `course.py` na raiz. Para reproduzir trechos de roteiro que mostram `dbt`, `mf` ou um script Python interno, entre em `lab/dabdbt` e use o executável do ambiente do curso.

| Comando na demonstração | Bash (Codespaces, macOS e Linux) | PowerShell (Windows) |
|---|---|---|
| `dbt` | `./.venv/bin/dbt` | `.\.venv\Scripts\dbt.exe` |
| `mf` | `./.venv/bin/mf` | `.\.venv\Scripts\mf.exe` |
| `python scripts/...` | `./.venv/bin/python scripts/...` | `.\.venv\Scripts\python.exe scripts/...` |

Para o dbt, mantenha `--profiles-dir dbt_profiles --target local`. Para o MetricFlow, defina `DBT_PROFILES_DIR` antes de rodar `mf`. No Bash, use `export DBT_PROFILES_DIR=dbt_profiles`. No PowerShell, use `$env:DBT_PROFILES_DIR = "dbt_profiles"`. Quando copiar um comando Bash com barras invertidas no fim das linhas, junte os argumentos em uma linha no PowerShell. Volte à raiz para executar `course.py`.

## Material complementar

- [Consultas, capturas e gráfico das aulas](praticas-duckdb.md) — passos de execução e leitura.
- [Escopo e resultados da validação](validacao-do-curso.md) — suíte e matriz de ambientes.
- [Referência de comandos dbt](https://docs.getdbt.com/reference/dbt-commands) — dbt Labs, documentação/EN.
