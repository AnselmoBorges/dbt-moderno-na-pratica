#!/usr/bin/env python3
"""Aula bônus com bancos e projetos descartáveis para comparar dbt v1 e v2."""

from __future__ import annotations

import argparse
import json
import os
import platform
import re
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
LAB = ROOT / "lab/dabdbt"
LESSON = ROOT / "lab/bonus-v2"
WORK = ROOT / "build/bonus-v2"
VENV = WORK / ".venv"
REPORT = WORK / "resultado.json"
V2_VERSION = "2.0.11"
CORE_VERSION = "1.12.7"
CONTRACT_MODELS = {"model.dabdbt.order_metrics.v1", "model.dabdbt.order_metrics.v2"}
MULTI_STATEMENT_ERROR = "Cannot prepare multiple statements at once"


def tool(environment: Path, name: str) -> Path:
    return environment / ("Scripts" if os.name == "nt" else "bin") / (name + (".exe" if os.name == "nt" else ""))


def dbt_environment() -> dict[str, str]:
    return {
        **{key: value for key, value in os.environ.items()
           if not key.upper().startswith(("DBT_", "DATABRICKS_", "DUCKDB_", "ADBC_"))},
        "DBT_SEND_ANONYMOUS_USAGE_STATS": "false",
        "PYTHONUTF8": "1",
    }


def installed_version(binary: Path, expected: str, setup_command: str) -> None:
    if not binary.is_file():
        raise SystemExit(f"Prepare o ambiente primeiro: {setup_command}")
    version = subprocess.check_output([binary, "--version"], text=True, env=dbt_environment())
    if not re.search(rf"(?<![\d.]){re.escape(expected)}(?![\d.])", version):
        raise SystemExit(f"Versão esperada: {expected}. Execute: {setup_command}")


def setup() -> None:
    WORK.mkdir(parents=True, exist_ok=True)
    subprocess.run([sys.executable, "-m", "venv", VENV], check=True)
    subprocess.run([tool(VENV, "python"), "-m", "pip", "install", "-r", LESSON / "requirements.txt"], check=True)
    installed_version(tool(VENV, "dbt"), V2_VERSION, "python course.py bonus-v2 setup")
    print(f"dbt OSS {V2_VERSION} pronto no ambiente da aula bônus.")


def copy_project(destination: Path, version: str, database: Path) -> None:
    destination.mkdir()
    shutil.copytree(LAB / "src", destination / "src")
    for name in ("packages.yml", "package-lock.yml", "selectors.yml"):
        shutil.copy2(LAB / name, destination / name)
    config = (LAB / "dbt_project.yml").read_text(encoding="utf-8")
    if version == V2_VERSION:
        config, count = re.subn(r"(?m)^require-dbt-version:.*$", f'require-dbt-version: "={version}"', config)
        if count != 1:
            raise SystemExit("A restrição de versão esperada do projeto mudou.")
    (destination / "dbt_project.yml").write_text(config, encoding="utf-8")
    write_profile(destination, database)


def write_profile(project: Path, database: Path) -> None:
    profile = {"dabdbt": {"target": "local", "outputs": {"local": {
        "type": "duckdb", "schema": "main", "path": database.as_posix(), "threads": 2,
    }}}}
    (project / "profiles.yml").write_text(json.dumps(profile, indent=2), encoding="utf-8")


def run_dbt(binary: Path, project: Path, stage: str, *arguments: str, allowed_failure: bool = False) -> int:
    log = project.parent / f"{stage}.log"
    local = ["--profiles-dir", ".", "--target", "local"]
    print(f"[{stage}] dbt {' '.join(arguments)}", flush=True)
    with log.open("w", encoding="utf-8") as stream:
        result = subprocess.run([binary, *arguments, *local], cwd=project,
                                env=dbt_environment(), stdout=stream, stderr=subprocess.STDOUT)
    if result.returncode and not allowed_failure:
        print("\n".join(log.read_text(encoding="utf-8", errors="replace").splitlines()[-12:]))
        raise SystemExit(f"Etapa {stage} falhou. Consulte {log.relative_to(ROOT)}.")
    return result.returncode


def failed_models(project: Path) -> list[str]:
    file = project / "target/run_results.json"
    if not file.exists():
        return []
    nodes = json.loads(file.read_text(encoding="utf-8"))["results"]
    return sorted(node["unique_id"] for node in nodes
                  if node["status"] in {"error", "fail"} and node["unique_id"].startswith("model."))


def read_projection(database: Path) -> tuple[list, dict]:
    import duckdb

    with duckdb.connect(str(database), read_only=True) as connection:
        rows = connection.execute("""
            select order_id, order_status, cast(order_purchase_timestamp as date),
                   total_payment, delivery_days
            from g.order_fulfillment
            order by order_id
        """).fetchall()
        names = ("pedidos", "receita_bruta", "receita_entregue")
        values = connection.execute((LESSON / "receita.sql").read_text(encoding="utf-8")).fetchone()
    return rows, dict(zip(names, values, strict=True))


def compare() -> None:
    core = tool(LAB / ".venv", "dbt")
    candidate = tool(VENV, "dbt")
    installed_version(core, CORE_VERSION, "python course.py setup")
    installed_version(candidate, V2_VERSION, "python course.py bonus-v2 setup")
    trial = Path(tempfile.mkdtemp(prefix="comparacao-", dir=WORK))
    project_core = trial / "core"
    project_v2 = trial / "v2"
    database_core = trial / "core.duckdb"
    database_v2 = trial / "v2.duckdb"
    copy_project(project_core, CORE_VERSION, database_core)
    copy_project(project_v2, V2_VERSION, trial / "v2-original.duckdb")
    run_dbt(core, project_core, "01-core-deps", "deps")
    run_dbt(core, project_core, "02-core-seed", "seed")
    run_dbt(core, project_core, "02-core-build", "build")
    run_dbt(candidate, project_v2, "03-v2-deps", "deps")
    run_dbt(candidate, project_v2, "04-v2-parse", "parse", "--no-manage-state")
    run_dbt(candidate, project_v2, "05-v2-seed", "seed", "--no-manage-state")
    original = run_dbt(candidate, project_v2, "06-v2-original", "build", "--select",
                       "+order_fulfillment_g", "--indirect-selection", "cautious",
                       "--no-manage-state", allowed_failure=True)
    original_failed = failed_models(project_v2)
    original_log = (trial / "06-v2-original.log").read_text(encoding="utf-8", errors="replace")
    if original and (not original_failed or MULTI_STATEMENT_ERROR not in original_log):
        print("\n".join(original_log.splitlines()[-20:]))
        raise SystemExit(f"Resultado v2 original fora do cenário demonstrado. Consulte {trial.relative_to(ROOT)}.")
    shutil.copy2(project_v2 / "target/run_results.json", trial / "06-v2-run-results.json")

    config_file = project_v2 / "dbt_project.yml"
    config = config_file.read_text(encoding="utf-8")
    before = "+persist_docs: {relation: true, columns: true}"
    if config.count(before) != 1:
        raise SystemExit("A configuração persist_docs esperada não foi encontrada na cópia.")
    config_file.write_text(config.replace(before, "+persist_docs: {relation: false, columns: false}"), encoding="utf-8")
    write_profile(project_v2, database_v2)
    run_dbt(candidate, project_v2, "07-v2-isolado-seed", "seed", "--no-manage-state")
    code = run_dbt(candidate, project_v2, "07-v2-isolado", "build", "--no-manage-state", allowed_failure=True)
    failed = failed_models(project_v2)
    run_log = (trial / "07-v2-isolado.log").read_text(encoding="utf-8", errors="replace")
    observed_block = (code != 0 and CONTRACT_MODELS <= set(failed)
                      and MULTI_STATEMENT_ERROR in run_log)
    if code != 0 and not observed_block:
        print("\n".join(run_log.splitlines()[-20:]))
        raise SystemExit(f"Resultado v2 fora do cenário demonstrado. Consulte a saída em {trial.relative_to(ROOT)}.")

    core_rows, core_metrics = read_projection(database_core)
    v2_rows, v2_metrics = read_projection(database_v2)
    equal = core_rows == v2_rows and core_metrics == v2_metrics
    if not equal or core_metrics != {"pedidos": 8, "receita_bruta": 740, "receita_entregue": 630}:
        raise SystemExit(f"O recorte Gold divergiu. Consulte {trial.relative_to(ROOT)}.")

    shutil.copy2(project_v2 / "target/run_results.json", trial / "07-v2-run-results.json")
    run_dbt(candidate, project_v2, "08-v2-docs", "docs", "generate", "--no-compile", "--no-manage-state")
    report = {
        "sistema": platform.system(),
        "core": CORE_VERSION,
        "dbt_oss": V2_VERSION,
        "execucao": trial.name,
        "build_v2_original": {"codigo_saida": original, "modelos_com_erro": original_failed},
        "build_v2_isolado": {"codigo_saida": code, "modelos_com_erro": failed,
                              "erro_multiplas_instrucoes": observed_block},
        "recorte": {"relacao": "g.order_fulfillment", "linhas_iguais": equal,
                    "core": core_metrics, "v2": v2_metrics},
        "resultado_migracao": "bloqueada" if observed_block else "build_aprovado_aguarda_paridade_completa",
    }
    temporary_report = trial / "resultado.json"
    temporary_report.write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    # Publica apenas a última comparação concluída, no mesmo volume.
    temporary_report.replace(REPORT)
    print(REPORT.read_text(encoding="utf-8"), end="")


def docs(port: int) -> None:
    candidate = tool(VENV, "dbt")
    installed_version(candidate, V2_VERSION, "python course.py bonus-v2 setup")
    if not REPORT.is_file():
        raise SystemExit("Execute primeiro: python course.py bonus-v2 compare")
    run_name = json.loads(REPORT.read_text(encoding="utf-8"))["execucao"]
    if not re.fullmatch(r"comparacao-[a-z0-9_]+", run_name):
        raise SystemExit("Relatório inválido. Execute novamente a comparação.")
    target = WORK / run_name / "v2/target"
    in_codespaces = os.environ.get("CODESPACES") == "true"
    host = "0.0.0.0" if in_codespaces else "127.0.0.1"
    print(f"Abra a porta privada {port} no Codespaces." if in_codespaces else f"Abra http://localhost:{port}.",
          flush=True)
    subprocess.run([candidate, "docs", "serve", "--target-path", target, "--host", host,
                    "--port", str(port), "--no-open", "--no-manage-state"],
                   cwd=target.parent, env=dbt_environment(), check=True)


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("action", choices=["setup", "compare", "docs"])
    parser.add_argument("--port", type=int, default=8580)
    args = parser.parse_args()
    if not 1024 <= args.port <= 65535:
        parser.error("a porta deve estar entre 1024 e 65535")
    if args.action == "setup":
        setup()
    elif args.action == "compare":
        compare()
    else:
        docs(args.port)


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        raise SystemExit(130) from None
