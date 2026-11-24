select strftime(order_purchase_date, '%Y-%m') as mes,
       sum(total_payment) as receita_bruta,
       sum(delivered_revenue) as receita_entregue
from semantic.commerce_orders
group by 1
order by 1;
