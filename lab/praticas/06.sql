select count(*) as linhas,
       count(distinct order_id) as pedidos,
       count_if(order_id is null) as chaves_nulas,
       count_if(not is_delivered and delivered_revenue <> 0)
         as receita_indevida
from semantic.commerce_orders;
