#!/usr/bin/env python3
"""Compare full-refresh and incremental outcomes for the orders interface."""

from __future__ import annotations

import json
import os
import subprocess
import tempfile
from pathlib import Path

import duckdb

from runtime import PROJECT, tool

DBT = tool("dbt", "DBT_BIN")
PROFILES = PROJECT / "dbt_profiles"
DB_PATH = Path(os.environ.get("DBT_DUCKDB_PATH", str((PROJECT / "../data/dabdbt.duckdb").resolve())))


def run(target_path: Path, full_refresh: bool) -> dict[str, object]:
    args = [
        str(DBT), "run", "--profiles-dir", str(PROFILES), "--target", "local",
        "--select", "orders_s", "--target-path", str(target_path),
    ]
    if full_refresh:
        args.append("--full-refresh")
    subprocess.run(
        args,
        cwd=PROJECT,
        env={**os.environ, "DBT_DUCKDB_PATH": str(DB_PATH)},
        check=True,
        capture_output=True,
        text=True,
    )
    run_result = json.loads((target_path / "run_results.json").read_text())["results"][0]
    return {"seconds": round(run_result["execution_time"], 6)}


def rows() -> list[tuple[object, ...]]:
    with duckdb.connect(str(DB_PATH), read_only=True) as connection:
        return connection.execute("select * from s.orders order by order_id").fetchall()


with tempfile.TemporaryDirectory(prefix="dbt-incremental-") as temp_dir:
    temp = Path(temp_dir)
    full = run(temp / "full", full_refresh=True)
    full_rows = rows()
    with duckdb.connect(str(DB_PATH), read_only=True) as connection:
        source_rows = connection.execute("select count(*) from b.orders").fetchone()[0]
        incremental_candidates = connection.execute(
            "select count(*) from b.orders where order_purchase_timestamp >= "
            "(select max(order_purchase_timestamp) from s.orders)"
        ).fetchone()[0]
    incremental = run(temp / "incremental", full_refresh=False)
    incremental_rows = rows()

if full_rows != incremental_rows:
    raise SystemExit("Incremental alterou o resultado funcional de orders_s.")
if len(incremental_rows) != source_rows:
    raise SystemExit("Incremental perdeu ou duplicou pedidos.")

print(json.dumps({
    "measurement": "local DuckDB; candidate rows are a deterministic proxy",
    "full_refresh": {"source_candidate_rows": source_rows, "seconds": full["seconds"]},
    "incremental": {"source_candidate_rows": incremental_candidates, "seconds": incremental["seconds"]},
    "result_rows": len(incremental_rows),
    "functional_result_equal": True,
}, ensure_ascii=False, indent=2))
