"""Example DAT script for routing OSC into the Mayfleur receiver."""
from __future__ import annotations

import random


def onFrameStart(frame):  # TouchDesigner callback
    """Send a demo percent payload to the uniform channel."""
    percent = random.uniform(0, 100)
    op("oscout_lights").sendOSC("/percent", [percent])
    return percent
