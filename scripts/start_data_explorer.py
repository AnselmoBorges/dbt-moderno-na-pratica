#!/usr/bin/env python3
"""Explorador gráfico, local e somente leitura para o DuckDB do curso."""

from __future__ import annotations

import argparse
import json
import shutil
from http import HTTPStatus
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import parse_qs, urlparse

import duckdb


HTML = r"""<!doctype html>
<html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Explorador DuckDB — dbt Moderno na Prática</title>
<style>
:root{color-scheme:dark;--navy:#06142e;--panel:#0a2348;--cyan:#1ec5ff;--text:#eef8ff;--muted:#9eb7ca;--line:#21466e}
*{box-sizing:border-box}body{margin:0;background:var(--navy);color:var(--text);font:15px Arial,sans-serif}
header{padding:18px 24px;border-bottom:1px solid var(--line)}h1{font-size:22px;margin:0 0 5px}small{color:var(--muted)}
main{display:grid;grid-template-columns:280px 1fr;min-height:calc(100vh - 78px)}aside{border-right:1px solid var(--line);padding:18px;overflow:auto}
section{padding:22px;min-width:0}.table{display:block;width:100%;padding:9px 10px;margin:5px 0;border:0;border-radius:7px;background:transparent;color:var(--text);text-align:left;cursor:pointer}.table:hover{background:var(--panel)}
h2{font-size:17px;margin:0 0 12px}textarea{width:100%;min-height:130px;resize:vertical;background:#020b1c;color:#dff7ff;border:1px solid var(--line);border-radius:8px;padding:14px;font:15px ui-monospace,Consolas,monospace}
button.run{margin:12px 0 18px;background:var(--cyan);color:#001326;border:0;border-radius:7px;padding:10px 18px;font-weight:700;cursor:pointer}
.status{color:var(--muted);margin-left:12px}.wrap{overflow:auto;border:1px solid var(--line);border-radius:8px;max-height:55vh}table{border-collapse:collapse;width:100%;background:#071a38}th,td{padding:9px 11px;border-bottom:1px solid var(--line);text-align:left;white-space:nowrap}th{position:sticky;top:0;background:var(--panel);color:var(--cyan)}
.error{color:#ff9c9c;white-space:pre-wrap}@media(max-width:760px){main{grid-template-columns:1fr}aside{border-right:0;border-bottom:1px solid var(--line)}}
</style></head><body>
<header><h1>Explorador DuckDB</h1><small>dbt Moderno na Prática · snapshot somente leitura · interface autoral do curso</small></header>
<main><aside><h2>Schemas e tabelas</h2><div id="catalog">Carregando…</div></aside>
<section><h2>Consulta</h2><textarea id="sql">select table_schema, table_name from information_schema.tables order by 1, 2 limit 100</textarea><br>
<button class="run" id="run">Executar consulta</button><span class="status" id="status"></span><div id="result"></div></section></main>
<script>
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function render(data){const out=document.querySelector('#result');if(data.error){out.innerHTML='<p class="error">'+esc(data.error)+'</p>';return}const head=data.columns.map(c=>'<th>'+esc(c)+'</th>').join('');const rows=data.rows.map(r=>'<tr>'+r.map(v=>'<td>'+esc(v)+'</td>').join('')+'</tr>').join('');out.innerHTML='<div class="wrap"><table><thead><tr>'+head+'</tr></thead><tbody>'+rows+'</tbody></table></div>';document.querySelector('#status').textContent=data.rows.length+' linha(s)';}
async function query(sql){document.querySelector('#status').textContent='Executando…';const res=await fetch('api/query',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({sql})});render(await res.json())}
document.querySelector('#run').onclick=()=>query(document.querySelector('#sql').value);
fetch('api/catalog').then(r=>r.json()).then(data=>{const root=document.querySelector('#catalog');root.innerHTML='';for(const [schema,tables] of Object.entries(data)){const h=document.createElement('strong');h.textContent=schema;root.append(h);for(const table of tables){const b=document.createElement('button');b.className='table';b.textContent=table;b.onclick=()=>{const q='select * from "'+schema.replaceAll('"','""')+'"."'+table.replaceAll('"','""')+'" limit 100';document.querySelector('#sql').value=q;query(q)};root.append(b)}}}).catch(e=>document.querySelector('#catalog').textContent=e);
</script></body></html>"""


def snapshot_database(source: Path, snapshot: Path) -> int:
    with duckdb.connect(str(source), read_only=True) as connection:
        table_count = connection.execute(
            "select count(*) from information_schema.tables where table_schema not in ('information_schema', 'pg_catalog')"
        ).fetchone()[0]
    snapshot.parent.mkdir(parents=True, exist_ok=True)
    snapshot.unlink(missing_ok=True)
    shutil.copy2(source, snapshot)
    with duckdb.connect(str(snapshot), read_only=True) as connection:
        connection.execute("select 1").fetchone()
    return table_count


def handler_for(database: Path):
    class Handler(BaseHTTPRequestHandler):
        def send_json(self, payload: object, status: HTTPStatus = HTTPStatus.OK) -> None:
            body = json.dumps(payload, ensure_ascii=False, default=str).encode()
            self.send_response(status)
            self.send_header("Content-Type", "application/json; charset=utf-8")
            self.send_header("Content-Length", str(len(body)))
            self.end_headers()
            self.wfile.write(body)

        def do_GET(self) -> None:  # noqa: N802
            path = urlparse(self.path).path.strip("/")
            if not path:
                body = HTML.encode()
                self.send_response(HTTPStatus.OK)
                self.send_header("Content-Type", "text/html; charset=utf-8")
                self.send_header("Content-Length", str(len(body)))
                self.end_headers()
                self.wfile.write(body)
                return
            if path == "api/catalog":
                with duckdb.connect(str(database), read_only=True) as connection:
                    rows = connection.execute(
                        """select table_schema, table_name from information_schema.tables
                           where table_schema not in ('information_schema', 'pg_catalog') order by 1, 2"""
                    ).fetchall()
                catalog: dict[str, list[str]] = {}
                for schema, table in rows:
                    catalog.setdefault(schema, []).append(table)
                self.send_json(catalog)
                return
            self.send_json({"error": "Recurso não encontrado."}, HTTPStatus.NOT_FOUND)

        def do_POST(self) -> None:  # noqa: N802
            if urlparse(self.path).path != "/api/query":
                self.send_json({"error": "Recurso não encontrado."}, HTTPStatus.NOT_FOUND)
                return
            try:
                length = min(int(self.headers.get("Content-Length", "0")), 100_000)
                sql = str(json.loads(self.rfile.read(length)).get("sql", "")).strip()
                allowed = ("select", "with", "show", "describe", "desc", "explain")
                if not sql.lower().startswith(allowed):
                    raise ValueError("Somente consultas de leitura são permitidas.")
                with duckdb.connect(str(database), read_only=True) as connection:
                    result = connection.execute(sql)
                    columns = [item[0] for item in result.description or []]
                    rows = result.fetchmany(200)
                self.send_json({"columns": columns, "rows": rows})
            except Exception as exc:
                self.send_json({"error": str(exc)}, HTTPStatus.BAD_REQUEST)

        def log_message(self, format: str, *args: object) -> None:
            return

    return Handler


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--source", type=Path, required=True)
    parser.add_argument("--snapshot", type=Path, required=True)
    parser.add_argument("--host", default="0.0.0.0")
    parser.add_argument("--port", type=int, default=4213)
    args = parser.parse_args()
    source, snapshot = args.source.resolve(), args.snapshot.resolve()
    if not source.is_file():
        raise SystemExit("Banco ainda não existe. Execute: python course.py checkpoint 01")
    if not 1024 <= args.port <= 65535:
        raise SystemExit("A porta deve estar entre 1024 e 65535.")
    try:
        table_count = snapshot_database(source, snapshot)
    except Exception as exc:
        raise SystemExit(f"Não foi possível preparar o snapshot: {exc}") from exc

    server = ThreadingHTTPServer((args.host, args.port), handler_for(snapshot))
    print(f"\nExplorador DuckDB pronto: {table_count} tabela(s).")
    print(f"Abra http://localhost:{args.port} ou a porta privada no Codespaces.")
    print("Interface autoral do curso; não é a DuckDB UI oficial.")
    print("O snapshot é somente leitura. Pressione Ctrl+C para encerrar.\n")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nEncerrando o explorador...")
    finally:
        server.server_close()
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
