"""TouchDesigner DAT script for relaying EI percent."""

from __future__ import annotations

import json
from typing import Any


def onReceiveOSC(dat, rowIndex, message, bytes, timeStamp, address, args, peer):  # type: ignore[no-redef]
    """Forward incoming OSC payloads into the shared table."""
    percent = args[0] if args else 0.0
    dat.clear()
    dat.appendRow(["percent", float(percent)])
    return


def export_state(path: str, payload: Any) -> None:
    with open(path, "w", encoding="utf-8") as handle:
        json.dump(payload, handle)
