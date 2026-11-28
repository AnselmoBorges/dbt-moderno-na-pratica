# Aula 05 — Recuperação e próximos passos

**Objetivo:** saber retomar uma preparação interrompida, pedir ajuda com segurança e parar o Codespace ao terminar. A rota principal continua no navegador, sem instalar Python, Git, dbt ou DuckDB no seu computador.

## Antes de começar

Abra o **mesmo Codespace** das aulas anteriores. No VS Code do navegador, escolha **Terminal → New Terminal**. No painel de arquivos, confirme que `course.py` está na pasta em que o terminal foi aberto. Copie **um comando por vez** e espere o resultado antes de avançar.

## 1. Retome uma preparação interrompida

Se a criação do Codespace parou no meio de `postCreateCommand`, o terminal foi fechado ou você pressionou **Ctrl+C**, execute na raiz do repositório:

```bash
python course.py setup
```

**Para quê:** concluir as dependências do laboratório. **Espere:** o processo terminar com **Ambiente pronto**. Se tudo já estiver preparado, o comando reconhece o ambiente completo e não repete a instalação. Não feche o terminal durante as três etapas.

## 2. Confirme o ambiente e os caminhos

```bash
python course.py doctor
```

**Espere:** **Ambiente preparado. Você já pode executar o checkpoint.** Se aparecer **ERRO**, leia o primeiro item marcado e corrija-o antes de continuar.

```bash
python course.py paths
```

**Espere:** os caminhos do Python, dbt Core, DuckDB, banco, profile e artifacts **do seu Codespace**. Eles podem ser diferentes dos mostrados no vídeo. Não é preciso ativar a `.venv`.

Se ainda não obteve o resultado da aula anterior, execute e aguarde:

```bash
python course.py checkpoint 01
```

**Espere:** **Checkpoint 01 OK**. Se o erro persistir, passe ao relatório de suporte.

## 3. Gere um relatório para pedir ajuda

```bash
python course.py support-report
```

**Espere:** um resumo no terminal e o arquivo `build/support-report.json`. Consulte o [modelo para pedir ajuda](https://github.com/AnselmoBorges/dbt-moderno-na-pratica/blob/main/docs/pedir-ajuda.md). Revise qualquer mensagem de erro que copiar: não envie tokens, `.env`, chaves, hosts privados nem dados pessoais. O relatório do curso não coleta variáveis de ambiente ou tokens.

## 4. Pare o Codespace quando terminar

Abra [github.com/codespaces](https://github.com/codespaces), encontre **o ambiente deste curso**, clique no menu **…** e escolha **Stop codespace**. **Espere:** o estado mudar para parado. Parar interrompe o uso de processamento; o armazenamento continua contabilizado enquanto o ambiente existir. Na próxima aula, abra **o mesmo Codespace** para continuar. Não escolha **Delete** se ainda quiser preservar os arquivos.

## 5. Alternativa local — somente se você precisar

Para estudar offline **depois de instalar as dependências** ou evitar o uso de Codespaces, siga o guia do **seu** sistema: [Windows](https://github.com/AnselmoBorges/dbt-moderno-na-pratica/blob/main/docs/instalacao/windows.md), [macOS](https://github.com/AnselmoBorges/dbt-moderno-na-pratica/blob/main/docs/instalacao/macos.md) ou [Linux](https://github.com/AnselmoBorges/dbt-moderno-na-pratica/blob/main/docs/instalacao/linux.md). Essa rota exige instalação no computador e **não é necessária** para acompanhar a prática no navegador. Use o launcher Python indicado pelo guia escolhido; no Windows ele pode ser `py`, e no macOS/Linux, `python3.12`.

## Se algo falhar

- **`course.py` não encontrado:** volte à raiz do repositório no terminal; verifique o arquivo no painel lateral.
- **`setup` parou de novo:** confira a primeira linha de erro, execute `doctor` e tente `setup` após corrigir a causa. Não instale pacotes soltos fora do ambiente do curso.
- **Checkpoint sem banco ou dependência:** confirme **Ambiente preparado** no `doctor` e então repita `checkpoint 01`.
- **Não encontra o Codespace:** entre na mesma conta GitHub usada na Aula 02 e abra [seus Codespaces](https://github.com/codespaces).
- **Franquia esgotada:** aguarde a renovação ou escolha a instalação local do seu sistema. Consulte o [guia de consumo](https://github.com/AnselmoBorges/dbt-moderno-na-pratica/blob/main/docs/codespaces.md#franquia-gratuita-e-escolha-da-máquina).

**Checklist:** `doctor` confirmou **Ambiente preparado**; `checkpoint 01` terminou em **OK**; você encontrou o pedido `o3` cancelado; o Codespace está parado se encerrou a prática. A próxima aula aprofunda a documentação e os artifacts do primeiro build.
