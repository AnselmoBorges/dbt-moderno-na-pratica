select unnest(tools) as ferramenta, build_rejected
from read_json_auto('lab/dabdbt/target/mcp_demo.json')
order by 1;
