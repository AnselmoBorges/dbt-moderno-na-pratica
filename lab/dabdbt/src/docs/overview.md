{% docs __overview__ %}
# Do pedido ao indicador

Este é o projeto DuckDB do curso **dbt Moderno na Prática**. A pergunta que acompanha as aulas é: quanto dos pagamentos corresponde a pedidos entregues?

## O caminho dos dados

- **Bronze (`b`)** carrega CSVs do repositório com pedidos, itens, pagamentos, clientes e uma referência de municípios.
- **Silver (`s`)** padroniza as fontes e preserva o nível de detalhe de cada relação. Um pedido pode ter vários itens e vários pagamentos.
- **Gold (`g`)** consolida valores e medidas operacionais. Em `g.order_fulfillment`, os pagamentos já estão agregados por pedido.
- **Interface semântica (`semantic`)** publica `order_metrics` com contrato e versões. `commerce_orders` aponta para a versão vigente e declara métricas para consumo.

## Leitura da documentação

Procure **commerce_orders** para ver a descrição, as colunas, os tipos, os testes associados e o SQL do modelo. Abra **View Lineage Graph** para seguir as dependências. O grafo mostra quais recursos se conectam, e o SQL do modelo mostra como a transformação ocorre.

O arquivo `manifest.json` descreve recursos e linhagem. O `catalog.json` registra as relações e os tipos consultados no DuckDB na última geração. As linhas de negócio ficam no banco. Para acompanhar os resultados dos testes, consulte o terminal do checkpoint.

## A regra que chega ao consumidor

A receita bruta soma pagamentos. A receita entregue considera apenas pedidos com status `delivered`. O mês é o da compra. O painel e um agente autorizado podem consultar a mesma definição, sem refazer a junção ou escolher outra fórmula.
{% enddocs %}

{% docs commerce_orders_interface %}
Uma linha por pedido. Interface pública do domínio de comércio, apoiada pela versão vigente de `order_metrics`.

- **Receita bruta:** soma de `total_payment`, incluindo pagamentos para pedidos ainda não entregues.
- **Receita entregue:** soma de `delivered_revenue`, com valor reconhecido somente quando o status é `delivered`.
- **Mês:** derivado de `order_purchase_date`, a data da compra.

Use `order_id` para conferir o grão. Se precisar cruzar itens ou pagamentos, agregue esses registros por pedido antes da junção. O contrato da versão de `order_metrics` protege o esquema que esta interface consome.
{% enddocs %}
