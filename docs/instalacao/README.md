# Instalação por sistema operacional

Esta é a rota alternativa para quem prefere trabalhar localmente ou precisa continuar sem internet depois da instalação inicial. Para reduzir diferenças de ambiente durante as aulas, recomendamos primeiro o [GitHub Codespaces](../codespaces.md).

Escolha apenas o seu sistema:

- [Windows](windows.md)
- [macOS](macos.md)
- [Linux](linux.md)

Depois de instalar Python e Git, todos usam o mesmo fluxo na raiz do repositório:

```bash
python course.py doctor
python course.py setup
python course.py checkpoint 01
```

O curso cria e usa `lab/dabdbt/.venv` automaticamente. Os comandos `course.py` escolhem o Python, o dbt e o perfil do laboratório sem ativação manual. Após o primeiro checkpoint, consulte a [cola de comandos](../cola-de-comandos.md) para navegar pelas demais aulas.

## Material complementar

- [Instalar dbt Core](https://docs.getdbt.com/docs/local/install-dbt) — dbt Labs, documentação/EN; atenção: a página atual também apresenta a nova geração, enquanto o curso fixa Core 1.12; verificado em 2026-09-01.
- [Instalação do Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git) — Git, documentação/EN; verificado em 2026-09-01.
