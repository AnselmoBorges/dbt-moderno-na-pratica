# Perfil MCP somente leitura

O arquivo `read-only.example.json` é um modelo deliberadamente incompleto: troque os marcadores pelos caminhos absolutos do seu clone. Não inclua o arquivo preenchido em commits.

| Sistema | Diretório de executáveis do ambiente |
|---|---|
| Windows | `lab\\dabdbt\\.venv\\Scripts` |
| macOS e Linux | `lab/dabdbt/.venv/bin` |

A allowlist contém apenas compilação, leitura e inspeção de metadados. O checkpoint 11 verifica tanto a política declarada quanto as ferramentas realmente expostas pelo servidor. SQL arbitrário, codegen e ferramentas de escrita permanecem desabilitados.

## Material complementar

- [About dbt MCP](https://docs.getdbt.com/docs/dbt-ai/about-mcp) — dbt Labs; documentação; inglês; explica transportes, ferramentas e configuração; episódio 11; verificado em 2026-09-01.
