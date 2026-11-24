# Solução de problemas

## Codespaces não abre ou não aparece

Use o [link direto e o tutorial ilustrado](codespaces.md). Confirme que você está conectado a uma conta pessoal GitHub e que a configuração selecionada é `dbt Moderno na Prática` com máquina `2-core`.

Se a franquia mensal tiver terminado, aguarde a renovação ou siga a instalação local. O conteúdo e os checkpoints são os mesmos.

## Codespaces abriu, mas o setup parou

Abra **Terminal → New Terminal** e execute `python course.py setup`. O processo pode ser repetido. Depois, rode `python course.py doctor` e `python course.py checkpoint 01`.

## Apareceram `^C`, `KeyboardInterrupt` ou muitos `Requirement already satisfied`

`^C` indica que `Ctrl+C` interrompeu o processo; não é uma falha de versão do dbt. Atualize o repositório e execute `python course.py setup` novamente. O setup atual detecta o ambiente completo, pula `pip` e `dbt deps` quando eles já estão prontos e mostra apenas três etapas na primeira instalação. Não execute `source .../.venv/bin/activate`: o launcher seleciona o ambiente automaticamente.

No checkpoint, `NO-OP exposure ...` é esperado. Considere sucesso quando o resumo terminar com `ERROR=0` e aparecer `Checkpoint 01 OK`.

## Power User mostra dbt 1.11 e perfil ausente

Esse erro vem do assistente da extensão **dbt Power User**, não do ambiente isolado do curso. O caso típico combina estas mensagens:

- `Running with dbt=1.11.x`;
- `profiles.yml file [ERROR not found]` em `~/.dbt`;
- `Required version of dbt ... >=1.12.0,<1.13.0`.

O laboratório não precisa dessa extensão. Feche **Get Started with dbt Power User**, desabilite ou desinstale **dbt Power User** no Codespace e execute:

```bash
python course.py doctor
python course.py checkpoint 01
```

Execute `python course.py setup` entre esses dois comandos somente quando o diagnóstico não disser **Ambiente preparado**.

O diagnóstico mostra `dbt Core do curso: 1.12.7` após o setup. Se você atualizou o repositório e ainda vê a versão anterior, rode `python course.py setup` na raiz para atualizar a `.venv` existente. Use o perfil versionado que o launcher seleciona.

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

## O navegador mostra `Initialization Error` ou erro de `DataView`

Esse erro pertence à DuckDB UI oficial quando acessada por túnel/proxy. Atualize o repositório, encerre o processo antigo e execute `python course.py data-ui`. Mantenha o terminal aberto e, na guia **Ports**, abra **Explorador DuckDB** na porta privada 4213. A página correta exibe “interface autoral do curso”. Para atualizar os dados, encerre com Ctrl+C e inicie novamente: cada execução cria uma nova cópia somente leitura.

## Preciso localizar o dbt, DuckDB ou profile

Execute `python course.py paths`. O resultado também fica em `build/environment-info.json`. No Codespaces, esses caminhos são atualizados a cada abertura; não crie um segundo profile em `~/.dbt` e não é necessário ativar a `.venv`.

## Instalação interrompida

Execute novamente `python course.py setup`. O processo é idempotente e reaproveita downloads válidos.

## A aula não encontrou uma tabela, um manifesto ou um JSON

Em uma instalação nova, rode `python course.py checkpoint 01` antes das aulas 02–12. Se a consulta lê um relatório de state, FinOps, MCP ou benchmark, execute também o checkpoint da própria aula. Se o Explorador estiver aberto durante o build, feche e abra de novo para renovar a cópia dos dados.

## A interface não abre ou a porta está em uso

Confira a [tabela de comandos e portas](cola-de-comandos.md#interfaces-no-navegador) e mantenha o terminal do servidor aberto. Na aba **Ports** do Codespaces, encaminhe a porta correspondente com visibilidade **Private**. Para uma porta já ocupada, pare o servidor anterior ou escolha outra com `--port`. No túnel oficial, use o mesmo número no Codespaces e no computador local.

## O bônus v2 mostrou erro de instruções múltiplas

Confira `resultado_migracao` em `build/bonus-v2/resultado.json`. Quando o relatório existe e diz `bloqueada`, a comparação terminou e registrou uma falha do build v2. Os logs dessa execução mostram em quais modelos ocorreu. Se o comando terminou antes de gravar um novo relatório, leia o log apontado no terminal. O JSON na raiz de `build/bonus-v2/` guarda a última comparação concluída. [Roteiro do bônus](../roteiros/bonus-migracao-v2.md#checkpoint-executável) · [Resultados por ambiente](validacao-do-curso.md#evidência-do-bônus)

## Não consegui atualizar um Codespace existente

Se `git pull --ff-only` apontar divergência, use `git status` para entender a branch e os arquivos locais. Salve seu trabalho em uma branch ou fork antes de juntar as mudanças. Você também pode abrir um Codespace novo a partir da `main` do curso e manter o anterior para consulta. [Guia do Codespaces](codespaces.md#atualize-um-codespace-existente)

## Ainda não resolveu

Execute `python course.py support-report` e abra uma issue usando o [modelo de pedido de ajuda](pedir-ajuda.md). Nunca cole `.env`, tokens, profiles privados ou variáveis de ambiente.

## Material complementar

- [Concorrência no DuckDB](https://duckdb.org/docs/stable/connect/concurrency) — DuckDB, documentação/EN; verificado em 2026-09-01.
- [Limitação da DuckDB UI em containers](https://github.com/duckdb/duckdb-ui/issues/22) — DuckDB, issue oficial/EN; verificado em 2026-09-02.
- [Erro DataView ao usar túnel](https://github.com/duckdb/duckdb-ui/issues/186) — DuckDB, issue oficial/EN; verificado em 2026-09-02.
- [Ajuda e comunidade dbt](https://docs.getdbt.com/community/resources/getting-help) — dbt Labs, documentação/EN; verificado em 2026-09-01.
