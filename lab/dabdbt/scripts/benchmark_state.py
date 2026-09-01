#!/usr/bin/env python3
"""Demonstrate state selection without changing the checked-out project."""

from __future__ import annotations

import json
import os
import shutil
import subprocess
import tempfile
import time
from pathlib import Path

from runtime import PROJECT, tool

DBT = tool("dbt", "DBT_BIN")
PROFILES = PROJECT / "dbt_profiles"
BASELINE = PROJECT / "target/state-baseline"


DB_PATH = (PROJECT / "../data/dabdbt.duckdb").resolve()


def run(args: list[str], cwd: Path) -> subprocess.CompletedProcess[str]:
    env = {**os.environ, "DBT_DUCKDB_PATH": str(DB_PATH)}
    return subprocess.run(args, cwd=cwd, env=env, check=True, text=True, capture_output=True)


BASELINE.mkdir(parents=True, exist_ok=True)
start = time.perf_counter()
run([str(DBT), "parse", "--profiles-dir", str(PROFILES), "--target", "local", "--target-path", str(BASELINE)], PROJECT)
baseline_seconds = time.perf_counter() - start

with tempfile.TemporaryDirectory(prefix="dbt-state-demo-") as temp_dir:
    temp = Path(temp_dir) / "dabdbt"
    shutil.copytree(
        PROJECT,
        temp,
        ignore=shutil.ignore_patterns(".venv", "target", "logs", "dbt_packages"),
    )
    model = temp / "src/models/silver/orders_s.sql"
    model.write_text(model.read_text() + "\n-- alteração controlada do episódio 9\n")
    run([str(DBT), "deps", "--profiles-dir", str(PROFILES), "--target", "local"], temp)
    selected = run(
        [
            str(DBT), "ls", "--profiles-dir", str(PROFILES), "--target", "local",
            "--select", "state:modified+", "--state", str(BASELINE), "--output", "name",
        ],
        temp,
    ).stdout.splitlines()

    defer_target = temp / "target-defer"
    deferred = run(
        [
            str(DBT), "build", "--profiles-dir", str(PROFILES), "--target", "ci",
            "--select", "commerce_orders", "--defer", "--favor-state",
            "--state", str(BASELINE), "--target-path", str(defer_target),
        ],
        temp,
    )
    defer_results = json.loads((defer_target / "run_results.json").read_text())["results"]
    defer_statuses = {item["status"] for item in defer_results}
    if not defer_statuses.issubset({"success", "pass", "no-op"}):
        raise SystemExit(f"Build com defer falhou: {defer_statuses}\n{deferred.stdout}")
    defer_manifest = json.loads((defer_target / "manifest.json").read_text())
    compiled = defer_manifest["nodes"]["model.dabdbt.commerce_orders"]["compiled_code"]
    if "ci_semantic" in compiled or "semantic" not in compiled:
        raise SystemExit(f"Parent não foi resolvido pelo estado anterior: {compiled}")

selected = [line for line in selected if line and not line.startswith("\x1b") and "Running with" not in line]
required = {"orders_s", "order_fulfillment_g", "commerce_orders"}
if not required.issubset(set(selected)):
    raise SystemExit(f"Seleção state incompleta. Esperado {sorted(required)}, obtido {selected}")

print(json.dumps({
    "baseline_parse_seconds": round(baseline_seconds, 4),
    "selected_count": len(selected),
    "selected_nodes": selected,
    "defer_build_status": sorted(defer_statuses),
    "deferred_parent_relation": "semantic.order_metrics_v2",
}, indent=2))
