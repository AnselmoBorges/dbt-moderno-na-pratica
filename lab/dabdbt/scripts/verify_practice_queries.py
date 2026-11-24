#!/usr/bin/env python3
"""Verifica as consultas de aula contra o banco e os artifacts do laboratório."""

from __future__ import annotations

import json
import os
from datetime import date

import duckdb

from runtime import PROJECT


ROOT = PROJECT.parent.parent
PRACTICES = ROOT / "lab" / "praticas"
DB = PROJECT.parent / "data" / "dabdbt.duckdb"

# Os mesmos caminhos relativos que o aluno usa no terminal e no navegador.
os.chdir(ROOT)
lessons = json.loads((PRACTICES / "aulas.json").read_text(encoding="utf-8"))
assert sorted(lessons) == [*(f"{number:02}" for number in range(13)), "12-insight"]
with duckdb.connect(str(DB), read_only=True) as connection:
    for number, lesson in sorted(lessons.items()):
        sql = (PRACTICES / f"{number}.sql").read_text(encoding="utf-8")
        rows = [[value.isoformat() if isinstance(value, date) else value for value in row]
                for row in connection.execute(sql).fetchall()]
        if rows != lesson["expected"]:
            raise SystemExit(f"Aula {number}: esperado {lesson['expected']}, obtido {rows}")
print(f"Práticas SQL OK: {len(lessons)} consultas reproduziram os resultados das aulas.")
