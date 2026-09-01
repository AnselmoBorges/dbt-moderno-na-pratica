#!/usr/bin/env python3
"""Prove a passing and a failing freshness check with deterministic fixtures."""

from __future__ import annotations

import json
import os
import subprocess
import tempfile
from pathlib import Path

from runtime import PROJECT, tool

DBT = tool("dbt", "DBT_BIN")
PROFILES = PROJECT / "dbt_profiles"


def dbt(*args: str, check: bool = True) -> subprocess.CompletedProcess[str]:
    return subprocess.run(
        [str(DBT), *args, "--profiles-dir", str(PROFILES), "--target", "local"],
        cwd=PROJECT,
        capture_output=True,
        text=True,
        check=check,
    )


with tempfile.TemporaryDirectory(prefix="dbt-freshness-") as temp_dir:
    target = Path(temp_dir)
    dbt("run-operation", "create_freshness_fixture", "--args", "{age_hours: 0}")
    passing = dbt(
        "source", "freshness", "--select", "source:lab_quality",
        "--target-path", str(target / "passing"),
    )
    pass_doc = json.loads((target / "passing/sources.json").read_text())
    pass_statuses = {item["status"] for item in pass_doc["results"]}
    if pass_statuses != {"pass"}:
        raise SystemExit(f"Freshness recente deveria passar: {pass_statuses}\n{passing.stdout}")

    dbt("run-operation", "create_freshness_fixture", "--args", "{age_hours: 24}")
    failing = dbt(
        "source", "freshness", "--select", "source:lab_quality",
        "--target-path", str(target / "failing"), check=False,
    )
    fail_doc = json.loads((target / "failing/sources.json").read_text())
    fail_statuses = {item["status"] for item in fail_doc["results"]}
    if failing.returncode == 0 or "error" not in fail_statuses:
        raise SystemExit(f"Freshness envelhecida deveria falhar: {fail_statuses}\n{failing.stdout}")

    # Leave the local database ready for another successful demonstration.
    dbt("run-operation", "create_freshness_fixture", "--args", "{age_hours: 0}")

print("Freshness OK: carga atual passa e fixture com 24 horas é rejeitada.")
