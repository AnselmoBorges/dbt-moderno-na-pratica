# Guia do aluno

Este guia leva uma pessoa com SQL básico do computador recém-configurado ao primeiro `dbt build`. Não é necessário conhecer Python, Git, terminal ou dbt antes de começar.

## Caminho recomendado

1. Leia os [pré-requisitos e faça a autoavaliação](pre-requisitos.md).
2. Abra o [laboratório recomendado no GitHub Codespaces](codespaces.md). Não é necessário instalar Python ou Git localmente.
3. Faça a [Aula 0](aula-00.md).
4. Consulte o [mapa do curso](mapa-do-curso.md), siga as [práticas no DuckDB e no dbt Docs](praticas-duckdb.md) e compare sua execução com o [guia dos checkpoints](resultados-dos-checkpoints.md).
5. Se algo falhar, use o [guia de solução de problemas](solucao-de-problemas.md).
6. Depois da trilha open, faça a [aula bônus de migração para o dbt OSS v2](../roteiros/bonus-migracao-v2.md).

Se você precisa trabalhar offline ou prefere controlar o ambiente no próprio computador, use a [instalação local para Windows, macOS ou Linux](instalacao/README.md).

## Primeira execução na raiz

```bash
python course.py doctor
python course.py setup
python course.py checkpoint 01
```

No Codespaces, pule `setup` se o diagnóstico mostrar **Ambiente preparado**. Execute o checkpoint 01 uma vez antes dos demais. Os caminhos e as portas das interfaces estão na [cola de comandos](cola-de-comandos.md).

Se `python` estiver indisponível, use `py -3.12` no Windows ou `python3.12` no macOS/Linux. Para Python 3.13, use o equivalente `py -3.13` ou `python3.13`.

## Material complementar

- [Manual de instalação do dbt Core](https://docs.getdbt.com/guides/manual-install?step=1) — dbt Labs, documentação em inglês, base oficial para pré-requisitos; verificado em 2026-09-01.
- [Cursos oficiais dbt Learn](https://www.getdbt.com/dbt-learn) — dbt Labs, cursos em inglês, comparação e aprofundamento; verificado em 2026-09-01.
