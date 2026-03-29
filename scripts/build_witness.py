#!/usr/bin/env python3
"""Build Witness Window Lite static previews.

Important limitation: GitHub Pages is static hosting.
This means witness gating is soft UX gating only, not cryptographic protection.
"""

from __future__ import annotations

import json
import secrets
from datetime import datetime, timedelta, timezone
from pathlib import Path

from redact import redact_text

ROOT = Path(__file__).resolve().parents[1]
MUSINGS = ROOT / "data" / "musings.json"
TOKENS = ROOT / "data" / "witness_tokens.json"
OUT_DIR = ROOT / "site" / "witness"


def make_preview(item: dict, token: str, expires_iso: str) -> str:
    title = redact_text(item.get("title", "Witness Preview"))
    summary = " ".join(redact_text(item.get("content", "")).split()[:40]) or "Controlled witness snapshot."
    return f"""<!doctype html>
<html lang=\"en\"><head><meta charset=\"utf-8\"><title>{title}</title>
<style>
body{{font-family:system-ui;max-width:760px;margin:2rem auto;user-select:none;}}
#payload{{filter:blur(8px);transition:filter .2s ease;}}
.revealed #payload{{filter:blur(0);}}
</style>
</head>
<body>
<h1>Witness Window Lite</h1>
<p>Soft-gated preview only. Static Pages cannot enforce secure private runtime controls.</p>
<p id="expiry">Token expires: {expires_iso}</p>
<button onclick="document.body.classList.add('revealed')">Reveal preview</button>
<div id="payload"><h2>{title}</h2><p>{summary}</p></div>
<script>
const expiry = new Date('{expires_iso}');
if (new Date() > expiry) {{
  document.getElementById('payload').innerHTML = '<p>Window closed.</p>';
}}
</script>
</body></html>"""


def main() -> None:
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    musings = json.loads(MUSINGS.read_text(encoding="utf-8")) if MUSINGS.exists() else []

    now = datetime.now(timezone.utc)
    token_rows = []
    for item in musings:
        if item.get("scores", {}).get("release_state") == "private_hold":
            continue
        slug = item.get("id", "witness").replace(" ", "-")
        token = secrets.token_urlsafe(8)
        expiry = now + timedelta(days=7)
        expiry_iso = expiry.isoformat()
        (OUT_DIR / f"{slug}.html").write_text(make_preview(item, token, expiry_iso), encoding="utf-8")
        token_rows.append({"id": slug, "token": token, "expires_at": expiry_iso})

    TOKENS.write_text(json.dumps(token_rows, indent=2), encoding="utf-8")
    print(f"built {len(token_rows)} witness previews")


if __name__ == "__main__":
    main()
