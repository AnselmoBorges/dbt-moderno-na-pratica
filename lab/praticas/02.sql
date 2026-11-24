select 'Gold' as origem, count(*) as linhas,
       sum(total_payment) as pagamento
from g.order_fulfillment
union all
select 'Gold + itens', count(*), sum(g.total_payment)
from g.order_fulfillment g
join s.order_items i using (order_id)
order by 2;
