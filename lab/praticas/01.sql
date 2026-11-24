select metadata ->> 'project_name' as projeto,
       metadata ->> 'dbt_version' as dbt,
       parent_map -> 'model.dabdbt.commerce_orders' as pais
from read_json('lab/dabdbt/target/manifest.json',
               columns = {metadata: 'JSON', parent_map: 'JSON'});
