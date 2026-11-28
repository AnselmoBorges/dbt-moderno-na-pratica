# Aula 02 — Prepare o GitHub Codespaces

**Objetivo:** abrir o laboratório no navegador e confirmar que está pronto. Você precisa apenas de uma conta GitHub e conexão com a internet. **Não instale Python, Git, dbt ou DuckDB no computador.**

## 1. Abra o repositório do curso

Entre na sua conta GitHub e abra o [repositório dbt Moderno na Prática](https://github.com/AnselmoBorges/dbt-moderno-na-pratica). Clique em **Code → Codespaces → Create codespace on main**. Também pode usar o [link direto para criar o Codespace](https://github.com/codespaces/new?hide_repo_select=true&ref=main&repo=1354054687).

## 2. Confira a configuração antes de criar

- **Branch:** `main`.
- **Dev container configuration:** `dbt Moderno na Prática`.
- **Machine type:** `2-core`.

Clique em **Create codespace**. Se o GitHub mostrar uma tela de cobrança, confira as condições da sua conta antes de prosseguir. Consulte o [guia de franquia e custos](../codespaces.md#franquia-gratuita-e-escolha-da-máquina).

## 3. Aguarde o ambiente ficar pronto

O VS Code pode abrir antes do fim da configuração. Espere **Running postCreateCommand** terminar e aparecer **Ambiente pronto**. O curso configura os pacotes automaticamente. Não ative a `.venv` nem instale ferramentas manualmente. Se aparecer **Get Started with dbt Power User**, feche essa aba.

## 4. Abra o terminal e confira o ambiente

No VS Code do navegador, clique em **Terminal → New Terminal**. No painel de arquivos, localize `course.py` na raiz do projeto. Copie o comando abaixo, cole no terminal e pressione **Enter**:

```bash
python course.py doctor
```

O diagnóstico confere o ambiente. Procure **Ambiente preparado. Você já pode executar o checkpoint.**

## 5. Confira os caminhos dos arquivos

Execute o próximo comando no mesmo terminal:

```bash
python course.py paths
```

Ele mostra os caminhos do Python, dbt, DuckDB, profile e arquivos gerados no **seu** Codespace. O checkpoint será feito na próxima mini aula.

## 6. Se a preparação foi interrompida

Somente se o ambiente **não** ficou pronto, execute:

```bash
python course.py setup
```

Espere terminar e repita o diagnóstico:

```bash
python course.py doctor
```

## 7. Pare o Codespace ao terminar

Abra [github.com/codespaces](https://github.com/codespaces), encontre o ambiente do curso, abra o menu **…** e escolha **Stop codespace**. A computação para de consumir a franquia; o armazenamento continua contando enquanto o ambiente existir.

## Se algo falhar

- **`python: can't open file course.py`:** o terminal está na pasta errada. Abra um terminal na raiz onde está `course.py`.
- **O editor abriu, mas o diagnóstico falhou:** aguarde a configuração automática. Se ela foi interrompida, rode `setup` e depois `doctor`.
- **Codespaces não aparece:** confira o login no GitHub e o repositório aberto.
- **Limite de uso atingido:** consulte o painel de cobrança da conta. Há uma [rota local alternativa](../instalacao/README.md).

**Checklist:** repositório correto, branch `main`, máquina `2-core`, preparação concluída e `doctor` aprovado.
