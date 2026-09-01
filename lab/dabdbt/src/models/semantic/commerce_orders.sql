{{ config(alias='commerce_orders', group='commerce', access='public') }}

select *
from {{ ref('order_metrics') }}
