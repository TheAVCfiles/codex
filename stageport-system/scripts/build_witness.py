import hashlib
import json
import secrets
import time
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
TOKENS = ROOT / "data" / "witness_tokens.json"
OUTDIR = ROOT / "site" / "witness"
OUTDIR.mkdir(parents=True, exist_ok=True)


def make_token() -> tuple[str, str]:
    raw = secrets.token_hex(16)
    hashed = hashlib.sha256(raw.encode()).hexdigest()
    return raw, hashed


def main() -> None:
    raw, hashed = make_token()
    payload = {"valid_hashes": [hashed], "generated_at": int(time.time())}
    TOKENS.write_text(json.dumps(payload, indent=2))

    html = """<!DOCTYPE html>
<html>
<head>
  <meta charset=\"utf-8\" />
  <title>Witness Window</title>
  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1\" />
  <style>
    body { background:#050505; color:#e7e7e7; font-family:system-ui; margin:0; padding:40px; }
    .wrap { max-width:800px; margin:0 auto; }
    .card { border:1px solid #262626; background:#111; padding:24px; border-radius:16px; }
    input, button { padding:12px 14px; margin-top:10px; background:#0b0b0b; color:#fff; border:1px solid #333; border-radius:10px; }
    p { color:#b3b3b3; }
  </style>
</head>
<body>
  <div class=\"wrap\">
    <div class=\"card\">
      <h1>Witness Window</h1>
      <p>Restricted preview. No source. No metrics. No notifications.</p>
      <input id=\"token\" placeholder=\"Enter access token\" />
      <button onclick=\"enter()\">Open</button>
      <p id=\"state\"></p>
    </div>
  </div>
  <script>
    async function sha256(text) {
      const data = new TextEncoder().encode(text);
      const hashBuffer = await crypto.subtle.digest("SHA-256", data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
    }

    async function enter() {
      const token = document.getElementById("token").value.trim();
      const state = document.getElementById("state");
      const cfg = await fetch("../../data/witness_tokens.json").then(r => r.json());
      const hashed = await sha256(token);

      if (cfg.valid_hashes.includes(hashed)) {
        state.textContent = "Access approved. Commission adaptation or request install.";
      } else {
        state.textContent = "Access closed.";
      }
    }
  </script>
</body>
</html>
"""
    (OUTDIR / "index.html").write_text(html)
    print(f"WITNESS_TOKEN={raw}")


if __name__ == "__main__":
    main()
