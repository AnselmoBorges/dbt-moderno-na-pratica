select list_contains(selected_nodes, 'orders_s') as mudou,
       list_contains(selected_nodes, 'commerce_orders')
           as dependente,
       deferred_parent_relation as relacao_reusada
from read_json_auto('lab/dabdbt/target/state_demo.json');
