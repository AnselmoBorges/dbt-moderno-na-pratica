# Aula 01.1 — Seu baseline dbt Core

**Objetivo:** confirmar que o ambiente está pronto, executar o checkpoint 01 e localizar os arquivos que o dbt produziu. Use o mesmo GitHub Codespace do capítulo 00. Você não precisa instalar nada no seu computador para seguir a rota do navegador.

## Antes de começar

No VS Code do Codespaces, abra **Terminal → New Terminal**. No painel de arquivos, confirme que `course.py` está na raiz. Cole **um bloco por vez** e espere o comando terminar.

## 1. Confirme o ambiente

```bash
python course.py doctor
```

**Para quê:** conferir Python, Git, permissões, arquivos e dbt Core. **Resultado esperado:** `Ambiente preparado. Você já pode executar o checkpoint.` Se aparecer `ERRO`, leia o primeiro item indicado. Se a criação inicial foi interrompida, retome-a com:

```bash
python course.py setup
```

Espere **Ambiente pronto** e rode `doctor` novamente. O setup reconhece um ambiente já completo.

## 2. Execute o baseline

```bash
python course.py checkpoint 01
```

**Para quê:** carregar os seeds, fazer parse e build, executar os testes, gerar a documentação e verificar os artifacts. **Resultado esperado:** `Artifacts OK` e `Checkpoint 01 OK`. Pode levar alguns minutos; mantenha o terminal aberto. Se falhar, guarde a **primeira linha de erro** e consulte o [guia de solução de problemas](https://github.com/AnselmoBorges/dbt-moderno-na-pratica/blob/main/docs/solucao-de-problemas.md).

## 3. Encontre os arquivos gerados

No explorador à esquerda, expanda `lab → dabdbt → target`. Procure `manifest.json`, `semantic_manifest.json`, `osi_document.json`, `run_results.json` e `catalog.json`. **Não edite esses arquivos:** eles são saídas geradas pelo dbt.

Se preferir abrir o primeiro arquivo pelo terminal do Codespaces:

```bash
code lab/dabdbt/target/manifest.json
```

**Resultado esperado:** o editor abre o JSON. Se `code` não funcionar, clique em `manifest.json` pelo explorador de arquivos. Na próxima mini aula vamos procurar `parent_map` e entender as dependências.

> **Atenção:** após o checkpoint, `run_results.json` registra o último comando que o escreveu, `docs generate`. Ele não é a contagem consolidada de todo o checkpoint. As linhas dos pedidos estão no DuckDB; os arquivos acima descrevem o projeto e sua execução.

**Checklist:** `doctor` confirmou o ambiente, `checkpoint 01` terminou em **OK** e você encontrou os cinco arquivos na pasta `target`.

[Roteiro do capítulo](https://github.com/AnselmoBorges/dbt-moderno-na-pratica/blob/main/roteiros/01-playlist-core-1-12.md) · [Checkpoint 01](https://github.com/AnselmoBorges/dbt-moderno-na-pratica/blob/main/lab/dabdbt/checkpoints/01-core-1-12.md)
