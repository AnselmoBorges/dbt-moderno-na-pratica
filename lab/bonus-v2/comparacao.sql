select recorte.core.pedidos as pedidos_core,
       recorte.v2.pedidos as pedidos_v2,
       recorte.core.receita_entregue as entregue_core,
       recorte.v2.receita_entregue as entregue_v2,
       resultado_migracao
from read_json_auto('build/bonus-v2/resultado.json');
