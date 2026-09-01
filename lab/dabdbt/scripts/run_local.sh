#!/usr/bin/env bash
set -euo pipefail

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
DBT_BIN="${DBT_BIN:-$PROJECT_DIR/.venv/bin/dbt}"
MF_BIN="${MF_BIN:-$PROJECT_DIR/.venv/bin/mf}"

cd "$PROJECT_DIR"
"$DBT_BIN" deps --profiles-dir dbt_profiles --target local
"$DBT_BIN" parse --profiles-dir dbt_profiles --target local
"$DBT_BIN" compile --profiles-dir dbt_profiles --target local
"$DBT_BIN" seed --profiles-dir dbt_profiles --target local --full-refresh
"$DBT_BIN" run-operation create_freshness_fixture --args '{age_hours: 0}' --profiles-dir dbt_profiles --target local
"$DBT_BIN" build --profiles-dir dbt_profiles --target local
"$DBT_BIN" docs generate --profiles-dir dbt_profiles --target local
"$PROJECT_DIR/.venv/bin/python" scripts/verify_artifacts.py
"$PROJECT_DIR/.venv/bin/python" scripts/verify_source_freshness.py
DBT_PROFILES_DIR=dbt_profiles "$MF_BIN" validate-configs
DBT_PROFILES_DIR=dbt_profiles "$MF_BIN" query \
  --metrics orders,gross_revenue,delivered_revenue,average_order_value \
  --group-by metric_time__month \
  --order metric_time__month
"$PROJECT_DIR/.venv/bin/python" scripts/verify_mcp_policy.py
"$PROJECT_DIR/.venv/bin/python" scripts/verify_mcp_server.py
"$PROJECT_DIR/.venv/bin/python" scripts/verify_ground_truth.py
"$PROJECT_DIR/.venv/bin/python" scripts/score_agent_benchmark.py benchmarks/traces/*.fixture.json
"$PROJECT_DIR/.venv/bin/python" scripts/verify_governance_metadata.py
"$PROJECT_DIR/.venv/bin/python" scripts/verify_breaking_change.py
"$PROJECT_DIR/.venv/bin/python" scripts/benchmark_state.py
"$PROJECT_DIR/.venv/bin/python" scripts/verify_incremental_equivalence.py
"$PROJECT_DIR/.venv/bin/python" scripts/benchmark_finops.py
