{{ config(tags=['gold'], alias='geo_heatmap') }}

select
    c.customer_state,
    c.customer_city,
    c.customer_latitude,
    c.customer_longitude,
    count(distinct o.order_id) as total_orders,
    sum(p.total_payment) as total_revenue
from {{ ref('customers_s') }} c
left join {{ ref('orders_s') }} o on c.customer_id = o.customer_id
left join (
    select order_id, sum(payment_value) as total_payment
    from {{ ref('order_payments_s') }}
    group by order_id
) p on o.order_id = p.order_id
where c.customer_latitude is not null and c.customer_longitude is not null
group by c.customer_state, c.customer_city, c.customer_latitude, c.customer_longitude
