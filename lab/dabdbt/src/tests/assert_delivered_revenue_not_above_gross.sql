select *
from {{ ref('order_metrics', v=2) }}
where delivered_revenue > total_payment
   or delivered_revenue < 0
