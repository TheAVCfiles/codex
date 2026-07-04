"""Codex dump intake placeholder.

This script is intentionally minimal for a GitHub-only scaffold. Extend it to pull
structured notes from your preferred intake source and append normalized records to
`data/codex_dumps.json`.
"""

from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
TARGET = ROOT / "data" / "codex_dumps.json"


def main() -> None:
    TARGET.parent.mkdir(parents=True, exist_ok=True)
    if not TARGET.exists():
        TARGET.write_text("[]\n")
    print(f"Codex intake ready at {TARGET}")


if __name__ == "__main__":
    main()
