"""Generate a weekly markdown digest from the DevOpps spine.

This script intentionally avoids non-stdlib dependencies so it can run in
minimal CI environments.
"""

from __future__ import annotations

import csv
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SPINE = ROOT / "spine" / "opportunities.csv"
EXPORTS = ROOT / "docs" / "exports"
DOCS = ROOT / "docs"


def load_rows(path: Path) -> list[dict[str, str]]:
    with path.open(newline="", encoding="utf-8") as handle:
        return list(csv.DictReader(handle))


def build_markdown(rows: list[dict[str, str]]) -> str:
    generated_at = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M UTC")
    lines = [
        "# Weekly DevOpps Digest",
        "",
        f"Generated: {generated_at}",
        "",
    ]

    for idx, row in enumerate(rows, start=1):
        lines.extend(
            [
                f"## {idx}) {row['name']}",
                f"- Type: {row['type']}",
                f"- Deadline: {row['deadline']}",
                f"- Immediate Income Impact: {row['immediate_income_impact']}/5",
                f"- Long-Term Positioning: {row['long_term_positioning']}/5",
                f"- Leverage Multiplier: {row['leverage_multiplier']}/5",
                f"- Time Cost: {row['time_cost']}",
                f"- Deployment Class: {row['deployment_class']}",
                f"- Source: {row['source_url']}",
                f"- Notes: {row['notes']}",
                "",
            ]
        )

    return "\n".join(lines)


def main() -> None:
    EXPORTS.mkdir(parents=True, exist_ok=True)
    DOCS.mkdir(parents=True, exist_ok=True)

    rows = load_rows(SPINE)
    digest_md = build_markdown(rows)

    (EXPORTS / "weekly_digest.md").write_text(digest_md, encoding="utf-8")
    # Placeholder PDF output to keep pipeline file paths stable.
    (EXPORTS / "weekly_digest.pdf").write_text(
        "PDF placeholder: generate via your preferred renderer in production.",
        encoding="utf-8",
    )


if __name__ == "__main__":
    main()
