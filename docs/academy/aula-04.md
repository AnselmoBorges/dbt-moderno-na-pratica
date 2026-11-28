# Aula 04 — Explore os pedidos no DuckDB

**Objetivo:** abrir os dados gerados no checkpoint 01 e perceber por que pagamento e entrega são fatos diferentes. A prática principal funciona dentro do GitHub Codespaces, no navegador.

## Antes de começar

Abra o mesmo Codespace das aulas anteriores. Se ainda não viu **Checkpoint 01 OK**, execute e aguarde:

```bash
python course.py checkpoint 01
```

## 1. Inicie o Explorador DuckDB do curso

Na raiz do repositório, onde está `course.py`, execute:

```bash
python course.py data-ui
```

**Mantenha este terminal aberto.** O comando cria uma cópia do banco somente para leitura; a exploração não altera a base usada pelo dbt.

## 2. Abra a porta no navegador

No Codespaces, abra a guia **Ports** ou **Portas**, encontre a porta **4213** e clique em **Open in Browser**. Mantenha a visibilidade **Private**. Se a porta não aparecer, aguarde o processo terminar de iniciar e confira novamente.

## 3. Rode a primeira consulta

No Explorador, em **Consulta da aula**, escolha **00 · Primeiras linhas dos pedidos** e clique em **Executar consulta**. Se quiser reproduzir a consulta no editor, copie o SQL:

```sql
select order_id as pedido, order_status as status,
       cast(order_purchase_timestamp as date) as compra,
       cast(order_delivered_customer_date as date) as entrega
from b.orders
order by order_id
limit 4;
```

Leia as quatro linhas. O pedido `o3` está **canceled** e não tem data de entrega. **Pergunta para pensar:** um pagamento deve contar como receita de pedidos entregues se o pedido não foi entregue?

## 4. Se preferir a mesma consulta no terminal

Abra **outro** terminal na raiz do repositório e execute:

```bash
python course.py sql 00
```

O terminal que executa `data-ui` deve permanecer aberto enquanto você usa o Explorador.

## 5. Encerre e atualize com segurança

Volte ao terminal do Explorador e pressione **Ctrl+C**. Se executar novos checkpoints, rode `data-ui` novamente para recriar a cópia de leitura.

## Se algo falhar

- **`course.py` não encontrado:** abra o terminal na raiz do repositório.
- **Porta 4213 ausente:** confirme que `data-ui` segue aberto e veja a guia **Ports**.
- **`Initialization Error` ou `DataView`:** você provavelmente abriu a UI oficial por uma URL encaminhada. Feche-a e use `data-ui`, que identifica a interface do curso.
- **Checkpoint ausente:** execute `checkpoint 01` antes de abrir o Explorador.

Para pedir ajuda sem compartilhar segredos:

```bash
python course.py support-report
```

## Bônus opcional — DuckDB UI oficial por túnel

Essa alternativa exige GitHub CLI instalado e autenticado **no seu computador** e uma cópia local do repositório. **Não é necessária para concluir a aula.** Encerre o Explorador com Ctrl+C para liberar a porta. No terminal do Codespace:

```bash
python course.py official-data-ui
```

Não abra o link automático do Codespaces. No terminal do seu computador, na cópia local do repositório:

```bash
gh auth refresh -h github.com -s codespace
python course.py codespace-ui-tunnel
```

Se o GitHub CLI ainda não estiver conectado, execute `gh auth login -h github.com` antes do `auth refresh`. Abra `http://localhost:4213`, mantenha os dois terminais abertos e encerre cada processo com **Ctrl+C**. Se falhar, volte à rota principal `data-ui`.

Veja os [detalhes das práticas](../praticas-duckdb.md) e o [guia de Codespaces](../codespaces.md).
