"""Data loading helpers for the KOLL backtest."""

from __future__ import annotations

import csv
import pathlib
from typing import Any, Dict, Iterable, List

ROOT = pathlib.Path(__file__).resolve().parents[2]


def _resolve(path: str) -> pathlib.Path:
    candidate = ROOT / path
    if not candidate.exists():
        raise FileNotFoundError(f"Dataset path not found: {candidate}")
    return candidate


def load_dataset(config: Dict[str, Any]) -> List[Dict[str, Any]]:
    """Load rows from the configured dataset bundle.

    The config expects a ``primary`` CSV path with optional ``supplemental``
    files.  Each row is converted to floats/ints when possible to make feature
    math straightforward during testing.
    """

    primary_path = _resolve(config.get("primary", "engines/koll_core/datasets/sim_data.csv"))
    supplemental = [
        _resolve(path)
        for path in config.get("supplemental", [
            "engines/koll_core/datasets/asset_a.csv",
            "engines/koll_core/datasets/asset_b.csv",
            "engines/koll_core/datasets/asset_c.csv",
        ])
    ]

    rows = list(_read_csv(primary_path))
    for extra in supplemental:
        rows.extend(_read_csv(extra))
    return rows


def _coerce(value: str) -> Any:
    if value == "":
        return None
    for cast in (int, float):
        try:
            return cast(value)
        except ValueError:
            continue
    return value


def _read_csv(path: pathlib.Path) -> Iterable[Dict[str, Any]]:
    with path.open("r", encoding="utf-8") as handle:
        reader = csv.DictReader(handle)
        for row in reader:
            yield {key: _coerce(value) for key, value in row.items()}
