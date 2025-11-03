"""Feature engineering helpers for the mesh demo."""
from __future__ import annotations

import pandas as pd


def feature_engineering(frame: pd.DataFrame, config) -> pd.DataFrame:
    """Return a simple feature set using rolling averages."""
    frame = frame.copy()
    frame["amplitude_ma"] = frame["price"].rolling(config.am_window).mean()
    frame["vol_momentum"] = frame["price"].pct_change(config.vm_norm)
    frame["ei_band"] = frame["price"].rolling(config.vm_short).mean()
    return frame.fillna(method="bfill").fillna(method="ffill")
