#!/usr/bin/env python3
"""Build public-safe static demo pages from musings.

Only rendered summaries are published; raw source logic is never emitted.
"""

from __future__ import annotations

import html
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
MUSINGS_PATH = ROOT / "data" / "musings.json"
DEMOS_DATA_PATH = ROOT / "data" / "demos.json"
TEMPLATE_PATH = ROOT / "src" / "templates" / "demo.html"
OUTPUT_DIR = ROOT / "site" / "demos"

DANGEROUS_TERMS = ["prompt", "internal", "compiler", "authority rules", "token", "key"]


def redact(text: str) -> str:
    lowered = text
    for term in DANGEROUS_TERMS:
        lowered = lowered.replace(term, "[redacted]")
        lowered = lowered.replace(term.title(), "[redacted]")
        lowered = lowered.replace(term.upper(), "[redacted]")
    return lowered


def main() -> None:
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    template = TEMPLATE_PATH.read_text(encoding="utf-8")
    musings = json.loads(MUSINGS_PATH.read_text(encoding="utf-8"))

    demos = []
    for item in musings:
        if item.get("release_state") == "private_hold":
            continue

        safe_summary = redact(item.get("summary", ""))
        rendered = template.replace("{{title}}", html.escape(item["title"]))
        rendered = rendered.replace("{{summary}}", html.escape(safe_summary))
        rendered = rendered.replace("{{release_state}}", html.escape(item["release_state"]))

        output_file = OUTPUT_DIR / f"{item['id']}.html"
        output_file.write_text(rendered, encoding="utf-8")

        demos.append(
            {
                "id": item["id"],
                "title": item["title"],
                "path": f"demos/{item['id']}.html",
                "release_state": item["release_state"],
            }
        )

    DEMOS_DATA_PATH.write_text(json.dumps(demos, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    print(f"Built {len(demos)} demo pages")


if __name__ == "__main__":
    main()
