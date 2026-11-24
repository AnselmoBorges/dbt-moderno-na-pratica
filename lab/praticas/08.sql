select order_status as status, count(*) as pedidos,
       sum(delivered_revenue) as receita_entregue
from semantic.commerce_orders
group by 1 order by 1;
