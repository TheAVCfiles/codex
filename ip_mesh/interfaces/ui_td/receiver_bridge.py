"""Bridge between Koll EI output and Mayfleur OSC percent."""
from __future__ import annotations


def route_ei_to_percent(ei_value: float) -> float:
    """Map EI (0-1 scale) to a light grid percentage."""
    return max(0.0, min(100.0, ei_value * 100.0))
