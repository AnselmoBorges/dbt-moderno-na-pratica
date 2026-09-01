#!/usr/bin/env python3
"""Valida links locais e, opcionalmente, URLs externas dos materiais."""

from __future__ import annotations

import argparse
import csv
import re
import time
import urllib.error
import urllib.request
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
MARKDOWN = [path for path in ROOT.rglob("*.md") if not {".venv", "dbt_packages", "target", "build"}.intersection(path.parts)]
LINK_RE = re.compile(r"!?(?:\[[^]]*\])\(([^)]+)\)")
GENERATED_URL_SUFFIXES = ("/badge.svg",)


def external_status(url: str) -> tuple[str, bool, str]:
    request = urllib.request.Request(url, headers={"User-Agent": "dbt-moderno-na-pratica-link-check/1.0"})
    for attempt in range(2):
        try:
            with urllib.request.urlopen(request, timeout=20) as response:
                return url, 200 <= response.status < 400, str(response.status)
        except urllib.error.HTTPError as exc:
            if exc.code in {401, 403, 405, 429}:
                return url, True, f"{exc.code} (servidor restringe automação)"
            if attempt == 1:
                return url, False, str(exc.code)
        except (urllib.error.URLError, TimeoutError) as exc:
            if attempt == 1:
                return url, False, exc.__class__.__name__
        time.sleep(1)
    return url, False, "erro desconhecido"


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--external", action="store_true")
    args = parser.parse_args()
    external: set[str] = set()
    failures: list[str] = []

    for path in MARKDOWN:
        for raw in LINK_RE.findall(path.read_text(encoding="utf-8")):
            target = raw.strip().split("#", 1)[0]
            if not target or target.startswith(("mailto:", "internal:", "lab:")):
                continue
            if target.startswith(("https://", "http://")):
                if target.endswith(GENERATED_URL_SUFFIXES):
                    # Badges are generated only after the workflow exists on GitHub.
                    continue
                external.add(target)
                continue
            if not (path.parent / target).resolve().exists():
                failures.append(f"Link local quebrado em {path.relative_to(ROOT)}: {raw}")

    with (ROOT / "pesquisa" / "matriz-evidencias.csv").open(newline="", encoding="utf-8") as handle:
        for row in csv.DictReader(handle):
            url = row["url_ou_referencia"]
            if url.startswith(("https://", "http://")):
                external.add(url)

    if args.external:
        with ThreadPoolExecutor(max_workers=8) as pool:
            futures = [pool.submit(external_status, url) for url in sorted(external)]
            for future in as_completed(futures):
                url, ok, detail = future.result()
                if not ok:
                    failures.append(f"Link externo indisponível ({detail}): {url}")

    if failures:
        raise SystemExit("\n".join(failures))
    scope = f"{len(external)} externos" if args.external else "links locais"
    print(f"Links OK: {len(MARKDOWN)} arquivos; {scope}.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
