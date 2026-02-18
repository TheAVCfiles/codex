from __future__ import annotations

import json
from pathlib import Path

import numpy as np

try:
    from .models import _load_online, _save_online
except ImportError:  # pragma: no cover - script execution fallback
    from models import _load_online, _save_online

DATA = Path(__file__).resolve().parents[1] / "data"
LABELS_PATH = DATA / "labels.jsonl"


def load_labeled_samples(limit: int = 5000) -> list[dict[str, object]]:
    if not LABELS_PATH.exists():
        return []

    rows: list[dict[str, object]] = []
    with LABELS_PATH.open("r", encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if not line:
                continue
            try:
                rows.append(json.loads(line))
            except json.JSONDecodeError:
                continue
    return rows[-limit:]


def run() -> None:
    model = _load_online()
    samples = load_labeled_samples()
    if not samples:
        print("no labeled samples; skip")
        return

    valid = [s for s in samples if "x" in s and "y_rain" in s and "y_sun" in s]
    if not valid:
        print("samples found but no valid feature rows")
        return

    X = np.array([v["x"] for v in valid], dtype=float)
    y_rain = np.array([v["y_rain"] for v in valid], dtype=int)
    y_sun = np.array([v["y_sun"] for v in valid], dtype=int)

    scaler = model["scaler"]
    scaler.partial_fit(X)
    Xs = scaler.transform(X)

    for target, key in ((y_rain, "clf_rain"), (y_sun, "clf_sun")):
        clf = model[key]
        clf.partial_fit(Xs, target, classes=np.array([0, 1]))
        model[key] = clf

    _save_online(model)
    print("online_train updated")


if __name__ == "__main__":
    run()
