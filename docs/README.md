# Guia do aluno

Este guia leva uma pessoa com SQL básico do computador recém-configurado ao primeiro `dbt build`. Não é necessário conhecer Python, Git, terminal ou dbt antes de começar.

## Caminho recomendado

1. Leia os [pré-requisitos e faça a autoavaliação](pre-requisitos.md).
2. Abra o [laboratório recomendado no GitHub Codespaces](codespaces.md). Não é necessário instalar Python ou Git localmente.
3. Faça a [Aula 0](aula-00.md).
4. Consulte o [mapa do curso](mapa-do-curso.md) e execute os checkpoints em ordem.
5. Se algo falhar, use o [guia de solução de problemas](solucao-de-problemas.md).

Se você precisa trabalhar offline ou prefere controlar o ambiente no próprio computador, use a [instalação local para Windows, macOS ou Linux](instalacao/README.md).

## Três comandos que resolvem a maior parte do início

```bash
python course.py doctor
python course.py setup
python course.py checkpoint 01
```

No Windows, `py -3.12` pode substituir `python`. Em macOS/Linux, `python3.12` pode substituir `python`. Depois disso, o restante do comando é idêntico.

## Material complementar

- [Manual de instalação do dbt Core](https://docs.getdbt.com/guides/manual-install?step=1) — dbt Labs, documentação em inglês, base oficial para pré-requisitos; verificado em 2026-09-01.
- [Cursos oficiais dbt Learn](https://www.getdbt.com/dbt-learn) — dbt Labs, cursos em inglês, comparação e aprofundamento; verificado em 2026-09-01.
