#!/usr/bin/env python3
"""Build a static Witness Window Lite preview.

Important: static hosting provides soft gating only. This page can signal
restricted access intent, but cannot enforce true private runtime controls.
"""

from __future__ import annotations

import json
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
TOKENS_PATH = ROOT / "data" / "witness_tokens.json"
TEMPLATE_PATH = ROOT / "src" / "templates" / "witness.html"
OUTPUT_DIR = ROOT / "site" / "witness"


def main() -> None:
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    template = TEMPLATE_PATH.read_text(encoding="utf-8")
    tokens = json.loads(TOKENS_PATH.read_text(encoding="utf-8"))
    token_count = len(tokens) if isinstance(tokens, list) else 0

    rendered = template.replace("{{generated_at}}", datetime.now(timezone.utc).isoformat())
    rendered = rendered.replace("{{token_count}}", str(token_count))

    (OUTPUT_DIR / "index.html").write_text(rendered, encoding="utf-8")
    print("Built Witness Window Lite")


if __name__ == "__main__":
    main()
