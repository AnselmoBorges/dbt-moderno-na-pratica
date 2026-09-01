# Laboratório — dbt Moderno na Prática

Projeto didático cumulativo da primeira temporada **Da Gold aos Agentes de IA**. O caminho executável fixa dbt Core 1.12 e usa apenas recursos abertos/estáveis; o caminho Databricks continua disponível como referência parametrizada, mas não é acionado pelos testes locais. Fusion, Core 2.0 e produtos preview aparecem somente nos quadros Radar dos roteiros.

## Arquitetura

```text
seeds Olist -> Silver (limpeza) -> Gold (regras funcionais)
                                  -> API semântica versionada
                                     -> métricas MetricFlow
                                     -> artifact OSI / SQL / agente MCP somente leitura
```

| Camada | Schema local | Responsabilidade |
|---|---|---|
| Bronze | `b` | Seeds de entrada e referência geográfica |
| Silver | `s` | Tipagem, nomes e padronização |
| Gold | `g` | Regras funcionais reutilizáveis e modelos analíticos |
| Semântica | `semantic` | Contratos, versões, entidades, dimensões e métricas |

## Execução local completa

Use Python 3.12 ou 3.13. As versões fixadas em `requirements-local.txt` ainda não aceitam Python 3.14.

Na raiz do repositório, use `python course.py setup` e depois `python course.py validate`. O launcher chama os executáveis corretos em Windows, macOS e Linux; não é necessário ativar `.venv`.

Também é possível executar um episódio isolado:

```bash
python course.py checkpoint 03
```

Os checkpoints são cumulativos: o checkpoint 12 pressupõe as interfaces introduzidas nos anteriores, mas cada comando valida somente a capacidade focal do episódio.

## Comandos essenciais

```bash
dbt deps --profiles-dir dbt_profiles --target local
dbt seed --profiles-dir dbt_profiles --target local --full-refresh
dbt build --profiles-dir dbt_profiles --target local
dbt run-operation create_freshness_fixture --args '{age_hours: 0}' \
  --profiles-dir dbt_profiles --target local
dbt source freshness --select source:lab_quality \
  --profiles-dir dbt_profiles --target local
DBT_PROFILES_DIR=dbt_profiles mf validate-configs
DBT_PROFILES_DIR=dbt_profiles mf query \
  --metrics orders,gross_revenue,delivered_revenue,average_order_value \
  --group-by metric_time__month
```

Resultado funcional esperado da amostra: 8 pedidos, receita bruta de 740, receita entregue de 630, ticket médio de 92,50 e prazo médio de entrega de 5 dias.

## Interfaces governadas

- `src/models/semantic/schema.yml`: semantic model e métricas como código no formato mais recente.
- `order_metrics_v1.sql` e `order_metrics_v2.sql`: contrato e versão da API Gold.
- `commerce_orders.sql`: fachada pública para consumidores.
- `target/osi_document.json`: documento semântico interoperável produzido pelo Core 1.12.
- `mcp/read-only.example.json`: allowlist mínima, sem SQL arbitrário nem ferramentas de escrita.
- `benchmarks/questions.json`: perguntas, SQL e respostas esperadas.
- `benchmarks/benchmark.schema.json`: contrato de traces, incluindo tokens, tool calls, latência e custo normalizado.
- `benchmarks/benchmark-report.schema.json`: contrato do relatório combinado com pergunta, ground truth, SQL, resultado e custo por item.

Os três arquivos `*.fixture.json` são fixtures sintéticas para testar o avaliador em CI. Eles não representam medições reais de um modelo de IA. Para um experimento real, grave um trace compatível com o schema e rode:

```bash
python scripts/score_agent_benchmark.py caminho/do/trace.json
```

## Portabilidade

Diferenças de dialeto ficam em `src/macros/portable_sql.sql`, com dispatch por adaptador. `apply_uc_tags` aplica tags no Unity Catalog apenas no target Databricks e vira operação neutra no DuckDB.

Antes de usar o bundle, substitua os valores de exemplo de `databricks.yml` por variáveis do seu ambiente. Nunca registre tokens, hosts reais ou IDs de recursos no repositório.

## Limites do laboratório

- DuckDB mede correção e duração, não créditos reais de warehouse.
- O benchmark FinOps usa duração e quantidade de recursos como proxies; custos cloud precisam ser lidos do billing do provedor.
- Microbatch não é executado no DuckDB deste laboratório porque o suporte precisa ser confirmado por adapter; o roteiro mostra os requisitos `event_time`, lote, lookback e late data sem fingir uma medição.
- Semantic Layer gerenciada, cache, APIs hospedadas e cross-project refs exigem produto/plano compatível e são tratados conceitualmente.
- A pasta `platform/` contém somente runbooks opcionais e placeholders; não participa da CI e não armazena credenciais.

## Material complementar

| Material | Organização | Tipo/idioma | Uso na aula | Verificado |
|---|---|---|---|---|
| [Jaffle Shop com DuckDB](https://github.com/dbt-labs/jaffle_shop_duckdb) | dbt Labs | repositório, EN | referência oficial de projeto local | 2026-09-01 |
| [Documentação estável do DuckDB](https://duckdb.org/docs/stable/) | DuckDB | documentação, EN | comportamento e solução de problemas do banco local | 2026-09-01 |
| [Manual de instalação do dbt Core](https://docs.getdbt.com/guides/manual-install?step=1) | dbt Labs | guia, EN | pré-requisitos e instalação oficial | 2026-09-01 |
