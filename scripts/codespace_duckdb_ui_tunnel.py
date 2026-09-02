#!/usr/bin/env python3
"""Abre, no computador local, um túnel para a DuckDB UI em um Codespace."""

from __future__ import annotations

import argparse
import os
import shutil
import socket
import subprocess
import time
import webbrowser


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--codespace", help="nome do Codespace; se omitido, o GitHub CLI permite escolher")
    parser.add_argument("--port", type=int, default=4213)
    args = parser.parse_args()

    if os.environ.get("CODESPACES") == "true":
        raise SystemExit(
            "Execute este comando no seu computador, fora do Codespaces. "
            "Dentro do Codespaces use: python course.py official-data-ui"
        )
    if not shutil.which("gh"):
        raise SystemExit(
            "GitHub CLI não encontrado. Instale em https://cli.github.com/ e execute: gh auth login"
        )

    command = ["gh", "codespace", "ports", "forward", f"{args.port}:{args.port}"]
    if args.codespace:
        command.extend(["--codespace", args.codespace])

    print("Antes de continuar, deixe a UI rodando no Codespaces com:")
    print("  python course.py official-data-ui")
    print(f"\nAbrindo túnel local em http://localhost:{args.port}")
    print("Se surgir erro 403, execute: gh auth refresh -h github.com -s codespace")
    print("Use Ctrl+C para encerrar.\n")

    process = subprocess.Popen(command)
    try:
        deadline = time.monotonic() + 20
        while time.monotonic() < deadline and process.poll() is None:
            try:
                with socket.create_connection(("127.0.0.1", args.port), timeout=0.5):
                    webbrowser.open(f"http://localhost:{args.port}")
                    break
            except OSError:
                time.sleep(0.5)
        return process.wait()
    except KeyboardInterrupt:
        process.terminate()
        process.wait(timeout=5)
        return 0


if __name__ == "__main__":
    raise SystemExit(main())
