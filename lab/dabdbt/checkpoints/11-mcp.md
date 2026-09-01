# 11 — MCP somente leitura

Execute `python scripts/run_checkpoint.py 11`. A configuração e o servidor iniciado via stdio devem expor apenas `compile`, `list`, `parse`, `get_lineage_dev` e `get_node_details_dev`. Uma chamada explícita a `build` deve ser rejeitada como tool desconhecida.
