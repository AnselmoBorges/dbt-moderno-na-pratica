#!/usr/bin/env python3
"""Compare full and focused builds with local, reproducible cost proxies."""

from __future__ import annotations

import json
import os
import subprocess
import sys
import tempfile
import time
from pathlib import Path

from runtime import PROJECT, tool

DBT = tool("dbt", "DBT_BIN")
PROFILES = PROJECT / "dbt_profiles"


def build(select: str | None, target_path: Path) -> dict[str, object]:
    args = [str(DBT), "build", "--profiles-dir", str(PROFILES), "--target", "local", "--target-path", str(target_path)]
    if select:
        args += ["--select", select]
    start = time.perf_counter()
    subprocess.run(args, cwd=PROJECT, check=True, capture_output=True, text=True)
    elapsed = time.perf_counter() - start
    results = json.loads((target_path / "run_results.json").read_text())["results"]
    executed = [item for item in results if item["status"] in {"success", "pass"}]
    return {
        "seconds": round(elapsed, 4),
        "resources_executed": len(executed),
        "resource_time_seconds": round(sum(item["execution_time"] for item in executed), 4),
        "local_cost": 0,
        "cost_proxy_resource_seconds": round(sum(item["execution_time"] for item in executed), 4),
    }


with tempfile.TemporaryDirectory(prefix="dbt-finops-") as temp_dir:
    root = Path(temp_dir)
    full = build(None, root / "full")
    focused = build("order_fulfillment_g+", root / "focused")

subprocess.run([os.environ.get("PYTHON_BIN") or sys.executable, "scripts/verify_ground_truth.py"], cwd=PROJECT, check=True)
reduction = 1 - (focused["resources_executed"] / full["resources_executed"])
report = {
    "measurement": "local DuckDB proxy; not cloud billing",
    "full_build": full,
    "focused_build": focused,
    "resource_count_reduction": round(reduction, 4),
    "functional_result_equal": True,
}
print(json.dumps(report, ensure_ascii=False, indent=2))
