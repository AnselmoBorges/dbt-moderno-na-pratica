#!/usr/bin/env python3
"""Add useful alternative text to every picture in the published PPTX files."""

from __future__ import annotations

import html
import re
import tempfile
import zipfile
from pathlib import Path


ROOT = Path(__file__).resolve().parents[2]
DECKS = ROOT / "assets/decks"


def visible_text(xml: str) -> list[str]:
    return [html.unescape(value).strip() for value in re.findall(r"<a:t>(.*?)</a:t>", xml) if value.strip()]


def slide_alt(deck_stem: str, slide_number: int, xml: str) -> str:
    text = visible_text(xml)
    heading = " — ".join(text[:2]) if text else deck_stem.replace("-", " ")
    if slide_number == 1:
        return f"Ilustração conceitual autoral da capa: {heading}."
    if slide_number == 2:
        return f"Diagrama didático autoral que apresenta: {heading}."
    return f"Figura oficial da documentação dbt usada para explicar: {heading}."


def patch_slide(xml: str, alt: str) -> str:
    escaped = html.escape(alt, quote=True)

    def add_description(match: re.Match[str]) -> str:
        block = match.group(0)
        if re.search(r"\bdescr=", block):
            return block
        return re.sub(r"<p:cNvPr\b([^>]*?)(\s*/>)", rf'<p:cNvPr\1 descr="{escaped}"\2', block, count=1)

    return re.sub(r"<p:pic>.*?</p:pic>", add_description, xml, flags=re.DOTALL)


def patch_deck(path: Path) -> int:
    changed = 0
    with zipfile.ZipFile(path, "r") as source, tempfile.NamedTemporaryFile(
        suffix=".pptx", dir=path.parent, delete=False
    ) as temporary:
        temporary_path = Path(temporary.name)
        with zipfile.ZipFile(temporary, "w", compression=zipfile.ZIP_DEFLATED) as target:
            for item in source.infolist():
                payload = source.read(item.filename)
                match = re.fullmatch(r"ppt/slides/slide(\d+)\.xml", item.filename)
                if match and b"<p:pic>" in payload:
                    xml = payload.decode("utf-8")
                    alt = slide_alt(path.stem, int(match.group(1)), xml)
                    updated = patch_slide(xml, alt)
                    if updated != xml:
                        changed += updated.count(" descr=") - xml.count(" descr=")
                    payload = updated.encode("utf-8")
                target.writestr(item, payload)
    temporary_path.replace(path)
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
