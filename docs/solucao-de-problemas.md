# Solução de problemas

## Codespaces não abre ou não aparece

Use o [link direto e o tutorial ilustrado](codespaces.md). Confirme que você está conectado a uma conta pessoal GitHub e que a configuração selecionada é `dbt Moderno na Prática` com máquina `2-core`.

Se a franquia mensal tiver terminado, aguarde a renovação ou siga a instalação local. O conteúdo e os checkpoints são os mesmos.

## Codespaces abriu, mas o setup parou

Abra **Terminal → New Terminal** e execute `python course.py setup`. O processo pode ser repetido. Depois, rode `python course.py doctor` e `python course.py checkpoint 01`.

## Power User mostra dbt 1.11 e perfil ausente

Esse erro vem do assistente da extensão **dbt Power User**, não do ambiente isolado do curso. O caso típico combina estas mensagens:

- `Running with dbt=1.11.x`;
- `profiles.yml file [ERROR not found]` em `~/.dbt`;
- `Required version of dbt ... >=1.12.0,<1.13.0`.

O laboratório não precisa dessa extensão. Feche **Get Started with dbt Power User**, desabilite ou desinstale **dbt Power User** no Codespace e execute:

```bash
python course.py setup
python course.py doctor
python course.py checkpoint 01
```

O diagnóstico correto mostra `dbt Core do curso: 1.12.3`. Não use `--no-version-check` e não crie `~/.dbt/profiles.yml`: isso esconderia a divergência em vez de usar o perfil versionado do curso.

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
