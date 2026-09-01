#!/usr/bin/env python3
"""Prove that an incompatible implementation is rejected by an enforced contract."""

from __future__ import annotations

import os
import shutil
import subprocess
import tempfile
from pathlib import Path

PROJECT = Path(__file__).resolve().parents[1]
LOCAL_DBT = PROJECT / ".venv/bin/dbt"
DBT = Path(os.environ.get("DBT_BIN") or (str(LOCAL_DBT) if LOCAL_DBT.exists() else shutil.which("dbt") or "dbt"))

with tempfile.TemporaryDirectory(prefix="dbt-contract-demo-") as temp_dir:
    temp = Path(temp_dir) / "dabdbt"
    shutil.copytree(
        PROJECT,
        temp,
        ignore=shutil.ignore_patterns(".venv", "target", "logs", "dbt_packages"),
    )
    model = temp / "src/models/semantic/order_metrics_v2.sql"
    sql = model.read_text()
    marker = "    cast(o.customer_id as varchar) as customer_id,\n"
    if marker not in sql:
        raise SystemExit("Marcador do cenário de breaking change não encontrado.")
    model.write_text(sql.replace(marker, "", 1))
    subprocess.run(
        [str(DBT), "deps", "--profiles-dir", str(PROJECT / "dbt_profiles"), "--target", "local"],
        cwd=temp,
        check=True,
        capture_output=True,
        text=True,
    )
    result = subprocess.run(
        [
            str(DBT), "build", "--profiles-dir", str(PROJECT / "dbt_profiles"),
            "--target", "local", "--select", "order_metrics_v2",
        ],
        cwd=temp,
        capture_output=True,
        text=True,
    )

if result.returncode == 0:
    raise SystemExit("Falha: a remoção de customer_id não foi bloqueada pelo contrato.")
combined = f"{result.stdout}\n{result.stderr}".lower()
if "contract" not in combined and "customer_id" not in combined:
    raise SystemExit("O build falhou, mas não há evidência de violação do contrato.")
print("Breaking change bloqueada: implementação sem customer_id viola o contrato da versão 2.")
