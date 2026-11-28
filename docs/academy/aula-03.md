# Aula 03 — Diagnóstico e checkpoint 01

**Objetivo:** confirmar o ambiente e gerar o primeiro resultado verificável. Tudo acontece no terminal do GitHub Codespaces, sem instalar ferramentas no computador.

## Antes de começar

- Espere **Ambiente pronto** no terminal de configuração do Codespace.
- Abra **Terminal → New Terminal** na raiz do repositório, onde está `course.py`.
- Copie **um bloco de cada vez** e aguarde o comando terminar antes do próximo.

## 1. Confira o ambiente

```bash
python course.py doctor
```

O diagnóstico confere Python, Git, espaço livre, permissões, arquivos e dbt Core. Procure **Ambiente preparado**. Se aparecer **ERRO**, leia a mensagem antes de seguir. Quando já está preparado, não há motivo para repetir a instalação.

## 2. Veja os caminhos reais do laboratório

```bash
python course.py paths
```

Confira o executável do dbt, o profile, o banco DuckDB e os artifacts. Use os caminhos mostrados no **seu** Codespace, que podem ser diferentes dos exibidos no vídeo.

## 3. Execute o primeiro checkpoint

```bash
python course.py checkpoint 01
```

O comando prepara os dados de exemplo, faz o parse do projeto dbt, constrói os modelos, executa testes e gera documentação e artifacts. **Não feche o terminal.** Espere a mensagem **Checkpoint 01 OK**.

## Se a preparação inicial foi interrompida

Execute uma vez, espere **Ambiente pronto** e volte aos passos 1 a 3:

```bash
python course.py setup
```

## Se o checkpoint falhar

Leia a primeira linha **ERRO**. Confirme que o terminal está na pasta de `course.py` e que o `doctor` indica **Ambiente preparado**. Se precisar de ajuda, gere um relatório sem segredos:

```bash
python course.py support-report
```

Não compartilhe senhas ou tokens. Consulte o [guia completo de preparação](../aula-00.md) e os [resultados esperados](../resultados-dos-checkpoints.md).
