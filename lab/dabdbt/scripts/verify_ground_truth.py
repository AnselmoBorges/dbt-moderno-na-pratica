#!/usr/bin/env python3
"""Execute every benchmark ground-truth query against the local DuckDB lab."""

import json
import math
from numbers import Number
from pathlib import Path

import duckdb

questions = json.loads(Path("benchmarks/questions.json").read_text())["questions"]
database = Path("../data/dabdbt.duckdb")
connection = duckdb.connect(str(database), read_only=True)

failures = []
for question in questions:
    actual = connection.execute(question["ground_truth_sql"]).fetchone()[0]
    expected = question["expected"]
    if isinstance(expected, Number) and isinstance(actual, Number):
        matches = math.isclose(float(actual), float(expected), abs_tol=float(question.get("tolerance", 0)))
    else:
        matches = str(actual).casefold() == str(expected).casefold()
    if not matches:
        failures.append({"id": question["id"], "expected": expected, "actual": actual})

if failures:
    raise SystemExit(json.dumps({"ground_truth_failures": failures}, ensure_ascii=False, indent=2, default=str))
print(f"Ground truth OK: {len(questions)} perguntas validadas no DuckDB.")
