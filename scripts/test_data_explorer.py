#!/usr/bin/env python3
"""Smoke test do explorador gráfico sem navegador ou porta fixa."""

from __future__ import annotations

import importlib.util
import json
import tempfile
import threading
import urllib.error
import urllib.request
from pathlib import Path

import duckdb


ROOT = Path(__file__).resolve().parents[1]
MODULE_PATH = ROOT / "scripts" / "start_data_explorer.py"
SPEC = importlib.util.spec_from_file_location("course_data_explorer", MODULE_PATH)
assert SPEC and SPEC.loader
MODULE = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(MODULE)


def request_json(url: str, payload: dict[str, str] | None = None) -> tuple[int, object]:
    data = json.dumps(payload).encode() if payload is not None else None
    request = urllib.request.Request(
        url,
        data=data,
        headers={"Content-Type": "application/json"} if data else {},
        method="POST" if data else "GET",
    )
    try:
        with urllib.request.urlopen(request, timeout=5) as response:
            return response.status, json.load(response)
    except urllib.error.HTTPError as exc:
        return exc.code, json.load(exc)


def main() -> int:
    with tempfile.TemporaryDirectory(prefix="dbt-course-explorer-") as temporary:
        directory = Path(temporary)
        source, snapshot = directory / "source.duckdb", directory / "snapshot.duckdb"
        with duckdb.connect(str(source)) as connection:
            connection.execute("create schema g")
            connection.execute("create table g.orders as select 1 as order_id, 42.5 as revenue")
        assert MODULE.snapshot_database(source, snapshot) == 1
        server = MODULE.ThreadingHTTPServer(("127.0.0.1", 0), MODULE.handler_for(snapshot))
        thread = threading.Thread(target=server.serve_forever, daemon=True)
        thread.start()
        base = f"http://127.0.0.1:{server.server_port}"
        try:
            with urllib.request.urlopen(base, timeout=5) as response:
                assert response.status == 200
                assert b"interface autoral do curso" in response.read()
            status, catalog = request_json(f"{base}/api/catalog")
            assert status == 200 and catalog == {"g": ["orders"]}
            status, result = request_json(f"{base}/api/query", {"sql": "select * from g.orders"})
            assert status == 200 and result == {"columns": ["order_id", "revenue"], "rows": [[1, "42.5"]]}, result
            status, rejected = request_json(f"{base}/api/query", {"sql": "drop table g.orders"})
            assert status == 400 and "Somente consultas" in rejected["error"]
        finally:
            server.shutdown()
            server.server_close()
            thread.join(timeout=5)
    print("Explorador DuckDB OK: página, catálogo, consulta e bloqueio de escrita validados.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
