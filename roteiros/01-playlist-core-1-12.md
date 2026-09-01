# Episódio 1 — O que a série ensinou e o baseline Core 1.12

**Duração alvo:** 20–23 minutos
**Nível:** iniciante/intermediário
**Rótulos na tela:** `OPEN`, `Core 1.12: suportado`, `LAB`, `Radar: beta/preview`

## Gancho

“Os títulos da série antiga dizem incremental, tests, docs, lineage e deploy. Mas o que nós realmente colocamos para rodar? Hoje eu vou auditar meu próprio conteúdo, corrigir o que envelheceu e deixar uma base Core 1.12 que qualquer pessoa consegue reproduzir sem cloud.”

## Objetivo e pré-requisitos

Ao final, a pessoa saberá o que pode assumir como pré-requisito, instalará a versão suportada e produzirá os quatro artifacts usados no restante da temporada.

Pré-requisitos: Python 3.12 ou 3.13, Git, terminal e `lab/dabdbt`. O conjunto fixado não suporta Python 3.14. Nenhuma conta dbt ou Databricks.

## Roteiro falado

### 00:00–03:30 — Auditar o conteúdo, não o título

“A aula teórica realmente explica models, `ref`, tests, docs, snapshots, perfis e materializações. Ela também defende, perto de 24 minutos, que a regra saia do BI e vá para o pipeline; perto de 45 minutos conecta qualidade de dados com a qualidade de uma LLM. Essa tese continua atual.

Nos hands-ons, o alcance é menor. Nós configuramos Python, adapter, profile, seeds e DuckDB; criamos staging, usamos `ref`, comparamos table/view e terminamos com uma Gold simples. O vídeo chamado incremental não implementa incremental. O de tests/docs executa seeds. O de deploy não faz deploy. Isso não invalida a série; apenas define onde esta nova temporada começa.”

**Visual:** tabela `título / conteúdo demonstrado / novo episódio`, baseada em `pesquisa/auditoria-playlist.md`.

### 03:30–07:00 — Cinco correções que merecem ficar registradas

“Primeiro: instale o adapter compatível, não um pacote genérico sem versão. Segundo: CTE organiza SQL, mas o ganho de performance depende do engine. Terceiro: snapshot preserva histórico de mudança; não é sinônimo de incremental barato. Quarto: tests reduzem risco, mas não garantem que produção nunca quebra. Quinto: Core open source, plano Developer gratuito, Platform paga e Fusion não são a mesma coisa.

O nosso baseline é Core 1.12.3 com DuckDB 1.11.0. O projeto exige `>=1.12,<1.13`; uma instalação incompatível falha cedo.”

### 07:00–10:30 — O projeto privado muda o diagnóstico

“Eu consegui auditar, em modo leitura, o projeto que antes parecia indisponível. Ele já tem múltiplos projetos dbt, Bundles, CI/CD, catálogo, groups, access, contratos, unit tests e exposures para aplicações. Portanto, a pergunta não é ‘como adicionar tudo do zero?’.

As lacunas reais são consistência: métricas ainda não estão como código, versões e freshness aparecem mais como orientação que execução, CI roda blocos amplos e alguns incrementais usam `merge` sem filtro incremental localizado. O laboratório transforma esses padrões em Olist, sem publicar nomes, código ou infraestrutura privada.”

**Visual:** duas colunas: `já existe` e `próxima evolução`; selo `auditoria privada anonimizada`.

### 10:30–17:30 — Demonstração estável

```bash
cd lab/dabdbt
python -m venv .venv
source .venv/bin/activate
pip install -r requirements-local.txt
python scripts/run_checkpoint.py 01
```

“O checkpoint carrega os seeds, cria uma fonte de freshness com horário atual, faz parse e build. Ele termina verificando quatro contratos de máquina:

- `manifest.json`: DAG, configurações, owners e exposures;
- `semantic_manifest.json`: representação usada pelo motor semântico;
- `osi_document.json`: documento semântico interoperável;
- `run_results.json`: resultado do build.

O esperado é `Checkpoint 01 OK`. No build completo são 14 modelos, 25 data tests, cinco seeds, um unit test, cinco métricas, um semantic model, uma exposure e um group. O exposure aparece como `NO-OP`, não como erro.”

### 17:30–20:00 — Por que artifacts importam

“O HTML de documentação é útil para pessoas; artifacts são úteis para automação. A CI compara manifests. O MCP lê manifest. O benchmark descobre o contrato. O episódio nove calcula impacto. Uma única saída do Core alimenta governança, FinOps e IA sem dar ao agente acesso irrestrito ao warehouse.”

### 20:00–22:30 — Fechamento

“A regra desta temporada é simples: só chamamos de coberto aquilo que roda. E só chamamos de estável o que entra na CI. No próximo episódio vamos separar Gold de camada semântica usando regras que já existem no cenário real.”

## Demonstração e resultado esperado

- `python scripts/run_checkpoint.py 01` retorna sucesso.
- Core reporta 1.12.3 e DuckDB 1.11.0.
- Quatro artifacts obrigatórios existem e são válidos.
- Não há instalação ou execução de Fusion.

## Governança, FinOps e IA

- Governança: inventário real evita planejar sobre lacunas imaginárias.
- FinOps: validação local encontra erros antes de acionar compute cloud.
- IA: artifacts oferecem contexto estruturado sem despejar dados brutos.

## Limitações e anti-patterns

- Legendas automáticas podem errar termos; use timestamps e contexto.
- Auditoria estática não prova comportamento nem custo de produção.
- Não usar os números do DuckDB como estimativa de DBUs.
- Não habilitar flags preview apenas porque aparecem no projeto.

## Radar — máximo de dois minutos

“Core 2.0 aberto está beta. dbt v2/Fusion e cada adapter têm maturidade própria e licença distinta. Eles não entram no ambiente, na CI ou no benchmark desta temporada. Consulte a matriz oficial antes de gravar; quando ficarem adequados ao seu adapter, faça uma série específica de migração.”

## CTA

“Rode o checkpoint 01 e compare a lista ‘o que eu pensei que já tinha’ com ‘o que meu manifest comprova’. Essa diferença é o backlog real.”

## Fontes

- [Auditoria da playlist](../pesquisa/auditoria-playlist.md)
- [Auditoria anonimizada do projeto](../pesquisa/auditoria-projeto-privado.md)
- [dbt Core 1.12](https://github.com/dbt-labs/dbt-core/releases/tag/v1.12.0)
- [Matriz oficial de recursos](https://docs.getdbt.com/docs/dbt/supported-features)
- [Checkpoint executável](../lab/dabdbt/checkpoints/01-core-1-12.md)
