select table_name as versao, count(*) as colunas,
       count_if(column_name = 'delivered_revenue') > 0
           as tem_receita_entregue
from information_schema.columns
where table_schema = 'semantic'
  and table_name in ('order_metrics_v1', 'order_metrics_v2')
group by 1 order by 1;
