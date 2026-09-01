{{
  config(
    alias='order_metrics_v2',
    contract={'enforced': true},
    group='commerce',
    access='public'
  )
}}

with payments as (
    select order_id, sum(payment_value) as total_payment
    from {{ ref('order_payments_s') }}
    group by order_id
),
items as (
    select order_id, sum(price) as item_revenue
    from {{ ref('order_items_s') }}
    group by order_id
)
select
    cast(o.order_id as varchar) as order_id,
    cast(o.customer_id as varchar) as customer_id,
    cast(o.order_status as varchar) as order_status,
    cast(o.order_purchase_timestamp as date) as order_purchase_date,
    cast(coalesce(p.total_payment, 0) as decimal(18, 2)) as total_payment,
    cast(case when o.order_status = 'delivered' then coalesce(p.total_payment, 0) else 0 end as decimal(18, 2)) as delivered_revenue,
    cast(coalesce(i.item_revenue, 0) as decimal(18, 2)) as item_revenue,
    cast({{ rp_date_diff('o.order_purchase_timestamp', 'o.order_delivered_customer_date') }} as integer) as delivery_days,
    cast(o.order_status = 'delivered' as boolean) as is_delivered
from {{ ref('orders_s') }} o
left join payments p on o.order_id = p.order_id
left join items i on o.order_id = i.order_id
