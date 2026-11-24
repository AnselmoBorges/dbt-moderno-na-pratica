select metrica ->> 'name' as metrica
from read_json('lab/dabdbt/target/osi_document.json',
               columns = {semantic_model: 'JSON[]'}),
     unnest(semantic_model) as modelos(modelo),
     unnest(cast(modelo -> 'metrics' as JSON[])) as m(metrica)
order by 1;
