# Glossário essencial

- **Adapter:** integração entre dbt e um mecanismo de dados.
- **Artifact:** arquivo JSON gerado pelo dbt com manifest, resultados ou catálogo.
- **Build:** comando que executa modelos, testes, snapshots e seeds selecionados.
- **Contract:** declaração estrutural que um modelo precisa cumprir.
- **DAG:** grafo de dependências criado principalmente por `ref` e `source`.
- **Data test:** consulta que retorna registros que violam uma regra.
- **Defer:** resolução de relações não construídas usando artifacts de outro estado.
- **Exposure:** consumidor conhecido, como dashboard, aplicação ou agente.
- **Gold:** camada de consumo com regras funcionais aplicadas; não é sinônimo de camada semântica.
- **Incremental:** materialização que processa apenas o recorte necessário após a primeira carga.
- **MetricFlow:** motor que compila consultas a métricas em SQL.
- **Semantic model:** declaração de entidades, dimensões e medidas sobre um modelo.
- **Source freshness:** avaliação do atraso de uma fonte.
- **Unit test:** teste de uma transformação isolada com entradas controladas.

## Material complementar

- [Glossário do dbt](https://docs.getdbt.com/terms) — dbt Labs, documentação/EN; verificado em 2026-09-01.
- [Glossário do DuckDB](https://duckdb.org/docs/stable/guides/glossary) — DuckDB, documentação/EN; verificado em 2026-09-01.

