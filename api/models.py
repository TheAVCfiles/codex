from __future__ import annotations

import pickle
from pathlib import Path
from typing import Any

from sklearn.linear_model import SGDClassifier
from sklearn.preprocessing import StandardScaler

MODEL_PATH = Path(__file__).resolve().parents[1] / "models" / "eth_sgd.pkl"


def _fresh_online_model() -> dict[str, Any]:
    return {
        "scaler": StandardScaler(),
        "clf_rain": SGDClassifier(loss="log_loss", max_iter=1000, tol=1e-3, random_state=7),
        "clf_sun": SGDClassifier(loss="log_loss", max_iter=1000, tol=1e-3, random_state=7),
    }


def _load_online() -> dict[str, Any]:
    if MODEL_PATH.exists():
        with MODEL_PATH.open("rb") as f:
            return pickle.load(f)
    return _fresh_online_model()


def _save_online(model: dict[str, Any]) -> None:
    MODEL_PATH.parent.mkdir(parents=True, exist_ok=True)
    with MODEL_PATH.open("wb") as f:
        pickle.dump(model, f)
