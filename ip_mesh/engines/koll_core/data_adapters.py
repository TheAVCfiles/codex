"""Data loading helpers."""
from __future__ import annotations

from pathlib import Path

import pandas as pd


def load_price_frame(path: Path) -> pd.DataFrame:
    """Load CSV data with sensible defaults for the demo."""
    frame = pd.read_csv(path, parse_dates=["time"])
    frame = frame.sort_values("time").set_index("time")
    return frame
