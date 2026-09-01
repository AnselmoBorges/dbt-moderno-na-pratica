{{ config(tags=['gold'], alias='payment_performance') }}

select
    payment_type,
    count(distinct order_id) as orders,
    sum(payment_value) as total_value,
    avg(payment_value) as avg_payment,
    sum(case when payment_installments > 1 then payment_value else 0 end) as installment_value,
    avg(payment_installments) as avg_installments
from {{ ref('order_payments_s') }}
group by payment_type
