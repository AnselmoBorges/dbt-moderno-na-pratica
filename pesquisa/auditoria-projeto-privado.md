# Auditoria anonimizada do projeto privado

**Referência interna:** repositório privado autorizado pelo proprietário.
**Commit auditado:** `0683a9f50cd156deeeb6649a071de5c008468287`
**Método:** leitura estática de configurações, modelos, documentação e workflows. Nenhuma execução cloud, alteração remota ou coleta de credenciais.

## Limites de divulgação

Este relatório preserva somente padrões arquiteturais. Foram excluídos nomes de empresas/clientes, pessoas, e-mails, URLs, identificadores de workspace, catálogos, secrets, caminhos internos e trechos de código proprietários. Os exemplos públicos são reconstruídos com a amostra Olist.

## O que existe e vale trazer para a série

### Portfólio por domínio

O repositório contém dez projetos dbt e um template. Essa topologia é evidência de uma organização que já saiu do projeto único e precisa tratar dependências, padrões e versões de runtime como portfólio.

Gancho editorial: “Mesh não começa comprando cross-project refs; começa descobrindo quem possui cada interface e quanto os projetos já divergiram”.

### Entrega e governança cloud

Há Databricks Asset Bundles, pipelines por ambiente, integração com catálogo e automações de deploy. Alguns produtos Gold alimentam dashboards e aplicações conversacionais, registradas por exposures.

Gancho editorial: “Uma tabela pode estar em produção e exposta a IA sem ainda possuir uma métrica semântica”.

### Governança do manifest

Os projetos mais maduros usam:

- `groups` e owners;
- `access` privado, protegido e público por camada;
- contratos enforced em modelos Gold;
- unit tests de regras funcionais;
- tags e metadados de catálogo;
- exposures para dashboards e assistentes.

Isso corrige a hipótese anterior de que essas capacidades estavam totalmente ausentes. A nova temporada deve mostrar como uniformizá-las e torná-las verificáveis.

## Lacunas confirmadas

### Semântica

Não foram encontrados semantic models nem métricas como código. Regras e medidas aparecem em tabelas Gold, configurações de ferramenta analítica e documentação. É o cenário ideal para o episódio “Gold não é semântica”: a regra materializada existe, mas ainda falta uma interface única de significado.

### Contratos versus versões

Contratos existem em parte do portfólio. Model versions foram localizadas em documentação de orientação, não em YAML executável. A série deve separar contrato, versão e documentação de intenção.

### Freshness

Há documentação sobre source freshness, mas não foi localizada configuração executável suficiente para provar a política. O laboratório inclui uma fonte sintética com timestamp de carga corrente e falha reproduzível quando a carga é envelhecida.

### CI por estado

Os workflows encontrados selecionam projetos alterados, mas executam `dbt run`/`dbt test` amplamente dentro deles. Não foram encontrados `state:modified` ou `--defer`. O episódio 9 mostrará a evolução de “qual projeto mudou?” para “quais nós e descendentes mudaram?”.

### Incrementais e microbatch

Foram encontrados modelos `incremental` com estratégias `merge` e `insert_overwrite`. Não foi encontrado `is_incremental()` nos modelos SQL auditados. Estratégia incremental sem filtro de origem pode continuar lendo todo o conjunto e apenas mudar a forma de escrita.

A flag de microbatch aparece em vários projetos, mas não foram encontrados, no conjunto inspecionado, `event_time`, `batch_size` ou `lookback` que comprovem um modelo microbatch operacional. O conteúdo público não apresentará a flag como economia realizada.

### Compatibilidade

As dependências variam entre faixas amplas, principalmente `dbt-databricks >=1.8,<2.0` e `>=1.11,<2.0`. Isso permite resolver versões diferentes em cada instalação. A recomendação é uma matriz de compatibilidade por projeto, lock reprodutível e baseline suportado antes de ativar flags novas.

## Mapeamento para o laboratório Olist

| Aprendizado privado | Exemplo Olist público | Evidência de aceite |
|---|---|---|
| regras na Gold consumidas por múltiplas interfaces | receita entregue e prazo de entrega | ground truth de dez perguntas |
| contrato em produto Gold | `order_metrics` | build e breaking change negativo |
| owner/group/access | domínio `commerce` | leitura do manifest |
| exposures de aplicação | agente de comércio somente leitura | manifest e MCP |
| deploy amplo | `state:modified+` e defer | relatório de seleção |
| merge sem filtro | `orders_s` com `is_incremental()` | full refresh versus incremental |
| flag de microbatch sem prova | checklist `event_time`/lotes | não ativar sem cenário temporal |
| assistente recebe contexto disperso | manifest + métricas + MCP | benchmark com traces fixos |

## Recomendações para o cenário real

1. Consolidar um baseline suportado de dbt/adapter e gerar lock por projeto.
2. Escolher de cinco a dez métricas Gold críticas e migrá-las para definições semânticas.
3. Aplicar versões primeiro às interfaces públicas que já possuem exposures.
4. Tornar source freshness executável e ligada ao runbook de incidentes.
5. Publicar artifacts de produção e introduzir `state:modified+` em modo informativo antes de bloquear CI.
6. Auditar cada incremental com três perguntas: filtro de origem, chave/idempotência e late data.
7. Tratar microbatch como materialização completa, não como flag global.
8. Criar identidade e allowlist separadas para agentes; não reutilizar permissões de desenvolvimento.

## O que não será afirmado

- Que o projeto possui falha de produção: a auditoria foi estática.
- Que as configurações sem filtro necessariamente geraram custo excessivo: isso exige query history e billing.
- Que o assistente atual inventa regras: não houve benchmark do ambiente privado.
- Que Mesh ou Semantic Layer gerenciada são necessários: primeiro serão esgotadas as alternativas abertas.

## Material complementar

- [Model governance](https://docs.getdbt.com/docs/mesh/govern/about-model-governance) — dbt Labs, documentação/EN; referência pública para os padrões anonimizados; episódios 5–8; verificado em 2026-09-01.
- [Incremental models](https://docs.getdbt.com/docs/build/incremental-models-overview) — dbt Labs, documentação/EN; critério técnico para a auditoria de filtros; episódio 10; verificado em 2026-09-01.
