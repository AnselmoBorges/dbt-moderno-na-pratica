#!/usr/bin/env python3
"""Add useful alternative text to every picture in the published PPTX files."""

from __future__ import annotations

import html
import os
import posixpath
import re
import tempfile
import zipfile
from pathlib import Path
from xml.etree import ElementTree


ROOT = Path(__file__).resolve().parents[2]
DECKS = Path(os.environ.get("PPTX_DIR", ROOT / "assets/decks")).resolve()
BRAND_ALT = "Logotipo oficial da Rescue Point."


def visible_text(xml: str) -> list[str]:
    return [html.unescape(value).strip() for value in re.findall(r"<a:t>(.*?)</a:t>", xml) if value.strip()]


def slide_alt(deck_stem: str, slide_number: int, xml: str) -> str:
    text = visible_text(xml)
    heading = " — ".join(text[:2]) if text else deck_stem.replace("-", " ")
    if slide_number == 1:
        return f"Ilustração conceitual autoral da capa: {heading}."
    if slide_number == 2:
        return f"Diagrama didático autoral que apresenta: {heading}."
    return f"Imagem didática usada para explicar: {heading}."


def patch_slide(xml: str, alt: str, brand_relationships: set[str]) -> str:
    def add_description(match: re.Match[str]) -> str:
        block = match.group(0)
        if re.search(r"\bdescr=", block):
            return block
        image_ref = re.search(r'<a:blip\b[^>]*\br:embed="([^"]+)"', block)
        description = BRAND_ALT if image_ref and image_ref[1] in brand_relationships else alt
        escaped = html.escape(description, quote=True)
        return re.sub(r"<p:cNvPr\b", lambda _: f'<p:cNvPr descr="{escaped}"', block, count=1)

    return re.sub(r"<p:pic>.*?</p:pic>", add_description, xml, flags=re.DOTALL)


def patch_deck(path: Path) -> int:
    changed = 0
    brand = (ROOT / "assets/brand/rescue-point-logo.png").read_bytes()
    with zipfile.ZipFile(path, "r") as source, tempfile.NamedTemporaryFile(
        suffix=".pptx", dir=path.parent, delete=False
    ) as temporary:
        temporary_path = Path(temporary.name)
        brand_media = {name for name in source.namelist() if name.startswith("ppt/media/") and source.read(name) == brand}
        with zipfile.ZipFile(temporary, "w", compression=zipfile.ZIP_DEFLATED) as target:
            for item in source.infolist():
                payload = source.read(item.filename)
                match = re.fullmatch(r"ppt/slides/slide(\d+)\.xml", item.filename)
                if match and b"<p:pic>" in payload:
                    xml = payload.decode("utf-8")
                    alt = slide_alt(path.stem, int(match.group(1)), xml)
                    rels_path = f"ppt/slides/_rels/slide{match.group(1)}.xml.rels"
                    relationships = ElementTree.fromstring(source.read(rels_path))
                    brand_relationships = {
                        rel.attrib["Id"] for rel in relationships
                        if posixpath.normpath(posixpath.join("/ppt/slides", rel.attrib["Target"])).lstrip("/") in brand_media
                    }
                    updated = patch_slide(xml, alt, brand_relationships)
                    if updated != xml:
                        changed += updated.count(" descr=") - xml.count(" descr=")
                    payload = updated.encode("utf-8")
                target.writestr(item, payload)
    if changed:
        temporary_path.replace(path)
    else:
        temporary_path.unlink()
    return changed


def main() -> None:
    total = 0
    for path in sorted(DECKS.glob("*.pptx")):
        if path.name.startswith("~$"):
            continue
        added = patch_deck(path)
        total += added
        print(f"{path.name}: {added} descrições adicionadas")
    print(f"Textos alternativos adicionados: {total}")


if __name__ == "__main__":
    main()
