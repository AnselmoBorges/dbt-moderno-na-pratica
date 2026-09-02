#!/usr/bin/env python3
"""Validate the dossier, evidence matrix and episode/editorial contracts."""

from __future__ import annotations

import csv
import hashlib
import json
import re
import zipfile
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
    *ROOT.glob("*.md"), *ROOT.glob("docs/**/*.md"), *ROOT.glob("pesquisa/*.md"), *ROOT.glob("roteiros/*.md"),
    *ROOT.glob("lab/dabdbt/*.md"), *ROOT.glob("lab/dabdbt/checkpoints/*.md"),
]
for path in markdown_files:
    for raw_target in re.findall(r"\]\(([^)]+)\)", path.read_text(encoding="utf-8")):
        target = raw_target.split("#", 1)[0]
        if not target or "://" in target or target.startswith("mailto:"):
            continue
        if not (path.parent / target).resolve().exists():
            raise SystemExit(f"Link local quebrado em {path}: {raw_target}")

course_markdown = [*ROOT.glob("docs/**/*.md"), *ROOT.glob("pesquisa/*.md"), *ROOT.glob("roteiros/*.md")]
for path in course_markdown:
    if "## Material complementar" not in path.read_text(encoding="utf-8"):
        raise SystemExit(f"{path.relative_to(ROOT)} não contém Material complementar.")

for path in markdown_files:
    for alt, target in re.findall(r"!\[([^]]*)\]\(([^)]+)\)", path.read_text(encoding="utf-8")):
        if not alt.strip():
            raise SystemExit(f"Imagem sem texto alternativo em {path.relative_to(ROOT)}: {target}")

catalog = ROOT / "assets/catalog.yml"
catalog_text = catalog.read_text(encoding="utf-8")
entries = re.split(r"\n  - id: ", catalog_text)[1:]
if len(entries) != 39:
    raise SystemExit(f"Catálogo visual deveria conter 39 ativos; contém {len(entries)}.")
for entry in entries:
    asset_id = entry.splitlines()[0].strip()
    fields = {}
    for line in entry.splitlines()[1:]:
        match = re.match(r"    ([a-z0-9_]+):\s*(.+)", line)
        if match:
            fields[match.group(1)] = match.group(2).strip()
    required_asset_fields = {"path", "kind", "origin", "author", "license", "source_url", "episodes", "alt", "reviewed"}
    if not required_asset_fields.issubset(fields):
        raise SystemExit(f"Ativo {asset_id} sem campos: {sorted(required_asset_fields - set(fields))}")
    if fields["reviewed"] != "true" or len(fields["alt"]) < 20:
        raise SystemExit(f"Ativo {asset_id} sem revisão ou texto alternativo útil.")
    if not (ROOT / fields["path"]).is_file():
        raise SystemExit(f"Ativo {asset_id} aponta para arquivo inexistente: {fields['path']}")
    asset_path = ROOT / fields["path"]
    if fields["kind"] == "conceptual_diagram":
        diagram_fields = {"rendered_svg", "rendered_png"}
        if not diagram_fields.issubset(fields):
            raise SystemExit(f"Diagrama {asset_id} sem campos: {sorted(diagram_fields - set(fields))}")
        for rendered_key in diagram_fields:
            rendered = ROOT / fields[rendered_key]
            if not rendered.is_file() or rendered.stat().st_size < 500:
                raise SystemExit(f"Ativo {asset_id} sem render válido: {fields[rendered_key]}")
        if "<svg" not in (ROOT / fields["rendered_svg"]).read_text(encoding="utf-8"):
            raise SystemExit(f"Ativo {asset_id} possui SVG inválido.")
    elif fields["kind"] == "official_image":
        official_fields = {"source_commit", "sha256"}
        if not official_fields.issubset(fields):
            raise SystemExit(f"Imagem oficial {asset_id} sem campos: {sorted(official_fields - set(fields))}")
        if fields["source_commit"] != "8249c7c904848efa786831381ca1d53b4157e392":
            raise SystemExit(f"Imagem oficial {asset_id} não está fixada no commit editorial.")
        if hashlib.sha256(asset_path.read_bytes()).hexdigest() != fields["sha256"]:
            raise SystemExit(f"Hash divergente no ativo oficial {asset_id}.")
    elif fields["kind"] == "ai_assisted_illustration":
        ai_fields = {"project_id", "page_id", "image_version", "model", "sha256"}
        if not ai_fields.issubset(fields):
            raise SystemExit(f"Ilustração assistida {asset_id} sem campos: {sorted(ai_fields - set(fields))}")
        if hashlib.sha256(asset_path.read_bytes()).hexdigest() != fields["sha256"]:
            raise SystemExit(f"Hash divergente na ilustração assistida {asset_id}.")
    elif fields["kind"] == "product_screenshot":
        screenshot_fields = {"product", "captured_at", "sha256"}
        if not screenshot_fields.issubset(fields):
            raise SystemExit(f"Screenshot {asset_id} sem campos: {sorted(screenshot_fields - set(fields))}")
        if hashlib.sha256(asset_path.read_bytes()).hexdigest() != fields["sha256"]:
            raise SystemExit(f"Hash divergente no screenshot {asset_id}.")
    else:
        raise SystemExit(f"Tipo visual não reconhecido em {asset_id}: {fields['kind']}")

deck_specs = {
    "aula-00-ambiente": 22,
    "episodio-01-baseline-core-1-12": 18,
    "episodio-02-gold-nao-e-semantica": 20,
    "episodio-03-metricflow-local": 22,
    "episodio-04-semantica-aberta-interoperavel": 20,
    "episodio-05-contratos-versoes": 20,
    "episodio-06-piramide-qualidade": 21,
    "episodio-07-governanca-como-codigo": 20,
    "episodio-08-data-products-open": 18,
    "episodio-09-ci-state-defer": 20,
    "episodio-10-finops-pipeline": 22,
    "episodio-11-dbt-mcp": 20,
    "episodio-12-gold-governada-agente-solto": 22,
}
total_slides = 0
for stem, expected_slides in deck_specs.items():
    pptx = ROOT / "assets/decks" / f"{stem}.pptx"
    pdf = ROOT / "assets/decks" / f"{stem}.pdf"
    if not pptx.is_file() or not pdf.is_file():
        raise SystemExit(f"Apresentação piloto ausente: {stem}")
    with zipfile.ZipFile(pptx) as archive:
        slides = [name for name in archive.namelist() if re.fullmatch(r"ppt/slides/slide\d+\.xml", name)]
        notes = [name for name in archive.namelist() if re.fullmatch(r"ppt/notesSlides/notesSlide\d+\.xml", name)]
        note_xml = [archive.read(name).decode("utf-8", errors="ignore") for name in notes]
        slide_xml = [archive.read(name).decode("utf-8", errors="ignore") for name in slides]
    if len(slides) != expected_slides or len(notes) != expected_slides:
        raise SystemExit(f"Deck {stem} sem slides/notas esperados: slides={len(slides)}, notes={len(notes)}")
    if any("[Sources]" not in xml for xml in note_xml):
        raise SystemExit(f"Deck {stem} possui slide sem bloco [Sources] nas notas.")
    required_note_sections = ("[Roteiro recomendado]", "Fala sugerida:", "O que destacar:", "Transição:")
    for index, xml in enumerate(note_xml, start=1):
        missing_sections = [section for section in required_note_sections if section not in xml]
        if missing_sections:
            raise SystemExit(f"Deck {stem}, slide {index}, sem roteiro completo: {missing_sections}")
        if not re.search(r"\[Tempo sugerido: \d{2}:\d{2}\]", xml):
            raise SystemExit(f"Deck {stem}, slide {index}, sem tempo sugerido.")
        if len(xml) < 750:
            raise SystemExit(f"Deck {stem}, slide {index}, possui notas curtas demais para roteiro recomendado.")
    for index, xml in enumerate(slide_xml, start=1):
        pictures = re.findall(r"<p:pic>.*?</p:pic>", xml, flags=re.DOTALL)
        if any(not re.search(r"<p:cNvPr\b[^>]*\bdescr=\"[^\"]{20,}\"", picture) for picture in pictures):
            raise SystemExit(f"Deck {stem}, slide {index}, possui imagem sem texto alternativo útil.")
    total_slides += len(slides)
    if not pdf.read_bytes().startswith(b"%PDF"):
        raise SystemExit(f"PDF inválido: {pdf.relative_to(ROOT)}")
    pdf_counts = [int(value) for value in re.findall(rb"/Count\s+(\d+)", pdf.read_bytes())]
    if not pdf_counts or max(pdf_counts) != expected_slides:
        raise SystemExit(f"PDF {stem} não possui {expected_slides} páginas: {pdf_counts}")
    if pptx.stat().st_size > 15 * 1024 * 1024 or pdf.stat().st_size > 10 * 1024 * 1024:
        raise SystemExit(f"Deck {stem} ultrapassa o limite de tamanho editorial.")

if total_slides != 265:
    raise SystemExit(f"Temporada deveria conter 265 slides; contém {total_slides}.")
if list((ROOT / "assets/decks").glob("*-banana.pptx")) or list((ROOT / "assets/decks").glob("*-banana.pdf")):
    raise SystemExit("Há variantes -banana concorrendo com os arquivos canônicos.")

provenance = (ROOT / "assets/decks/provenance.yml").read_text(encoding="utf-8")
manifest = (ROOT / "assets/decks/manifest.yml").read_text(encoding="utf-8")
for stem, slides in deck_specs.items():
    if f"id: {stem}" not in provenance:
        raise SystemExit(f"Deck sem procedência registrada: {stem}")
    if not re.search(rf"id: {re.escape(stem)}[^\n]*slides: {slides}", manifest):
        raise SystemExit(f"Deck ausente ou com contagem errada no manifesto: {stem}")

legacy_commands = []
for path in ROOT.glob("roteiros/*.md"):
    text = path.read_text(encoding="utf-8")
    if "source .venv/bin/activate" in text or "python scripts/run_checkpoint.py" in text:
        legacy_commands.append(path.name)
if legacy_commands:
    raise SystemExit(f"Roteiros ainda usam comandos não portáveis: {legacy_commands}")

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

print(f"Editorial OK: {len(rows)} evidências, 6 vídeos, 16 roteiros, 39 ativos, 13 decks, 265 slides e sanitização válidos.")
