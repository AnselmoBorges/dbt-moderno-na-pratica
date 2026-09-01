# macOS

1. Instale Python 3.12 ou 3.13 pelo [instalador oficial](https://www.python.org/downloads/macos/).
2. No Terminal, confirme o Git; o macOS poderá oferecer as Command Line Tools:

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

Em Apple Silicon e Intel o fluxo é o mesmo; as dependências Python instalam a distribuição correspondente.

## Material complementar

- [Python no macOS](https://docs.python.org/3/using/mac.html) — Python Software Foundation, documentação/EN; verificado em 2026-09-01.
- [Instalação do Git](https://git-scm.com/download/mac) — Git, documentação/EN; verificado em 2026-09-01.

