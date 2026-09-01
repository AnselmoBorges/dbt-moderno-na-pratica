"""Resolve ferramentas do laboratório de forma portável."""

from __future__ import annotations

import os
import shutil
import sys
from pathlib import Path


PROJECT = Path(__file__).resolve().parents[1]


def tool(name: str, env_name: str | None = None) -> Path:
    override = os.environ.get(env_name) if env_name else None
    if override:
        return Path(override)

    suffix = ".exe" if os.name == "nt" else ""
    candidates = [
        Path(sys.executable).parent / f"{name}{suffix}",
        PROJECT / ".venv" / ("Scripts" if os.name == "nt" else "bin") / f"{name}{suffix}",
    ]
    for candidate in candidates:
        if candidate.exists():
            return candidate
    found = shutil.which(name)
    return Path(found) if found else Path(name)


def python() -> Path:
    return Path(os.environ.get("PYTHON_BIN") or sys.executable)


def environment() -> dict[str, str]:
    bin_dir = str(Path(sys.executable).parent)
    return {
        **os.environ,
        "DBT_PROFILES_DIR": str(PROJECT / "dbt_profiles"),
        "PATH": os.pathsep.join([bin_dir, os.environ.get("PATH", "")]),
    }
