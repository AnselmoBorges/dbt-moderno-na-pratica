select modelo ->> 'group' as dominio,
       modelo ->> 'access' as acesso,
       json_keys(exposures)[1] as exposure
from read_json('lab/dabdbt/target/manifest.json',
               columns = {nodes: 'JSON', exposures: 'JSON'}),
     lateral (select nodes -> 'model.dabdbt.commerce_orders'
                     as modelo);
