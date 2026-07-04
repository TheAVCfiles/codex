import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DUMPS = ROOT / "data" / "codex_dumps.json"
OUT = ROOT / "data" / "musings.json"


def count_terms(text: str, words: list[str]) -> int:
    lower = text.lower()
    return sum(lower.count(w) for w in words)


def score_item(item: dict) -> dict:
    text = f"{item.get('title', '')}\n{item.get('body', '')}"
    intensity = count_terms(text, ["must", "now", "urgent", "launch", "public"]) * 8
    clarity = count_terms(text, ["system", "workflow", "schema", "operator", "ledger", "demo"]) * 7
    market = count_terms(text, ["buyer", "enterprise", "pilot", "license", "pricing", "install"]) * 9
    timeliness = count_terms(text, ["right now", "this week", "today", "current"]) * 12
    leak = count_terms(text, ["prompt", "compiler", "internal language", "service key", "authority rules"]) * 14

    release_score = max(0, min(100, intensity + clarity + market + timeliness - min(leak, 60)))

    if release_score >= 75 and leak < 20:
        release_state = "public_now"
    elif release_score >= 45:
        release_state = "gated_preview"
    else:
        release_state = "private_hold"

    return {
        "source_id": item.get("id"),
        "title": item.get("title"),
        "content": item.get("body", ""),
        "classification": item.get("classification", "vision"),
        "intensity_score": min(intensity, 100),
        "clarity_score": min(clarity, 100),
        "market_score": min(market, 100),
        "timeliness_score": min(timeliness, 100),
        "leak_risk_score": min(leak, 100),
        "release_score": release_score,
        "release_state": release_state,
    }


def main() -> None:
    dumps = json.loads(DUMPS.read_text()) if DUMPS.exists() else []
    scored = [score_item(d) for d in dumps]
    OUT.write_text(json.dumps(scored, indent=2) + "\n")


if __name__ == "__main__":
    main()
