with pedidos as (
    select order_id, order_status, total_payment from g.order_fulfillment
)
select count(*) as pedidos,
       coalesce(sum(total_payment), 0) as receita_bruta,
       coalesce(sum(total_payment)
           filter (where order_status = 'delivered'), 0) as receita_entregue
from pedidos;
