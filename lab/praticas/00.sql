select order_id as pedido, order_status as status,
       cast(order_purchase_timestamp as date) as compra,
       cast(order_delivered_customer_date as date) as entrega
from b.orders
order by order_id
limit 4;
