"""Reference alignment metrics for local MythOS experiments."""

from __future__ import annotations

from dataclasses import dataclass


@dataclass(frozen=True)
class AlignmentInputs:
    """Inputs for alignment metric calculations."""

    integrity: float
    coherence: float
    drift: float
    incidents: int
    recoveries: int


def clamp(value: float, minimum: float = 0.0, maximum: float = 1.0) -> float:
    """Clamp a floating-point value to an inclusive range."""
    return max(minimum, min(maximum, value))


def alignment_score_a_t(integrity: float, coherence: float, drift: float) -> float:
    """Compute alignment score A(t) based on local system signals.

    Higher integrity/coherence improve score, while drift reduces it.
    """

    weighted = (0.45 * integrity) + (0.45 * coherence) - (0.35 * drift)
    return clamp(weighted)


def burn_rate_e_sac(incidents: int, recoveries: int, window_hours: float = 24.0) -> float:
    """Compute burn rate E_sac as net unresolved incidents per hour."""

    if window_hours <= 0:
        raise ValueError("window_hours must be > 0")

    unresolved = max(0, incidents - recoveries)
    return unresolved / window_hours


def containment_v_cont(coherence: float, drift: float, incident_pressure: float) -> float:
    """Compute containment metric V_cont where higher is better containment."""

    score = (0.60 * coherence) + (0.30 * (1 - drift)) - (0.20 * incident_pressure)
    return clamp(score)


def compute_metrics(inputs: AlignmentInputs) -> dict[str, float]:
    """Convenience helper returning all reference metrics."""

    a_t = alignment_score_a_t(inputs.integrity, inputs.coherence, inputs.drift)
    e_sac = burn_rate_e_sac(inputs.incidents, inputs.recoveries)
    v_cont = containment_v_cont(inputs.coherence, inputs.drift, e_sac)
    return {"A_t": a_t, "E_sac": e_sac, "V_cont": v_cont}
