"""Lightweight backtest runner for the KOLL engine.

This script wires together the feature extraction, strategy logic, and
reporting helpers defined in the sibling modules.  It intentionally keeps the
runtime surface minimal so it can be called from automation (mesh/autopilot)
without additional dependencies.
"""

from __future__ import annotations

import argparse
import json
import pathlib
import sys
from typing import Any, Dict

ROOT = pathlib.Path(__file__).resolve().parents[2]
if str(ROOT) not in sys.path:
    sys.path.append(str(ROOT))

from engines.koll_core.data_adapters import load_dataset
from engines.koll_core.features import compute_features
from engines.koll_core.strategy_koll import generate_signals, evaluate_signals


DEFAULT_CONFIG = ROOT / "engines" / "koll_core" / "configs" / "koll_config.yaml"


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Run the KOLL backtest loop")
    parser.add_argument(
        "--config",
        type=pathlib.Path,
        default=DEFAULT_CONFIG,
        help="Path to the YAML configuration file for the run.",
    )
    return parser.parse_args()


def read_config(path: pathlib.Path) -> Dict[str, Any]:
    """Read a superset of YAML expressed as JSON or YAML.

    The configs we ship are YAML but structured so that a json.loads on the
    subset succeeds.  Falling back to a manual parse keeps the script dependency
    free for the sandbox.
    """

    text = path.read_text(encoding="utf-8")
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        data: Dict[str, Any] = {}
        current_section: list[str] = []
        for raw in text.splitlines():
            line = raw.strip()
            if not line or line.startswith("#"):
                continue
            if line.endswith(":") and not line.startswith("-"):
                current_section = line[:-1].split(".")
                continue
            if ":" in line:
                key, value = [part.strip() for part in line.split(":", 1)]
                target = data
                for section in current_section:
                    target = target.setdefault(section, {})  # type: ignore[assignment]
                if value.startswith("[") and value.endswith("]"):
                    items = [v.strip() for v in value[1:-1].split(",") if v.strip()]
                    target[key] = [json.loads(item) if item.startswith("\"") else float(item) if item.replace(".", "", 1).isdigit() else item for item in items]
                elif value.lower() in {"true", "false"}:
                    target[key] = value.lower() == "true"
                else:
                    try:
                        target[key] = float(value) if "." in value else int(value)
                    except ValueError:
                        target[key] = value
        return data


def main() -> None:
    args = parse_args()
    config = read_config(args.config)
    dataset = load_dataset(config.get("data", {}))
    features = compute_features(dataset, config.get("features", {}))
    signals = generate_signals(features, config.get("strategy", {}))
    evaluate_signals(signals, config.get("risk", {}), config.get("outputs", {}))


if __name__ == "__main__":
    main()
