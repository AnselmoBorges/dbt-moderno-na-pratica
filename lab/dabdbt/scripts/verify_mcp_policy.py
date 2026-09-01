#!/usr/bin/env python3
"""Fail if the example MCP policy exposes mutating or warehouse-querying tools."""

import json
from pathlib import Path

PROJECT = Path(__file__).resolve().parents[1]
config = json.loads((PROJECT / "mcp" / "read-only.example.json").read_text(encoding="utf-8"))
server = config["mcpServers"]["dbt-governed-read-only"]
enabled = set(server["env"]["DBT_MCP_ENABLE_TOOLS"].split(","))
allowed = {"compile", "list", "parse", "get_lineage_dev", "get_node_details_dev"}
forbidden = {
    "build", "run", "show", "test", "clone", "execute_sql", "text_to_sql",
    "generate_model_yaml", "generate_source", "generate_staging_model",
}

if enabled != allowed:
    raise SystemExit(f"Allowlist inesperada: {sorted(enabled)}")
if enabled & forbidden:
    raise SystemExit(f"Ferramentas proibidas expostas: {sorted(enabled & forbidden)}")

print("MCP policy OK: somente parse/compile/list e leitura do manifest local.")
