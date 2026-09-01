#!/usr/bin/env python3
"""Run one cumulative, executable episode checkpoint."""

from __future__ import annotations

import argparse
import subprocess

from runtime import PROJECT, environment, python, tool

PYTHON = python()
DBT = tool("dbt", "DBT_BIN")
MF = tool("mf", "MF_BIN")
ENV = environment()

CHECKPOINTS = {
    "01": ("Playlist auditada e Core 1.12", [
        [DBT, "seed", "--profiles-dir", "dbt_profiles", "--target", "local", "--full-refresh"],
        [DBT, "run-operation", "create_freshness_fixture", "--args", "{age_hours: 0}", "--profiles-dir", "dbt_profiles", "--target", "local"],
        [DBT, "parse", "--profiles-dir", "dbt_profiles", "--target", "local"],
        [DBT, "build", "--profiles-dir", "dbt_profiles", "--target", "local"],
        [DBT, "docs", "generate", "--profiles-dir", "dbt_profiles", "--target", "local"],
        [PYTHON, "scripts/verify_artifacts.py"],
    ]),
    "02": ("Gold versus semântica", [[DBT, "build", "--profiles-dir", "dbt_profiles", "--target", "local", "--select", "tag:gold+"], [PYTHON, "scripts/verify_ground_truth.py"]]),
    "03": ("MetricFlow local", [[MF, "validate-configs"], [MF, "query", "--metrics", "orders,gross_revenue,delivered_revenue,average_order_value", "--group-by", "metric_time__month"]]),
    "04": ("Semântica aberta e interoperável", [[MF, "query", "--metrics", "orders,gross_revenue,average_order_value", "--group-by", "metric_time__month"], [PYTHON, "scripts/verify_artifacts.py"], [PYTHON, "scripts/verify_ground_truth.py"]]),
    "05": ("Contratos e versões", [[PYTHON, "scripts/verify_breaking_change.py"]]),
    "06": ("Pirâmide de qualidade", [[DBT, "build", "--profiles-dir", "dbt_profiles", "--target", "local"], [PYTHON, "scripts/verify_source_freshness.py"]]),
    "07": ("Governança como código", [[PYTHON, "scripts/verify_governance_metadata.py"]]),
    "08": ("Data products abertos", [[PYTHON, "scripts/verify_governance_metadata.py"]]),
    "09": ("CI por estado", [[PYTHON, "scripts/benchmark_state.py"]]),
    "10": ("FinOps", [[PYTHON, "scripts/verify_incremental_equivalence.py"], [PYTHON, "scripts/benchmark_finops.py"]]),
    "11": ("MCP somente leitura", [[PYTHON, "scripts/verify_mcp_policy.py"], [PYTHON, "scripts/verify_mcp_server.py"]]),
    "12": ("Agente governado", [[PYTHON, "scripts/verify_ground_truth.py"], [PYTHON, "scripts/score_agent_benchmark.py", "benchmarks/traces/raw_schema.fixture.json", "benchmarks/traces/manifest_context.fixture.json", "benchmarks/traces/semantic_mcp.fixture.json"]]),
}

parser = argparse.ArgumentParser()
parser.add_argument("checkpoint", nargs="?")
parser.add_argument("--list", action="store_true")
args = parser.parse_args()

if args.list:
    for number, (title, _) in CHECKPOINTS.items():
        print(f"{number} — {title}")
    raise SystemExit(0)

number = (args.checkpoint or "").zfill(2)
if number not in CHECKPOINTS:
    parser.error("use um checkpoint entre 01 e 12, ou --list")

title, commands = CHECKPOINTS[number]
print(f"Checkpoint {number}: {title}")
for command in commands:
    subprocess.run([str(part) for part in command], cwd=PROJECT, env=ENV, check=True)
print(f"Checkpoint {number} OK")
