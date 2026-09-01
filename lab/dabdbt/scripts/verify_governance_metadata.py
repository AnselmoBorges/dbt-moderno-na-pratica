#!/usr/bin/env python3
"""Assert the governance interface emitted in dbt's manifest."""

from __future__ import annotations

import json
import subprocess
from pathlib import Path

from runtime import PROJECT, tool

DBT = tool("dbt", "DBT_BIN")
MANIFEST = PROJECT / "target/manifest.json"

subprocess.run(
    [str(DBT), "parse", "--profiles-dir", "dbt_profiles", "--target", "local"],
    cwd=PROJECT,
    check=True,
)
manifest = json.loads(MANIFEST.read_text())

groups = manifest.get("groups", {})
exposures = manifest.get("exposures", {})
nodes = manifest["nodes"]
metrics = manifest.get("metrics", {})

assert any(item["name"] == "commerce" for item in groups.values())
assert any(item["name"] == "governed_commerce_agent" for item in exposures.values())
assert {"orders", "gross_revenue", "delivered_revenue", "average_order_value"}.issubset(
    {item["name"] for item in metrics.values()}
)

api_nodes = [item for item in nodes.values() if item.get("name") == "order_metrics"]
assert {item.get("version") for item in api_nodes} == {1, 2}
assert all(item["config"].get("access") == "public" for item in api_nodes)
assert all(item["config"].get("contract", {}).get("enforced") for item in api_nodes)
api_v2 = next(item for item in api_nodes if item.get("version") == 2)
assert api_v2.get("latest_version") == 2

facade = next(item for item in nodes.values() if item.get("name") == "commerce_orders")
assert facade["config"].get("group") == "commerce"
assert facade["config"].get("access") == "public"
assert "agent_readable" in facade["config"].get("tags", [])
assert facade["config"].get("meta", {}).get("approved_consumers") == ["bi", "api", "read_only_agent"]
assert facade["config"].get("meta", {}).get("contains_direct_pii") is False
assert "model.dabdbt.order_metrics.v2" in facade["depends_on"]["nodes"]

print("Governança OK: owner/group, access público, contrato, latest_version, exposure e métricas no manifest.")
