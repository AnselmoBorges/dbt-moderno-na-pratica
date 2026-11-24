select strftime(order_purchase_date, '%Y-%m') as mes,
       count(distinct order_id) as pedidos,
       sum(total_payment) as receita_bruta,
       sum(delivered_revenue) as receita_entregue,
       sum(total_payment) / count(distinct order_id) as ticket
from semantic.commerce_orders
group by 1 order by 1;
