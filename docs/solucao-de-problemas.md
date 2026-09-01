# Solução de problemas

## Python incorreto

Se `doctor` mostrar Python 3.11 ou 3.14, instale 3.12/3.13 e invoque explicitamente `py -3.12` no Windows ou `python3.12` em macOS/Linux.

## `python` ou `git` não encontrado

Feche e reabra o terminal após a instalação. No Windows, confirme a opção de `PATH`. Não altere arquivos internos do curso para compensar um executável ausente.

## Proxy ou certificado corporativo

O `setup` precisa acessar PyPI e GitHub na primeira execução. Solicite à equipe local a configuração oficial de proxy/certificado; não use opções que desabilitem validação TLS.

## Permissão ou caminho

Evite pastas sincronizadas com bloqueio agressivo. Espaços e acentos são suportados. Se o relatório indicar falta de escrita, mova o clone para uma pasta do seu usuário.

## DuckDB está bloqueado

Feche notebooks, extensões SQL ou outro terminal conectado ao arquivo `lab/data/dabdbt.duckdb` e execute o checkpoint novamente. DuckDB documenta que múltiplos processos gravando no mesmo arquivo não são o modo principal de concorrência.

## Instalação interrompida

Execute novamente `python course.py setup`. O processo é idempotente e reaproveita downloads válidos.

## Ainda não resolveu

Execute `python course.py support-report` e abra uma issue usando o [modelo de pedido de ajuda](pedir-ajuda.md). Nunca cole `.env`, tokens, profiles privados ou variáveis de ambiente.

## Material complementar

- [Concorrência no DuckDB](https://duckdb.org/docs/stable/connect/concurrency) — DuckDB, documentação/EN; verificado em 2026-09-01.
- [Ajuda e comunidade dbt](https://docs.getdbt.com/community/resources/getting-help) — dbt Labs, documentação/EN; verificado em 2026-09-01.

