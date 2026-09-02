#!/usr/bin/env python3
"""Inicia a DuckDB UI sobre uma cópia segura do banco didático."""

from __future__ import annotations

import argparse
import shutil
import sys
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
    
    # Validar banco de dados original
    try:
        test_conn = duckdb.connect(str(source), read_only=True)
        table_count = test_conn.execute("SELECT COUNT(*) FROM information_schema.tables").fetchall()[0][0]
        test_conn.close()
        print(f"✓ Banco original validado: {table_count} tabelas encontradas")
    except Exception as e:
        raise SystemExit(f"✗ Erro ao validar banco original: {e}")
    
    # Copiar com retry
    try:
        if snapshot.exists():
            snapshot.unlink()
        shutil.copy2(source, snapshot)
        print(f"✓ Snapshot criado: {snapshot}")
    except Exception as e:
        raise SystemExit(f"✗ Erro ao criar snapshot: {e}")

    # Conectar e validar cópia
    try:
        connection = duckdb.connect(str(snapshot))
        
        # Validar integridade do snapshot
        table_count = connection.execute("SELECT COUNT(*) FROM information_schema.tables").fetchall()[0][0]
        print(f"✓ Snapshot validado: {table_count} tabelas")
        
        # Configurar UI com otimizações
        connection.execute(f"SET ui_local_port = {args.port}")
        connection.execute("SET max_memory = '1GB'")
        connection.execute("SET threads = 4")
        print(f"✓ Configurações otimizadas para UI")
        
        # Instalar e carregar UI
        try:
            connection.execute("INSTALL ui")
            connection.execute("LOAD ui")
            print("✓ Extensão UI instalada e carregada")
        except Exception as e:
            print(f"✗ Aviso ao carregar UI: {e}", file=sys.stderr)
            print("  Continuando mesmo assim...", file=sys.stderr)
        
        # Iniciar servidor UI
        try:
            connection.execute("CALL start_ui_server()")
            print("✓ Servidor UI iniciado")
        except Exception as e:
            print(f"✗ Aviso ao iniciar servidor: {e}", file=sys.stderr)
            
    except Exception as e:
        connection.close()
        raise SystemExit(f"✗ Erro ao configurar DuckDB UI: {e}")

    print("\n" + "="*60)
    print("DuckDB UI pronta.")
    print(f"Abra http://localhost:{args.port} ou a guia Ports do Codespaces.")
    print("A interface usa uma cópia do banco; alterações não afetam o laboratório.")
    print("Mantenha este terminal aberto. Pressione Ctrl+C para encerrar.")
    print("="*60 + "\n")

    try:
        while True:
            time.sleep(3600)
    except KeyboardInterrupt:
        print("\nEncerrando DuckDB UI...")
    finally:
        try:
            connection.execute("CALL stop_ui_server()")
        except Exception:
            pass
        connection.close()
    return 0


if __name__ == "__main__":
    raise SystemExit(main())


if __name__ == "__main__":
    raise SystemExit(main())
