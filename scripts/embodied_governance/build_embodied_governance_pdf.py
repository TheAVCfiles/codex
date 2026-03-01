"""Generate an expanded journal-grade SSI governance PDF draft.

This script packages the provided v2 narrative into a single ReportLab document
and includes a reproducible SSI/bootstrap worked example.
"""

from __future__ import annotations

import argparse
from dataclasses import dataclass
from datetime import datetime
from pathlib import Path
from typing import Sequence

import numpy as np
from reportlab.lib.pagesizes import LETTER
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.lib.units import inch
from reportlab.platypus import PageBreak
from reportlab.platypus import Paragraph
from reportlab.platypus import SimpleDocTemplate
from reportlab.platypus import Spacer


DEFAULT_OUTPUT = "Embodied_Governance_Working_Summary_v2_Journal_Draft.pdf"


@dataclass(frozen=True)
class GovernanceCue:
    """Minimal record representing a governance event type and SSI score."""

    decision_type: str
    ssi: float


def logistic(value: float) -> float:
    return 1.0 / (1.0 + np.exp(-value))


def calculate_ssi(
    events: Sequence[float], weights: Sequence[float], kappa: float, delta_t: Sequence[float]
) -> float:
    """Compute bounded SSI in [0, 10]."""
    events_array = np.asarray(events, dtype=float)
    weights_array = np.asarray(weights, dtype=float)
    delta_array = np.asarray(delta_t, dtype=float)

    z_norm = np.sum(weights_array)
    if z_norm <= 0:
        raise ValueError("weights must sum to a positive value")

    weighted_sum = np.sum(weights_array * events_array * np.exp(-kappa * delta_array))
    return float(10.0 * logistic(weighted_sum / z_norm))


def bootstrap_ci_ssi(
    events: Sequence[float],
    weights: Sequence[float],
    kappa: float,
    delta_t: Sequence[float],
    n_bootstraps: int = 1000,
    ci_level: float = 0.95,
    seed: int = 42,
) -> tuple[float, float]:
    """Bootstrap percentile CI for SSI."""
    events_array = np.asarray(events, dtype=float)
    weights_array = np.asarray(weights, dtype=float)
    delta_array = np.asarray(delta_t, dtype=float)
    rng = np.random.default_rng(seed)

    bootstraps = []
    for _ in range(n_bootstraps):
        sample_indices = rng.choice(len(events_array), len(events_array), replace=True)
        sample_events = events_array[sample_indices]
        sample_weights = weights_array[sample_indices]
        sample_delta = delta_array[sample_indices]
        bootstraps.append(calculate_ssi(sample_events, sample_weights, kappa, sample_delta))

    alpha = (1 - ci_level) / 2
    lower = float(np.percentile(bootstraps, alpha * 100))
    upper = float(np.percentile(bootstraps, (1 - alpha) * 100))
    return lower, upper


def build_pdf(path: Path) -> Path:
    doc = SimpleDocTemplate(str(path), pagesize=LETTER)
    styles = getSampleStyleSheet()

    title_style = styles["Heading1"]
    section_style = styles["Heading2"]
    normal_style = styles["BodyText"]

    now_stamp = datetime.now().strftime("%m-%d-%Y %I:%M %p %Z").strip()

    events = [0.8, 0.9, 0.7, 0.85]
    weights = [1.0, 1.0, 1.0, 1.0]
    kappa = 0.1
    delta_t = [0, 1, 2, 3]
    ssi_value = calculate_ssi(events, weights, kappa, delta_t)
    ci_lower, ci_upper = bootstrap_ci_ssi(events, weights, kappa, delta_t)
    cue = GovernanceCue("Investor Demand", ssi_value)

    elements = [
        Paragraph(
            "Embodied Governance: A Hybrid Architecture for Founder-Safe Systems<br/>"
            "AVC Systems Studio / Intuition Labs R+D<br/>"
            "Working Summary – Journal Draft (v2)<br/>"
            f"Generated: {now_stamp}",
            title_style,
        ),
        Spacer(1, 0.5 * inch),
        Paragraph(
            "Abstract: This manuscript formalizes a deterministic governance architecture "
            "for early-stage safety-technology organizations. The architecture integrates a "
            "Structural Integrity Index (SSI), bootstrap-validated escalation gating, an "
            "invariant registry with drift detection, and a finite-state governance machine "
            "(FSM). The system is designed to operate under asymmetric investor pressure and "
            "regulatory uncertainty, enforcing fail-closed defaults and auditable decision logging.",
            normal_style,
        ),
        PageBreak(),
        Paragraph("1. Problem Definition", section_style),
        Spacer(1, 0.2 * inch),
        Paragraph(
            "Governance fragility in early-stage safety firms arises from constraint erosion, "
            "escalation latency, and authority instability. Traditional governance relies on "
            "policy documents rather than state-aware execution architecture.",
            normal_style,
        ),
        Spacer(1, 0.3 * inch),
        Paragraph("2. Structural Integrity Index (SSI)", section_style),
        Spacer(1, 0.2 * inch),
        Paragraph(
            "SSI_t = 10 · σ((1/Z) Σ [w_i · e_i · exp(-κΔt_i)])<br/>"
            "Bootstrap rule: trigger escalation only when CI_lower &lt; threshold.",
            normal_style,
        ),
        Spacer(1, 0.2 * inch),
        Paragraph(
            f"Worked example ({cue.decision_type}): SSI={ssi_value:.3f}; "
            f"95% CI=[{ci_lower:.3f}, {ci_upper:.3f}]",
            normal_style,
        ),
        PageBreak(),
        Paragraph("3. Escalation Finite State Machine (FSM)", section_style),
        Spacer(1, 0.2 * inch),
        Paragraph(
            "States: IDLE → ACTIVE → STRESS → FAULT → RECOVERY<br/>"
            "ACTIVE → STRESS if SSI &lt; 7.5<br/>"
            "STRESS → FAULT if SSI &lt; 5.0 OR quorum M &lt; 3<br/>"
            "FAULT → RECOVERY only after invariant revalidation.",
            normal_style,
        ),
        Spacer(1, 0.2 * inch),
        Paragraph(
            "Fail-Closed Property: If validation uncertainty exists, execution is suspended automatically.",
            normal_style,
        ),
        PageBreak(),
        Paragraph("4. Invariant Registry & Drift Detection", section_style),
        Spacer(1, 0.2 * inch),
        Paragraph(
            "Invariants are versioned, cryptographically signed constraints. Drift detection monitors alignment variance, "
            "weight instability, serial correlation spikes, and unauthorized invariant modification. Drift threshold "
            "breach triggers STRESS automatically.",
            normal_style,
        ),
        PageBreak(),
        Paragraph("5. Constrained Elastic Risk Allocation (CERA)", section_style),
        Spacer(1, 0.2 * inch),
        Paragraph(
            "False escalation bound: E(false triggers | M) ≤ p_f^M<br/>"
            "Risk allocation rule: If SSI ≥ 9.0 and p_false &lt; 0.05, Risk = 1.5% capital; else Risk = 0.25% capital.",
            normal_style,
        ),
    ]

    doc.build(elements)
    return path


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--output",
        type=Path,
        default=Path(DEFAULT_OUTPUT),
        help="Output PDF path (default: %(default)s)",
    )
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    output_path = build_pdf(args.output)
    print(output_path.resolve())


if __name__ == "__main__":
    main()
