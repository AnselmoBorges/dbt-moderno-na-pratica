# Windows

1. Instale Python 3.12 ou 3.13 pelo [site oficial](https://www.python.org/downloads/windows/). Marque a opção para adicionar Python ao `PATH`.
2. Instale [Git for Windows](https://git-scm.com/download/win).
3. Abra PowerShell e confirme:

```powershell
py -3.12 --version
git --version
```

4. Baixe e prepare o curso:

```powershell
git clone https://github.com/AnselmoBorges/dbt-moderno-na-pratica.git
cd dbt-moderno-na-pratica
py -3.12 course.py doctor
py -3.12 course.py setup
py -3.12 course.py checkpoint 01
```

Não altere a política de execução do PowerShell: o curso não depende de `Activate.ps1`.

## Material complementar

- [Python no Windows](https://docs.python.org/3/using/windows.html) — Python Software Foundation, documentação/EN; verificado em 2026-09-01.
- [Git for Windows](https://gitforwindows.org/) — projeto Git for Windows, ferramenta/EN; verificado em 2026-09-01.

