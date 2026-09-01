{{ config(tags=['gold'], alias='order_fulfillment') }}

select
    o.order_id,
    o.customer_id,
    o.order_status,
    o.order_purchase_timestamp,
    o.order_approved_at,
    o.order_delivered_carrier_date,
    o.order_delivered_customer_date,
    o.order_estimated_delivery_date,
    {{ rp_date_diff('o.order_purchase_timestamp', 'o.order_delivered_customer_date') }} as delivery_days,
    {{ rp_date_diff('o.order_approved_at', 'o.order_delivered_customer_date') }} as approval_to_delivery_days,
    {{ rp_date_diff('o.order_purchase_timestamp', 'o.order_estimated_delivery_date') }} as estimated_delivery_days,
    p.total_payment,
    p.max_installments
from {{ ref('orders_s') }} o
left join (
    select
        order_id,
        sum(payment_value) as total_payment,
        max(payment_installments) as max_installments
    from {{ ref('order_payments_s') }}
    group by order_id
) p on o.order_id = p.order_id
