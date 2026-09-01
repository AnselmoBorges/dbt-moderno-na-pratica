#!/usr/bin/env python3
"""Validate the dossier, evidence matrix and episode/editorial contracts."""

from __future__ import annotations

import csv
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
EVIDENCE = ROOT / "pesquisa/matriz-evidencias.csv"
PLAYLIST_AUDIT = ROOT / "pesquisa/auditoria-playlist.md"
SCRIPTS = ROOT / "roteiros"

required_columns = {
    "id", "tema", "claim_sustentado", "url_ou_referencia", "data_consulta",
    "tipo_fonte", "escopo", "versao", "status_maturidade", "disponibilidade",
    "licenca", "custo", "episodios", "ressalva",
}

with EVIDENCE.open(newline="", encoding="utf-8") as handle:
    reader = csv.DictReader(handle)
    if set(reader.fieldnames or []) != required_columns:
        raise SystemExit(f"Colunas da matriz inválidas: {reader.fieldnames}")
    rows = list(reader)

ids = [row["id"] for row in rows]
if len(ids) != len(set(ids)):
    raise SystemExit("IDs duplicados na matriz de evidências.")
for row in rows:
    missing = [name for name in required_columns if not row[name].strip()]
    if missing:
        raise SystemExit(f"Evidência {row['id']} sem campos: {missing}")
    if not re.match(r"^(https://|internal://|lab://)", row["url_ou_referencia"]):
        raise SystemExit(f"Referência inválida em {row['id']}: {row['url_ou_referencia']}")
    if row["id"].startswith("C") and "Resultado reportado" not in row["ressalva"]:
        raise SystemExit(f"Case {row['id']} não está rotulado como resultado reportado.")

audit = PLAYLIST_AUDIT.read_text(encoding="utf-8")
video_ids = {"ZAgoqhlR95g", "4TqyFTXbzIc", "8AnaWYgeCuA", "W8sZcY3FbhE", "CujFYRjXRXE", "NTZc7D4Zlok"}
if not video_ids.issubset(set(re.findall(r"watch\?v=([A-Za-z0-9_-]+)", audit))):
    raise SystemExit("A auditoria não contém os seis vídeos.")
if len(re.findall(r"\b\d{2}:\d{2}(?:–\d{2}:\d{2})?", audit)) < 12:
    raise SystemExit("A auditoria da playlist não contém timestamps suficientes.")

episode_files = sorted(SCRIPTS.glob("[0-9][0-9]-*.md"))
if len(episode_files) != 16:
    raise SystemExit(f"Esperados 16 roteiros; encontrados {len(episode_files)}.")

common_headings = ["## Gancho", "## Objetivo e pré-requisitos", "## Roteiro falado", "## Radar", "## CTA", "## Fontes"]
for path in episode_files:
    text = path.read_text(encoding="utf-8")
    for heading in common_headings:
        if heading not in text:
            raise SystemExit(f"{path.name} não contém {heading}.")
    number = int(path.name[:2])
    if number <= 12 and "Checkpoint executável" not in text:
        raise SystemExit(f"{path.name} não aponta para checkpoint executável.")
    if number >= 13 and ("Rota A" not in text or "Rota B" not in text):
        raise SystemExit(f"{path.name} precisa de rotas com acesso e fallback.")
    if "pip install --pre" in text or "requirements-fusion" in text:
        raise SystemExit(f"{path.name} tenta executar software preview.")

markdown_files = [
    *ROOT.glob("*.md"), *ROOT.glob("pesquisa/*.md"), *ROOT.glob("roteiros/*.md"),
    *ROOT.glob("lab/dabdbt/*.md"), *ROOT.glob("lab/dabdbt/checkpoints/*.md"),
]
for path in markdown_files:
    for raw_target in re.findall(r"\]\(([^)]+)\)", path.read_text(encoding="utf-8")):
        target = raw_target.split("#", 1)[0]
        if not target or "://" in target or target.startswith("mailto:"):
            continue
        if not (path.parent / target).resolve().exists():
            raise SystemExit(f"Link local quebrado em {path}: {raw_target}")

lab_root = ROOT / "lab/dabdbt"
ignored_parts = {".venv", "target", "logs", "dbt_packages", "__pycache__"}
sensitive_patterns = [
    re.compile(r"@[A-Za-z0-9.-]+\.(?:com|com\.br|net|org)", re.I),
    re.compile(r"adb-\d+", re.I),
    re.compile(r"\b[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\b", re.I),
]
for path in lab_root.rglob("*"):
    if not path.is_file() or ignored_parts.intersection(path.parts):
        continue
    if path.name == ".user.yml":  # runtime-generated and explicitly gitignored
        continue
    try:
        content = path.read_text(encoding="utf-8")
    except UnicodeDecodeError:
        continue
    if any(pattern.search(content) for pattern in sensitive_patterns):
        raise SystemExit(f"Possível identificador sensível no laboratório: {path}")

print(f"Editorial OK: {len(rows)} evidências, 6 vídeos, 16 roteiros, links e sanitização válidos.")
