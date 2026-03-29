#!/usr/bin/env python3
"""Build public-safe demo artifacts into site/demos.

Only redacted summaries are published. Raw source logic is never exported.
"""

from __future__ import annotations

import json
from pathlib import Path

from redact import redact_text

ROOT = Path(__file__).resolve().parents[1]
MUSINGS = ROOT / "data" / "musings.json"
DEMOS_DATA = ROOT / "data" / "demos.json"
OUT_DIR = ROOT / "site" / "demos"


def demo_summary(content: str) -> str:
    words = redact_text(content).split()
    return " ".join(words[:70]) if words else "Controlled transformation artifact prepared for review."


def build_demo_html(item: dict) -> str:
    title = redact_text(item.get("title", "Untitled Demo"))
    summary = demo_summary(item.get("content", ""))
    return f"""<!doctype html>
<html lang=\"en\"><head><meta charset=\"utf-8\"><title>{title}</title></head>
<body style=\"font-family:system-ui;max-width:760px;margin:2rem auto;line-height:1.4\">
<h1>{title}</h1>
<p><strong>Controlled Summary</strong></p>
<p>{summary}</p>
<p>This public artifact is intentionally limited to rendered outcomes.</p>
<button>Request access</button>
</body></html>"""


def main() -> None:
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    musings = json.loads(MUSINGS.read_text(encoding="utf-8")) if MUSINGS.exists() else []

    demos = []
    for item in musings:
        if item.get("scores", {}).get("release_state") == "private_hold":
            continue
        slug = item.get("id", "demo").replace(" ", "-")
        page = OUT_DIR / f"{slug}.html"
        page.write_text(build_demo_html(item), encoding="utf-8")
        demos.append({"id": slug, "title": redact_text(item.get("title", "Untitled")), "path": f"demos/{slug}.html"})

    DEMOS_DATA.write_text(json.dumps(demos, indent=2), encoding="utf-8")
    print(f"built {len(demos)} demos")


if __name__ == "__main__":
    main()
