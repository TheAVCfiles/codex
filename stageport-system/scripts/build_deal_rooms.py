import json
from html import escape
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
MUSINGS = ROOT / "data" / "musings.json"
OUTDIR = ROOT / "site" / "rooms"
OUTDIR.mkdir(parents=True, exist_ok=True)


def build_room(title: str, stats: dict) -> str:
    return f"""<!DOCTYPE html>
<html>
<head>
  <meta charset=\"utf-8\" />
  <title>{escape(title)}</title>
  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1\" />
  <style>
    body {{ background:#050505; color:#e7e7e7; font-family:system-ui; margin:0; padding:40px; }}
    .wrap {{ max-width:960px; margin:0 auto; }}
    .card {{ border:1px solid #262626; background:#111; padding:24px; border-radius:16px; margin-bottom:20px; }}
    .eyebrow {{ color:#9ca3af; letter-spacing:.12em; text-transform:uppercase; font-size:12px; }}
    h1 {{ margin:12px 0; }}
    p, li {{ color:#b3b3b3; line-height:1.6; }}
    button {{ padding:12px 16px; border-radius:12px; background:#111; color:#fff; border:1px solid #333; }}
  </style>
</head>
<body>
  <div class=\"wrap\">
    <div class=\"card\">
      <div class=\"eyebrow\">Deal Room</div>
      <h1>{escape(title)}</h1>
      <p>Controlled preview. Structured impact. No source exposure.</p>
    </div>
    <div class=\"card\">
      <h2>Structured Impact</h2>
      <ul>
        <li>Release score: {stats.get("release_score", 0)}</li>
        <li>Market score: {stats.get("market_score", 0)}</li>
        <li>Leak risk score: {stats.get("leak_risk_score", 0)}</li>
      </ul>
    </div>
    <div class=\"card\">
      <h2>Next Step</h2>
      <button>Start pilot</button>
      <button>Acquire license</button>
    </div>
  </div>
</body>
</html>"""


def main() -> None:
    musings = json.loads(MUSINGS.read_text()) if MUSINGS.exists() else []
    for i, musing in enumerate(musings):
        if musing.get("release_state") != "gated_preview":
            continue
        (OUTDIR / f"room-{i + 1}.html").write_text(build_room(musing.get("title", "Untitled"), musing))


if __name__ == "__main__":
    main()
