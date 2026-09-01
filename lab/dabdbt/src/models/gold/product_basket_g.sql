{{ config(tags=['gold'], alias='product_basket') }}

select
    a.product_id,
    b.product_id as associated_product_id,
    count(*) as co_occurrence
from {{ ref('order_items_s') }} a
join {{ ref('order_items_s') }} b
  on a.order_id = b.order_id
 and a.product_id < b.product_id
group by a.product_id, b.product_id
