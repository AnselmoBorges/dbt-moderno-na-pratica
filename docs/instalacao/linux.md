# Linux

1. Instale Python 3.12 ou 3.13, suporte a `venv` e Git pelo gerenciador da sua distribuição.
2. Confirme:

```bash
python3.12 --version
git --version
```

3. Baixe e prepare o curso:

```bash
git clone https://github.com/AnselmoBorges/dbt-moderno-na-pratica.git
cd dbt-moderno-na-pratica
python3.12 course.py doctor
python3.12 course.py setup
python3.12 course.py checkpoint 01
```

Se a criação do ambiente reclamar de `ensurepip`, instale o pacote `python3.12-venv` equivalente da sua distribuição.

## Material complementar

- [Python em plataformas Unix](https://docs.python.org/3/using/unix.html) — Python Software Foundation, documentação/EN; verificado em 2026-09-01.
- [Instalação do Git no Linux](https://git-scm.com/download/linux) — Git, documentação/EN; verificado em 2026-09-01.

