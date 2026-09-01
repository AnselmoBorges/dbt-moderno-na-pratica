{{
  config(
    alias='order_metrics_v1',
    contract={'enforced': true},
    group='commerce',
    access='public'
  )
}}

select
    cast(o.order_id as varchar) as order_id,
    cast(o.customer_id as varchar) as customer_id,
    cast(o.order_status as varchar) as order_status,
    cast(o.order_purchase_timestamp as date) as order_purchase_date,
    cast(coalesce(p.total_payment, 0) as decimal(18, 2)) as total_payment,
    cast({{ rp_date_diff('o.order_purchase_timestamp', 'o.order_delivered_customer_date') }} as integer) as delivery_days,
    cast(o.order_status = 'delivered' as boolean) as is_delivered
from {{ ref('orders_s') }} o
left join (
    select order_id, sum(payment_value) as total_payment
    from {{ ref('order_payments_s') }}
    group by order_id
) p on o.order_id = p.order_id
