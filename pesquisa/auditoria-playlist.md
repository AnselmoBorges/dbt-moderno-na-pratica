# Auditoria da playlist DBT do Rescue Point

**Método:** revisão das legendas automáticas em português e conferência dos trechos relevantes dos seis vídeos. As legendas podem conter erros de nomes próprios e termos técnicos; por isso este arquivo resume, em vez de reproduzir, o conteúdo.
**Data da revisão:** 1º de setembro de 2026.

## Resultado geral

A playlist ensina a motivação do dbt e constrói um primeiro pipeline Olist. Os títulos dos hands-ons, entretanto, antecipam assuntos que não chegam a ser implementados nos respectivos vídeos. O novo conteúdo deve partir do que foi realmente mostrado, não do título ou descrição.

## 1. Aula teórica — `ZAgoqhlR95g`

**Título:** [dbt Core na prática: o que você precisa saber antes do hands-on](https://www.youtube.com/watch?v=ZAgoqhlR95g)

### Conteúdo comprovado

- 10:35–12:20 — documentação, testes automáticos e relação com deploy.
- 12:50–17:10 — distinção entre Core e serviço Cloud conforme o cenário da época.
- 21:08–24:15 — `ref`, documentação, linhagem e data tests em nível conceitual.
- 24:15–25:10 — defesa de mover transformação/regras do BI para o pipeline e a Gold.
- 25:50–30:20 — pastas do projeto, modelos, tests, macros, seeds e snapshots.
- 32:30–39:35 — `profiles.yml`, `dbt_project.yml` e materializações view/table/incremental.
- 42:00–44:50 — CTE, macros, modularização e testes genéricos.
- 45:00–46:30 — qualidade do dado como condição para uso confiável por LLMs.

### Pontos fortes

- Explica a transformação como código versionado e a importância de modularizar SQL.
- A tese “regra funcional no pipeline, consumidor na ponta” já existe no vídeo original.
- Conecta qualidade e documentação com confiabilidade de IA antes de isso virar pauta popular.

### Pontos que precisam atualização

- “Todas as empresas usam Core” e previsões absolutas sobre gratuidade não devem ser repetidas.
- Instalação moderna deve usar o pacote do adapter, com versão compatível.
- CTE não melhora performance universalmente.
- Snapshot é mecanismo de histórico de mudanças, não substituto genérico de incremental.
- Testes reduzem risco, mas não impedem toda quebra de produção.
- Curso gratuito e certificação paga precisam ser distinguidos.
- Preços, conectividade e limites de planos devem vir da documentação vigente.

**Cobertura:** fundamentos forte; implementação ausente porque esta aula é deliberadamente teórica.

## 2. Hands-on 1 — `4TqyFTXbzIc`

**Título:** [criando o projeto, models e estrutura](https://www.youtube.com/watch?v=4TqyFTXbzIc)

- 00:14–01:10 — apresenta objetivo, Olist, Python, VS Code, Git e DuckDB.
- 02:00–03:00 — antecipa seeds, Bronze/Silver/Gold, testes e documentação.
- Até aproximadamente 05:15 — explica o repositório e encerra antes da configuração prática.

**Cobertura real:** introdução e mapa do hands-on. Não cria modelos nem estrutura dbt em substância.

## 3. Hands-on 2 — `8AnaWYgeCuA`

**Título:** [incremental models e primeiras boas práticas](https://www.youtube.com/watch?v=8AnaWYgeCuA)

- 00:40–04:30 — repositório Git e abertura do projeto.
- 04:30–09:30 — virtualenv, instalação de dbt/DuckDB e localização do `profiles.yml`.
- 09:30–12:20 — `dbt init`, estrutura de diretórios e plano para Silver/Gold.
- 10:53–11:05 — afirma que snapshots não serão usados e que talvez não haja testes naquele projeto.

**Cobertura real:** ambiente local e esqueleto do projeto. Não há modelo incremental nem `is_incremental()`.

## 4. Hands-on 3 — `W8sZcY3FbhE`

**Título:** [tests, docs e qualidade de dados](https://www.youtube.com/watch?v=W8sZcY3FbhE)

- 00:56–03:20 — corrige e explica `profiles.yml`, target e materialização.
- 03:20–06:00 — configura caminhos/schemas no `dbt_project.yml`.
- 06:00–12:50 — copia CSVs Olist, executa seeds e inspeciona DuckDB.
- 13:40–16:45 — discute custo, qualidade e o plano de criar Gold/testes depois.

**Cobertura real:** profiles, targets, configuração, seeds e inspeção. Não implementa data tests nem gera documentação.

## 5. Hands-on 4 — `CujFYRjXRXE`

**Título:** [lineage, ambientes e organização do projeto](https://www.youtube.com/watch?v=CujFYRjXRXE)

- 01:03–04:40 — revisa seeds e cria os primeiros modelos de staging.
- 04:40–08:00 — mostra precedência de `materialized` entre projeto e modelo.
- 09:50–14:10 — usa `ref`, alias e explica dependências/nodes.
- 15:20–17:40 — inspeciona tabelas e troca um modelo de table para view.
- 17:45–18:20 — descreve incremental conceitualmente e informa que ainda precisa aprofundar o tema.
- 19:35–20:00 — menciona linhagem/documentação como benefício.

**Cobertura real:** models, `ref`, alias, configuração e table/view. Linhagem e incremental não recebem demonstração completa.

## 6. Hands-on 5 — `NTZc7D4Zlok`

**Título:** [fechamento, deploy e próximos passos](https://www.youtube.com/watch?v=NTZc7D4Zlok)

- 03:00–08:10 — cria uma tabela final/Gold com CTE e join de pedidos/pagamentos.
- 08:20–10:50 — executa `dbt run`, seleciona um modelo e confere o resultado no DuckDB.
- 11:20–12:00 — promete um vídeo posterior sobre tests e documentação.

**Cobertura real:** primeiro modelo Gold e execução. Não há deploy, CI, data tests ou documentação gerada.

## Matriz editorial resultante

| Capacidade | Teoria | Hands-on | Situação para a nova série |
|---|---|---|---|
| papel do dbt e DAG | forte | parcial | recapitular brevemente |
| instalação/Core/DuckDB | conceitual | executado | atualizar para Core 1.12 |
| seeds | conceitual | executado | usar como base |
| `ref` e models | forte | executado | usar como pré-requisito |
| table/view | forte | executado | usar como pré-requisito |
| Gold | defendida | um join simples | aprofundar regras e grão |
| incremental | conceitual | não executado | implementar no episódio 10 |
| tests | conceitual | não executado | implementar no episódio 6 |
| docs/lineage | conceitual | não gerado | artifacts e exposures nos episódios 7/9/11 |
| deploy/CI | citado | não executado | implementar CI por estado no episódio 9 |
| métricas/semântica | ausente | ausente | episódios 2–4 |
| contratos/versões | ausente | ausente | episódio 5 |
| governança como código | ausente | ausente | episódios 7–8 |
| MCP/agentes | breve relação com LLM | ausente | episódios 11–12 |

## Regra para os novos roteiros

Quando o novo vídeo disser “como vimos anteriormente”, ele só poderá apontar para uma capacidade marcada como executada. Para conteúdo apenas conceitual, a fala será “a série apresentou o conceito; agora vamos implementá-lo”.
