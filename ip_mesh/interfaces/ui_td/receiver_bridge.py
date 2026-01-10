"""Bridge script for relaying EI percent into TouchDesigner."""

from __future__ import annotations

import json
import socket
from pathlib import Path
from typing import Iterable

OSC_ADDRESS = ("127.0.0.1", 9004)


def load_signal_series(path: Path) -> Iterable[float]:
    data = path.read_text(encoding="utf-8").splitlines()[1:]
    for line in data:
        _, ei_value, _ = line.split(",")
        yield float(ei_value)


def send_percentages(series: Iterable[float]) -> None:
    sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    for value in series:
        payload = json.dumps({"address": "/lights/percent", "value": value}).encode("utf-8")
        sock.sendto(payload, OSC_ADDRESS)
    sock.close()


def main() -> None:
    signals = Path(__file__).resolve().parents[2] / "engines" / "koll_core" / "outputs" / "signals.csv"
    if not signals.exists():
        raise FileNotFoundError("Run the backtest before streaming EI percentages.")
    send_percentages(load_signal_series(signals))


if __name__ == "__main__":
    main()
