#!/usr/bin/env python3
"""Inicia a DuckDB UI sobre uma cópia segura do banco didático."""

from __future__ import annotations

import argparse
import shutil
import time
from pathlib import Path

import duckdb


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--source", type=Path, required=True)
    parser.add_argument("--snapshot", type=Path, required=True)
    parser.add_argument("--port", type=int, default=4213)
    args = parser.parse_args()

    source = args.source.resolve()
    snapshot = args.snapshot.resolve()
    if not source.is_file():
        raise SystemExit(
            "Banco do laboratório ainda não existe. "
            "Execute primeiro: python course.py checkpoint 01"
        )
    if not 1024 <= args.port <= 65535:
        raise SystemExit("A porta deve estar entre 1024 e 65535.")

    snapshot.parent.mkdir(parents=True, exist_ok=True)
    shutil.copy2(source, snapshot)

    connection = duckdb.connect(str(snapshot))
    connection.execute(f"SET ui_local_port = {args.port}")
    connection.execute("INSTALL ui")
    connection.execute("LOAD ui")
    connection.execute("CALL start_ui_server()")

    print("\nDuckDB UI pronta.")
    print(f"Abra http://localhost:{args.port} ou a guia Ports do Codespaces.")
    print("A interface usa uma cópia do banco; alterações não afetam o laboratório.")
    print("Mantenha este terminal aberto. Pressione Ctrl+C para encerrar.\n")

    try:
        while True:
            time.sleep(3600)
    except KeyboardInterrupt:
        print("\nEncerrando DuckDB UI...")
    finally:
        connection.execute("CALL stop_ui_server()")
        connection.close()
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
