"""Build automation for the Codex mesh."""

from __future__ import annotations

import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def build_all() -> None:
  subprocess.run(["npm", "run", "build"], cwd=ROOT / "codex_cli", check=False)
  subprocess.run(["npm", "run", "build"], cwd=ROOT / "ledger_demo", check=False)
  subprocess.run(["npm", "run", "build"], cwd=ROOT / "zero_loss_site", check=False)


if __name__ == "__main__":
  build_all()
