#!/usr/bin/env python3
"""Verify the machine-readable artifacts required by CI and agent consumers."""

from __future__ import annotations

import json
from pathlib import Path

target = Path("target")
required = ["manifest.json", "semantic_manifest.json", "osi_document.json", "run_results.json", "catalog.json"]
missing = [name for name in required if not (target / name).is_file()]
if missing:
    raise SystemExit(f"Artifacts ausentes: {missing}")

manifest = json.loads((target / "manifest.json").read_text())
run_results = json.loads((target / "run_results.json").read_text())
if not manifest.get("nodes") or not manifest.get("metrics") or not manifest.get("exposures"):
    raise SystemExit("Manifest incompleto: nodes, metrics ou exposures ausentes.")
bad = [item["unique_id"] for item in run_results["results"] if item["status"] in {"error", "fail"}]
if bad:
    raise SystemExit(f"Run results contém falhas: {bad}")

osi = json.loads((target / "osi_document.json").read_text())
if not osi:
    raise SystemExit("osi_document.json está vazio.")

print("Artifacts OK: manifest, semantic_manifest, osi_document, run_results e catalog válidos.")
