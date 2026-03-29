#!/usr/bin/env python3
"""Build static buyer-facing deal room pages from scored musings."""

from __future__ import annotations

import html
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
MUSINGS_PATH = ROOT / "data" / "musings.json"
ROOMS_DATA_PATH = ROOT / "data" / "deal_rooms.json"
TEMPLATE_PATH = ROOT / "src" / "templates" / "room.html"
OUTPUT_DIR = ROOT / "site" / "rooms"


def release_score(item: dict) -> int:
    scores = item.get("scores", {})
    return int((scores.get("clarity", 0) + scores.get("market_readiness", 0) + (100 - scores.get("leak_risk", 100))) / 3)


def main() -> None:
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    template = TEMPLATE_PATH.read_text(encoding="utf-8")
    musings = json.loads(MUSINGS_PATH.read_text(encoding="utf-8"))

    rooms = []
    for item in musings:
        if item.get("release_state") not in {"public_now", "gated_preview"}:
            continue

        rscore = release_score(item)
        impact_summary = (
            f"Clarity {item['scores']['clarity']} / 100, "
            f"market readiness {item['scores']['market_readiness']} / 100, "
            f"leak risk {item['scores']['leak_risk']} / 100."
        )

        rendered = template
        rendered = rendered.replace("{{title}}", html.escape(item["title"]))
        rendered = rendered.replace("{{impact_summary}}", html.escape(impact_summary))
        rendered = rendered.replace("{{release_score}}", str(rscore))

        output_file = OUTPUT_DIR / f"{item['id']}.html"
        output_file.write_text(rendered, encoding="utf-8")

        rooms.append(
            {
                "id": item["id"],
                "title": item["title"],
                "path": f"rooms/{item['id']}.html",
                "release_score": rscore,
                "cta": ["Start pilot", "Request access", "Acquire license"],
            }
        )

    ROOMS_DATA_PATH.write_text(json.dumps(rooms, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    print(f"Built {len(rooms)} deal room pages")


if __name__ == "__main__":
    main()
