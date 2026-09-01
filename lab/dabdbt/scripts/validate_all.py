#!/usr/bin/env python3
"""Executa a suíte determinística completa do laboratório."""

from __future__ import annotations

import subprocess

from runtime import PROJECT, environment, python, tool


DBT = tool("dbt", "DBT_BIN")
MF = tool("mf", "MF_BIN")
PYTHON = python()
COMMON = ["--profiles-dir", "dbt_profiles", "--target", "local"]

COMMANDS = [
    [DBT, "parse", *COMMON],
    [DBT, "compile", *COMMON],
    [DBT, "seed", *COMMON, "--full-refresh"],
    [DBT, "run-operation", "create_freshness_fixture", "--args", "{age_hours: 0}", *COMMON],
    [DBT, "build", *COMMON],
    [DBT, "docs", "generate", *COMMON],
    [PYTHON, "scripts/verify_artifacts.py"],
    [PYTHON, "scripts/verify_source_freshness.py"],
    [MF, "validate-configs"],
    [MF, "query", "--metrics", "orders,gross_revenue,delivered_revenue,average_order_value", "--group-by", "metric_time__month"],
    [PYTHON, "scripts/verify_mcp_policy.py"],
    [PYTHON, "scripts/verify_mcp_server.py"],
    [PYTHON, "scripts/verify_ground_truth.py"],
    [PYTHON, "scripts/score_agent_benchmark.py", "benchmarks/traces/raw_schema.fixture.json", "benchmarks/traces/manifest_context.fixture.json", "benchmarks/traces/semantic_mcp.fixture.json"],
    [PYTHON, "scripts/verify_governance_metadata.py"],
    [PYTHON, "scripts/verify_breaking_change.py"],
    [PYTHON, "scripts/benchmark_state.py"],
    [PYTHON, "scripts/verify_incremental_equivalence.py"],
    [PYTHON, "scripts/benchmark_finops.py"],
]

for command in COMMANDS:
    print("\n›", " ".join(str(part) for part in command))
    subprocess.run([str(part) for part in command], cwd=PROJECT, env=environment(), check=True)

print("\nValidação completa OK.")
