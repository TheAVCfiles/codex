import json
from html import escape
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
MUSINGS = ROOT / "data" / "musings.json"
OUTDIR = ROOT / "site" / "demos"
OUTDIR.mkdir(parents=True, exist_ok=True)


def sanitize(text: str) -> str:
    banned = ["prompt", "compiler", "service key", "authority rules", "internal language"]
    for b in banned:
        text = text.replace(b, "[redacted]")
        text = text.replace(b.title(), "[redacted]")
    return escape(text[:2200])


def build_page(title: str, content: str) -> str:
    return f"""<!DOCTYPE html>
<html>
<head>
  <meta charset=\"utf-8\" />
  <title>{escape(title)}</title>
  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1\" />
  <style>
    body {{ background:#050505; color:#e7e7e7; font-family:system-ui; margin:0; padding:40px; }}
    .wrap {{ max-width:900px; margin:0 auto; }}
    .card {{ border:1px solid #262626; background:#111; padding:24px; border-radius:16px; }}
    .eyebrow {{ color:#9ca3af; letter-spacing:.12em; text-transform:uppercase; font-size:12px; }}
    h1 {{ font-size:40px; margin:12px 0 16px; }}
    p {{ color:#b3b3b3; line-height:1.6; white-space:pre-wrap; }}
    .cta {{ display:inline-block; margin-top:18px; padding:12px 18px; border:1px solid #333; border-radius:12px; color:#fff; text-decoration:none; }}
  </style>
</head>
<body>
  <div class=\"wrap\">
    <div class=\"card\">
      <div class=\"eyebrow\">Preview Artifact</div>
      <h1>{escape(title)}</h1>
      <p>{content}</p>
      <a class=\"cta\" href=\"../witness/index.html\">Request access</a>
    </div>
  </div>
</body>
</html>"""


def main() -> None:
    musings = json.loads(MUSINGS.read_text()) if MUSINGS.exists() else []
    for i, m in enumerate(musings):
        if m["release_state"] not in ("public_now", "gated_preview"):
            continue
        slug = f"demo-{i + 1}.html"
        html = build_page(m["title"], sanitize(m["content"]))
        (OUTDIR / slug).write_text(html)


if __name__ == "__main__":
    main()
