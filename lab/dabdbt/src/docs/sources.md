{% docs source_olist_catalog %}
### Fontes de comércio

No laboratório DuckDB, as tabelas do schema `b` vêm de CSVs didáticos versionados em `src/seeds`. A estrutura é inspirada na publicação da Olist. O caminho Databricks usa fontes parametrizadas e fica separado da prática local.
{% enddocs %}


{% docs source_olist_customers %}
### Fonte `olist.customers`

Uma linha por identificador técnico de cliente no cadastro da amostra. Contém identificador de cliente, identificador persistente, prefixo de CEP, cidade e UF.
{% enddocs %}

{% docs source_olist_orders %}
### Fonte `olist.orders`

Uma linha por pedido. Traz cliente, status e datas de compra, aprovação, despacho, entrega e previsão. Datas de eventos ainda não concluídos podem estar vazias.
{% enddocs %}

{% docs source_olist_order_items %}
### Fonte `olist.order_items`

Uma linha por item do pedido. Identificadores de pedido, item, produto e vendedor acompanham preço, frete e data limite de envio.
{% enddocs %}

{% docs source_olist_order_payments %}
### Fonte `olist.order_payments`

Uma linha por ocorrência de pagamento de um pedido. Informa sequência do pagamento, meio, parcelas e valor. A Gold agrega as ocorrências por pedido antes de calcular receita.
{% enddocs %}

{% docs silver_customers %}
### Tabela `s.customers`

Camada padronizada de clientes. Normaliza os dados cadastrados, remove inconsistências, enriquece com informações oficiais do IBGE (incluindo coordenadas) e preserva as chaves necessárias para relacionar com pedidos e itens nas etapas seguintes do pipeline. No caminho Databricks, as tags do Unity Catalog são aplicadas por `apply_uc_tags`: `source:Azure SQL`, `process:dbt`, `layer:silver`, `data_owner:rescue`.
{% enddocs %}

{% docs silver_orders %}
### Tabela `s.orders`

Consolida o ciclo de vida de cada pedido (criação, aprovação, entrega). Facilita o monitoramento operacional e a geração de métricas de SLA e status. No caminho Databricks, os metadados incluem `source:Azure SQL`, `process:dbt`, `layer:silver`, `data_owner:rescue`.
{% enddocs %}

{% docs silver_order_items %}
### Tabela `s.order_items`

Transforma itens de pedidos para análises de receita, ticket médio e logística. Harmoniza preços e fretes e prepara a granularidade necessária para as camadas gold. No caminho Databricks, os metadados incluem `source:Azure SQL`, `process:dbt`, `layer:silver`, `data_owner:rescue`.
{% enddocs %}

{% docs silver_order_payments %}
### Tabela `s.order_payments`

Modelo financeiro com os pagamentos processados. Dá suporte a conciliações de receita, identificação de meios de pagamento mais utilizados e comparações entre parcelas. No caminho Databricks, os metadados incluem `source:Azure SQL`, `process:dbt`, `layer:silver`, `data_owner:rescue`.
{% enddocs %}

{% docs macro_apply_uc_tags %}
### Macro `apply_uc_tags`

Macro utilitário responsável por aplicar tags do Unity Catalog tanto em tabelas quanto em colunas logo após a materialização de um modelo dbt. Ele executa comandos `ALTER TABLE` diretamente via `adapter.execute` para garantir que tags como `source` (`Azure SQL`), `process` (`dbt`), `layer` (`silver`/`gold`) e `data_owner` (`rescue`) sejam persistidas em runtime, sem depender de execução manual no console. Benefícios principais:

- Assegura consistência de metadados (tags `source`, `process`, `layer`, etc.) entre ambientes.
- Permite definir tags padrão na configuração e, opcionalmente, sobrescrever por coluna via `meta` no `schema.yml`.
- Mantém o fluxo declarativo do dbt, evitando scripts externos para marcar ativos no Unity Catalog.
{% enddocs %}

{% docs macro_normalize_city_ascii %}
### Macro `normalize_city_ascii`

Função auxiliar utilizada nos modelos silver para padronizar nomes de municípios. Remove acentuação, trata pontuação, mantém minúsculas e normaliza espaços, permitindo joins consistentes com o seed do IBGE (`municipio_ascii`). É usada especificamente em `s.customers` para cruzar dados com `ibge_municipios`.
{% enddocs %}

{% docs seed_ibge_municipios %}
### Seed `ibge_municipios`

Conjunto de municípios oficiais do IBGE utilizado para enriquecer o modelo `s.customers`. Mantém o nome padronizado, UF, código IBGE e coordenadas geográficas, garantindo consistência de cidade/estado e possibilitando análises espaciais no pipeline. É carregado na camada `b` (bronze) antes da execução dos modelos silver.
Campos principais:
- `codigo_ibge`: identificador único do município conforme IBGE (usado para vínculos com fontes externas).
- `municipio_upper`: nome oficial do município em caixa alta (usado como valor exibido na silver/gold).
- `municipio_ascii`: versão normalizada sem acentos para casar com o dado bruto.
- `uf`: sigla do estado.
- `latitude` / `longitude`: coordenadas utilizadas em heatmaps e análises regionais.

Aplicação no projeto:
- Join em `s.customers` para padronizar nome de cidade e acrescentar coordenadas.
- Permite análises geoespaciais na camada gold (`geo_heatmap`).
- Pode ser reaproveitado por outras camadas para enriqueceimento regional (ex.: agrupamentos, rotas de logística).
{% enddocs %}

{% docs gold_customer_overview %}
### Tabela `g.customer_overview`

Resumo 360º de clientes: consolida frequência de compra, ticket médio, último pedido, meios de pagamento utilizados e localização com coordenadas oficiais do IBGE. A lógica agrega `orders_s` e `order_payments_s` por cliente para calcular métricas de valor (LTV), primeira e última compra, tempo médio de entrega e conjunto de meios de pagamento mais recorrentes. Utiliza `customer_id` como chave primária e se relaciona com `g.order_fulfillment` (via `customer_id`).
{% enddocs %}

{% docs gold_order_fulfillment %}
### Tabela `g.order_fulfillment`

Linha do tempo dos pedidos, medindo SLA real x estimado. Calcula dias entre compra, aprovação, entrega real e previsão, enriquecendo com valores recebidos (`order_payments_s`). Uma linha por `order_id`, verificada por testes de unicidade e de nulos. Use `customer_id` para relacionar com `g.customer_overview`.
{% enddocs %}

{% docs gold_item_sales %}
### Tabela `g.item_sales`

Métricas de venda por produto/vendedor: soma de preço e frete, ticket médio por item e receita apenas de pedidos entregues. Derivada de `order_items_s` com status de `orders_s`. Chaves primárias: (`product_id`, `seller_id`); chave estrangeira: `product_id` pode ser usada com catálogo de produtos.
{% enddocs %}

{% docs gold_payment_performance %}
### Tabela `g.payment_performance`

Visão financeira por meio de pagamento: total de pedidos, valor agregado, ticket médio e volume parcelado. Base em `order_payments_s`. Chave primária: `payment_type`.
{% enddocs %}

{% docs gold_geo_heatmap %}
### Tabela `g.geo_heatmap`

Agregação por município/UF com coordenadas IBGE. Soma pedidos e receita para análise geográfica usando `customers_s` + `orders_s` + `order_payments_s`. Chave primária: (`customer_state`, `customer_city`).
{% enddocs %}

{% docs gold_product_basket %}
### Tabela `g.product_basket`

Matriz de coocorrência de produtos: explode cestas de `order_items_s`, gera pares (`product_id`, `associated_product_id`) e contabiliza frequência de aparição conjunta. Útil para campanhas de bundle e recomendação. Chave primária: (`product_id`, `associated_product_id`).
{% enddocs %}
