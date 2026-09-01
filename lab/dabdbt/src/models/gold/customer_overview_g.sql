{{ config(tags=['gold'], alias='customer_overview') }}

with orders as (
    select
        o.order_id,
        o.customer_id,
        o.order_status,
        o.order_purchase_timestamp,
        o.order_delivered_customer_date,
        o.order_estimated_delivery_date
    from {{ ref('orders_s') }} o
),
order_payments as (
    select
        order_id,
        sum(payment_value) as total_payment,
        max(payment_installments) as max_installments
    from {{ ref('order_payments_s') }}
    group by order_id
),
customer_payment_types as (
    select
        o.customer_id,
        {{ rp_collect_set_string('p.payment_type') }} as payment_types
    from {{ ref('orders_s') }} o
    join {{ ref('order_payments_s') }} p on o.order_id = p.order_id
    group by o.customer_id
),
customer_orders as (
    select
        c.customer_id,
        c.customer_unique_id,
        c.customer_city,
        c.customer_state,
        c.customer_latitude,
        c.customer_longitude,
        count(distinct o.order_id) as total_orders,
        sum(p.total_payment) as total_spent,
        avg(p.total_payment) as avg_ticket,
        min(o.order_purchase_timestamp) as first_order_at,
        max(o.order_purchase_timestamp) as last_order_at,
        avg({{ rp_date_diff('o.order_purchase_timestamp', 'o.order_delivered_customer_date') }}) as avg_delivery_days,
        t.payment_types,
        {{ rp_last_by('o.order_status', 'o.order_purchase_timestamp') }} as last_order_status
    from {{ ref('customers_s') }} c
    left join orders o on c.customer_id = o.customer_id
    left join order_payments p on o.order_id = p.order_id
    left join customer_payment_types t on c.customer_id = t.customer_id
    group by c.customer_id, c.customer_unique_id, c.customer_city, c.customer_state, c.customer_latitude, c.customer_longitude, t.payment_types
)

select * from customer_orders
