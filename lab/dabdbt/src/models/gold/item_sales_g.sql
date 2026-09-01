{{ config(tags=['gold'], alias='item_sales') }}

select
    i.product_id,
    i.seller_id,
    count(*) as total_items,
    sum(i.price) as gross_revenue,
    sum(i.freight_value) as total_freight,
    avg(i.price) as avg_item_price,
    sum(case when o.order_status = 'delivered' then i.price else 0 end) as delivered_revenue
from {{ ref('order_items_s') }} i
left join {{ ref('orders_s') }} o on i.order_id = o.order_id
group by i.product_id, i.seller_id
