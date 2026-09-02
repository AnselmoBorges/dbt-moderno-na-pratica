#!/usr/bin/env python3
"""Interface multiplataforma do curso dbt Moderno na Prática."""

from __future__ import annotations

import argparse
import json
import os
import platform
import shutil
import subprocess
import sys
import tempfile
from datetime import datetime, timezone
from pathlib import Path


ROOT = Path(__file__).resolve().parent
LAB = ROOT / "lab" / "dabdbt"
VENV = LAB / ".venv"
SUPPORTED_PYTHON = {(3, 12), (3, 13)}
EXPECTED_DBT_CORE = "1.12.3"
MIN_FREE_BYTES = 2 * 1024**3


def venv_tool(name: str) -> Path:
    scripts = VENV / ("Scripts" if os.name == "nt" else "bin")
    suffix = ".exe" if os.name == "nt" else ""
    return scripts / f"{name}{suffix}"


def run(command: list[str | Path], *, cwd: Path = ROOT, check: bool = True) -> subprocess.CompletedProcess[str]:
    printable = " ".join(str(part) for part in command)
    print(f"\n› {printable}")
    return subprocess.run(
        [str(part) for part in command], cwd=cwd, check=check, text=True
    )


def version_supported() -> bool:
    return sys.version_info[:2] in SUPPORTED_PYTHON


def doctor(*, quiet: bool = False) -> tuple[bool, list[dict[str, str | bool]]]:
    checks: list[dict[str, str | bool]] = []

    def add(name: str, ok: bool, detail: str) -> None:
        checks.append({"check": name, "ok": ok, "detail": detail})
        if not quiet:
            print(f"{'OK' if ok else 'ERRO':>4}  {name}: {detail}")

    python_version = f"{sys.version_info.major}.{sys.version_info.minor}.{sys.version_info.micro}"
    add(
        "Python",
        version_supported(),
        f"{python_version}; use 3.12 ou 3.13" if not version_supported() else python_version,
    )
    git = shutil.which("git")
    add("Git", bool(git), subprocess.getoutput("git --version") if git else "não encontrado no PATH")
    free = shutil.disk_usage(ROOT).free
    add("Espaço livre", free >= MIN_FREE_BYTES, f"{free / 1024**3:.1f} GB disponíveis; meta: 2 GB")

    try:
        with tempfile.NamedTemporaryFile(prefix="dbt-curso-", dir=ROOT, delete=True):
            pass
        writable = True
        detail = "diretório do curso permite escrita"
    except OSError as exc:
        writable = False
        detail = f"sem permissão de escrita ({exc.__class__.__name__})"
    add("Permissões", writable, detail)
    add("Arquivos do curso", (LAB / "dbt_project.yml").is_file(), "projeto dbt localizado")

    if venv_tool("python").exists():
        dbt_version = package_version("dbt-core")
        add(
            "dbt Core do curso",
            dbt_version == EXPECTED_DBT_CORE,
            f"{dbt_version}; esperado {EXPECTED_DBT_CORE}"
            if dbt_version != EXPECTED_DBT_CORE
            else dbt_version,
        )
    else:
        add("dbt Core do curso", True, f"{EXPECTED_DBT_CORE} será instalado pelo setup")

    if not quiet:
        print(f"\nSistema: {platform.system()} {platform.release()} ({platform.machine()})")
        print("Pronto para o setup." if all(bool(item["ok"]) for item in checks) else "Corrija os itens marcados como ERRO.")
    return all(bool(item["ok"]) for item in checks), checks


def require_supported_python() -> None:
    if not version_supported():
        raise SystemExit(
            "Este curso suporta Python 3.12 e 3.13. "
            f"Você está usando {sys.version_info.major}.{sys.version_info.minor}. "
            "Consulte docs/instalacao/README.md."
        )


def require_environment() -> Path:
    python = venv_tool("python")
    if not python.exists():
        raise SystemExit("Ambiente ainda não preparado. Execute primeiro: python course.py setup")
    return python


def environment_info(*, write_manifest: bool = True) -> dict[str, object]:
    """Resolve os caminhos reais usados pelo curso sem depender do PATH global."""
    python = require_environment()
    duckdb_location = subprocess.run(
        [str(python), "-c", "import pathlib, duckdb; print(pathlib.Path(duckdb.__file__).resolve())"],
        capture_output=True,
        text=True,
        check=True,
    ).stdout.strip()
    info: dict[str, object] = {
        "course_root": str(ROOT),
        "virtual_environment": str(VENV),
        "python": str(python),
        "dbt_core": {
            "executable": str(venv_tool("dbt")),
            "version": package_version("dbt-core"),
        },
        "duckdb": {
            "python_module": duckdb_location,
            "version": package_version("duckdb"),
            "database": str(ROOT / "lab" / "data" / "dabdbt.duckdb"),
        },
        "dbt_project": str(LAB / "dbt_project.yml"),
        "profiles_dir": str(LAB / "dbt_profiles"),
        "artifacts_dir": str(LAB / "target"),
    }
    if write_manifest:
        output = ROOT / "build" / "environment-info.json"
        output.parent.mkdir(parents=True, exist_ok=True)
        output.write_text(json.dumps(info, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    return info


def show_paths() -> None:
    print(json.dumps(environment_info(), ensure_ascii=False, indent=2))
    print("\nCaminhos atualizados em build/environment-info.json")
    print("Os comandos course.py usam esses executáveis diretamente; ativar a .venv é opcional.")


def setup() -> None:
    require_supported_python()
    ok, _ = doctor()
    if not ok:
        raise SystemExit("O diagnóstico encontrou bloqueios; corrija-os antes do setup.")
    (ROOT / "lab" / "data").mkdir(parents=True, exist_ok=True)
    if not venv_tool("python").exists():
        run([sys.executable, "-m", "venv", VENV])
    python = venv_tool("python")
    run([python, "-m", "pip", "install", "--disable-pip-version-check", "-r", "requirements-local.txt"], cwd=LAB)
    run([venv_tool("dbt"), "deps", "--profiles-dir", "dbt_profiles", "--target", "local"], cwd=LAB)
    run([venv_tool("dbt"), "debug", "--profiles-dir", "dbt_profiles", "--target", "local"], cwd=LAB)
    show_paths()
    print("\nAmbiente pronto. Próximo passo: python course.py checkpoint 01")


def checkpoint(number: str) -> None:
    python = require_environment()
    run([python, "scripts/run_checkpoint.py", number], cwd=LAB)


def data_ui(port: int) -> None:
    python = require_environment()
    try:
        run(
            [
                python,
                ROOT / "scripts" / "start_data_explorer.py",
                "--source",
                ROOT / "lab" / "data" / "dabdbt.duckdb",
                "--snapshot",
                ROOT / "build" / "data-explorer" / "course-snapshot.duckdb",
                "--port",
                str(port),
            ]
        )
    except KeyboardInterrupt:
        pass


def validate() -> None:
    python = require_environment()
    run([sys.executable, "scripts/verify_editorial.py"], cwd=ROOT)
    run([python, ROOT / "scripts" / "test_data_explorer.py"], cwd=ROOT)
    run([python, "scripts/validate_all.py"], cwd=LAB)


def package_version(package: str) -> str:
    python = venv_tool("python")
    if not python.exists():
        return "não instalado"
    code = (
        "from importlib.metadata import PackageNotFoundError, version; "
        f"print(version({package!r}))"
    )
    result = subprocess.run([str(python), "-c", code], capture_output=True, text=True, check=False)
    return result.stdout.strip() if result.returncode == 0 else "não instalado"


def support_report() -> Path:
    _, checks = doctor(quiet=True)
    report = {
        "generated_at_utc": datetime.now(timezone.utc).isoformat(),
        "course": "dbt-moderno-na-pratica",
        "system": {"name": platform.system(), "release": platform.release(), "machine": platform.machine()},
        "python": platform.python_version(),
        "checks": checks,
        "tools": {
            "dbt_core": package_version("dbt-core"),
            "dbt_duckdb": package_version("dbt-duckdb"),
            "duckdb_engine": package_version("duckdb"),
            "metricflow_engine": package_version("metricflow"),
            "dbt_metricflow_cli": package_version("dbt-metricflow"),
            "dbt_mcp": package_version("dbt-mcp"),
        },
    }
    output = ROOT / "build" / "support-report.json"
    output.parent.mkdir(parents=True, exist_ok=True)
    output.write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(json.dumps(report, ensure_ascii=False, indent=2))
    print(f"\nRelatório sanitizado salvo em: {output.relative_to(ROOT)}")
    return output


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    subparsers = parser.add_subparsers(dest="command", required=True)
    subparsers.add_parser("doctor", help="verifica os pré-requisitos sem alterar o ambiente")
    subparsers.add_parser("setup", help="prepara o laboratório local")
    checkpoint_parser = subparsers.add_parser("checkpoint", help="executa um checkpoint de 01 a 12")
    checkpoint_parser.add_argument("number")
    data_ui_parser = subparsers.add_parser("data-ui", help="abre a interface gráfica opcional do DuckDB")
    data_ui_parser.add_argument("--port", type=int, default=4213)
    subparsers.add_parser("paths", help="mostra os caminhos reais do dbt, DuckDB e arquivos do curso")
    subparsers.add_parser("validate", help="executa toda a validação editorial e técnica")
    subparsers.add_parser("support-report", help="gera diagnóstico sanitizado para pedir ajuda")
    args = parser.parse_args()

    if args.command == "doctor":
        ok, _ = doctor()
        return 0 if ok else 1
    if args.command == "setup":
        setup()
    elif args.command == "checkpoint":
        checkpoint(args.number.zfill(2))
    elif args.command == "data-ui":
        data_ui(args.port)
    elif args.command == "paths":
        show_paths()
    elif args.command == "validate":
        validate()
    elif args.command == "support-report":
        support_report()
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
