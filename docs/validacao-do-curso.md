# Validação do curso

## O que está disponível

| Material | Ambiente e artefatos |
|---|---|
| Aula 0 e episódios 1–12 | Core 1.12.7, adaptador `dbt-duckdb` 1.11.1 e DuckDB 1.5.5. São 13 apresentações, com 272 slides. |
| Aula bônus | Core 1.12.7 e dbt OSS 2.0.11 em bancos e ambientes separados. Apresentação de 16 slides. |
| Segunda temporada | Quatro roteiros sobre dbt Platform, com demonstrações documentais e trilhas ao vivo condicionadas ao acesso. |

[Versões do laboratório principal](../lab/dabdbt/requirements-local.txt) · [Apresentações](../assets/decks/README.md) · [Roteiros](../roteiros/README.md)

## Repita a verificação

Execute na raiz. Em um Codespace que já mostra **Ambiente preparado**, pule a primeira linha.

```bash
python course.py setup
python course.py checkpoint 01
python course.py validate
python scripts/verify_links.py --external
```

O primeiro checkpoint confirma o ambiente e gera o banco e a documentação. A suíte inteira valida o build, os cinco artefatos JSON, MetricFlow, freshness, contratos e modelos versionados, state/defer, incremental, MCP e as 14 consultas da prática. O benchmark de agentes usa traces de teste. A checagem editorial confere as páginas em PPTX/PDF, notas, fontes, texto selecionável no PPTX e imagens catalogadas. O validador de links distingue URLs que respondem de sites que restringem a checagem automatizada.

[O que observar nos checkpoints](resultados-dos-checkpoints.md)

## Onde o GitHub Actions testa

| Quando | Escopo |
|---|---|
| Push na `main` e pull request | Documentação, setup e checkpoint 01 em Linux, macOS e Windows com Python 3.12 e 3.13. Suíte completa no Ubuntu/Python 3.12. Bônus em Ubuntu e Windows/Python 3.12. |
| Execução semanal ou manual | Mesmos testes e suíte completa também em Windows e macOS com Python 3.12 e 3.13, mais a checagem dos links externos. |

[Resultados do GitHub Actions](https://github.com/AnselmoBorges/dbt-moderno-na-pratica/actions/workflows/course.yml)

## Evidência do bônus

Na amostra de oito pedidos, os cinco campos da projeção Gold coincidiram nos três ambientes avaliados. A receita bruta foi 740 e a entregue foi 630.

| Ambiente da comparação | Recorte com `persist_docs` original | Build com comentários físicos desativados na cópia v2 |
|---|---|---|
| macOS local da demonstração | Falha em modelos Silver | Gold disponível e falha em `order_metrics.v1` e `order_metrics.v2` |
| Ubuntu e Windows no Actions | Passou | Passou e a migração segue em avaliação de paridade integral |

O relatório em `build/bonus-v2/resultado.json` identifica a execução e o resultado do seu ambiente. A comparação usa bancos novos e valida um recorte da Gold. Testar o v2 no curso preserva a linha Core 1.12 para a temporada. [Roteiro e comandos do bônus](../roteiros/bonus-migracao-v2.md) · [Evidência no GitHub Actions](https://github.com/AnselmoBorges/dbt-moderno-na-pratica/actions/runs/45470790808)

## Material complementar

- [Ciclo de suporte do dbt](https://docs.getdbt.com/docs/dbt-versions) — dbt Labs, documentação/EN; consulte o suporte da linha 1.12 e das distribuições v2. Verificado em 2026-11-24.
- [Sintaxe dos workflows](https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-syntax) — GitHub, documentação/EN; referência das matrizes e gatilhos de CI.
