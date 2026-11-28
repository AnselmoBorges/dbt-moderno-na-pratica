# Aula 01.2 — Leia o `manifest.json`

**Objetivo:** encontrar `parent_map` e reconhecer uma dependência do modelo de pedidos. Use o Codespace da aula anterior, sem instalar nada no seu computador. Cole os comandos **um por vez** no terminal da raiz, onde está `course.py`.

## 1. Confirme o pré-requisito

O checkpoint 01 deve ter terminado com `Artifacts OK` e `Checkpoint 01 OK`. No explorador, expanda `lab → dabdbt → target` e encontre `manifest.json`.

Se o arquivo não existir, rode:

```bash
python course.py checkpoint 01
```

**Para quê:** gerar novamente o projeto e os artifacts. **Resultado esperado:** `Checkpoint 01 OK` e o arquivo `lab/dabdbt/target/manifest.json`. **Erro comum:** ambiente ainda incompleto. **Recuperação:** execute o diagnóstico:

```bash
python course.py doctor
```

Siga a primeira mensagem acionável. Se a preparação foi interrompida, retome-a:

```bash
python course.py setup
```

Depois, repita o comando do checkpoint, apresentado no passo 1.

## 2. Abra o arquivo gerado

No explorador, clique em `lab/dabdbt/target/manifest.json`. Se preferir o terminal do Codespace:

```bash
code lab/dabdbt/target/manifest.json
```

**Para quê:** abrir o JSON no editor. **Resultado esperado:** uma aba `manifest.json`. **Erro comum:** `code` não abre o arquivo fora do terminal integrado ou se você está em outra pasta. **Recuperação:** clique no arquivo pelo explorador e confirme que `course.py` aparece na raiz. Não edite o JSON gerado.

## 3. Encontre `parent_map`

Com o arquivo aberto, use **⌘F** no Mac ou **Ctrl+F** no Windows/Linux e pesquise `parent_map`. Essa chave associa o identificador de um recurso à lista de seus **pais**, ou seja, os recursos dos quais depende. Procure `model.dabdbt.commerce_orders` nessa seção. O nome exato e a posição podem variar quando o projeto é atualizado; acompanhe as chaves do arquivo real.

O SQL versionado de `commerce_orders` contém `ref('order_metrics')`: esse modelo usa `order_metrics`. Visualize **`order_metrics → commerce_orders`**. A seta mostra o fluxo da dependência, do pai para o consumidor. Use a busca pelo identificador para inspecionar a lista real; não presuma que todo texto encontrado é uma entrada de `parent_map`.

## 4. Reconheça a declaração semântica

Pesquise `semantic_model.dabdbt.commerce_orders` no mesmo arquivo. O identificador representa a declaração semântica dos pedidos. **Não confunda** o semantic model com as linhas de pedidos: as linhas ficam no DuckDB, enquanto o manifest descreve os recursos do projeto.

**Checklist:** você abriu o manifest gerado, localizou `parent_map`, reconheceu `commerce_orders` e explicou de onde vem a dependência com `order_metrics`. Na 01.3, veremos a mesma linhagem no dbt Docs.

[Checkpoint 01](https://github.com/AnselmoBorges/dbt-moderno-na-pratica/blob/main/lab/dabdbt/checkpoints/01-core-1-12.md) · [SQL de `commerce_orders`](https://github.com/AnselmoBorges/dbt-moderno-na-pratica/blob/main/lab/dabdbt/src/models/semantic/commerce_orders.sql) · [Manifest na documentação do dbt](https://docs.getdbt.com/reference/artifacts/manifest-json)
