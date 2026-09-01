# Pré-requisitos e autoavaliação

## Conhecimento mínimo

Você precisa reconhecer `select`, `where`, `join`, `group by` e funções de agregação como `sum` e `count`. O curso explica terminal, Git, Python e dbt desde o começo.

Responda sem executar:

1. Qual coluna liga `orders` a `payments`?
2. Por que um `join` entre duas relações um-para-muitos pode duplicar dinheiro?
3. Quando usar `count(*)` e quando usar `count(distinct order_id)`?
4. Qual a diferença entre filtrar antes e depois de uma agregação?

Se duas ou mais perguntas forem desconhecidas, faça primeiro uma revisão curta de SQL. Isso não impede a Aula 0.

## Software

- Python 3.12 ou 3.13 de 64 bits.
- Git.
- Navegador e terminal.
- Editor recomendado: VS Code, sem ser obrigatório.

Python 3.11 e 3.14 não são aceitos pelo conjunto fixado. O motivo é compatibilidade de dependências, especialmente do servidor MCP, e não uma limitação geral do dbt.

## Hardware

- Meta de validação: 2 CPUs, 4 GB de RAM e 2 GB livres.
- Esse valor ainda é uma meta, não um mínimo certificado, até a execução controlada descrita no projeto.
- O laboratório usa uma amostra pequena e DuckDB local; não precisa de GPU.

## Contas que não são necessárias

Você não precisa de Databricks, dbt Platform, provedor de LLM, Gemini ou cartão de crédito para a temporada open.

## Material complementar

- [Pré-requisitos do quickstart manual](https://docs.getdbt.com/guides/manual-install?step=1) — dbt Labs, documentação/EN, terminal e instalação; verificado em 2026-09-01.
- [Introdução SQL do DuckDB](https://duckdb.org/docs/stable/sql/introduction) — DuckDB, documentação/EN, revisão de SQL local; verificado em 2026-09-01.

