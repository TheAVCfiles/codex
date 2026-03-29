"""Placeholder Codex intake sync.

Extend this script to normalize inbound codex dump files into data/codex_dumps.json.
"""

from pathlib import Path
import json

ROOT = Path(__file__).resolve().parents[1]
DUMPS = ROOT / "data" / "codex_dumps.json"


def main() -> None:
    if not DUMPS.exists():
        DUMPS.write_text("[]\n")
    dumps = json.loads(DUMPS.read_text())
    print(f"codex_sync ready: {len(dumps)} dump entries")


if __name__ == "__main__":
    main()
