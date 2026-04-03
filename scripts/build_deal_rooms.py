#!/usr/bin/env python3
"""Build buyer-facing static deal rooms into site/rooms.

Input: scored musings.
Output: institutional summaries with controlled commercial CTAs.
"""

from __future__ import annotations

import json
from pathlib import Path

from redact import redact_text

ROOT = Path(__file__).resolve().parents[1]
MUSINGS = ROOT / "data" / "musings.json"
DEAL_ROOMS_DATA = ROOT / "data" / "deal_rooms.json"
OUT_DIR = ROOT / "site" / "rooms"


def room_html(item: dict) -> str:
    title = redact_text(item.get("title", "Untitled Room"))
    scores = item.get("scores", {})
    impact = redact_text(item.get("content", "")).split()
    summary = " ".join(impact[:90]) or "Structured delivery package available under access control."
    leak_note = "Leak risk elevated; restricted review path recommended." if scores.get("leak_risk", 0) >= 30 else "Leak risk controlled for public artifact layer."

    return f"""<!doctype html>
<html lang=\"en\"><head><meta charset=\"utf-8\"><title>{title}</title></head>
<body style=\"font-family:system-ui;max-width:840px;margin:2rem auto;line-height:1.45\">
<h1>{title}</h1>
<p><strong>Structured impact summary</strong></p>
<p>{summary}</p>
<ul>
<li>Release state: {scores.get('release_state', 'unknown')}</li>
<li>Release score: {scores.get('release_score', 'n/a')}</li>
<li>{leak_note}</li>
</ul>
<p>
<button>Start pilot</button>
<button>Request access</button>
<button>Acquire license</button>
</p>
</body></html>"""


def main() -> None:
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    musings = json.loads(MUSINGS.read_text(encoding="utf-8")) if MUSINGS.exists() else []

    rooms = []
    for item in musings:
        if item.get("scores", {}).get("release_state") == "private_hold":
            continue
        slug = item.get("id", "room").replace(" ", "-")
        path = OUT_DIR / f"{slug}.html"
        path.write_text(room_html(item), encoding="utf-8")
        rooms.append({"id": slug, "title": redact_text(item.get("title", "Untitled")), "path": f"rooms/{slug}.html"})

    DEAL_ROOMS_DATA.write_text(json.dumps(rooms, indent=2), encoding="utf-8")
    print(f"built {len(rooms)} deal rooms")


if __name__ == "__main__":
    main()
