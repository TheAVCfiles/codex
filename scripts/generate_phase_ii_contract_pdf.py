#!/usr/bin/env python3
"""Generate a send-ready StagePort Phase II contract PDF.

Usage:
  python scripts/generate_phase_ii_contract_pdf.py
  python scripts/generate_phase_ii_contract_pdf.py --output /tmp/StagePort_Phase_II_Contract.pdf
"""

from __future__ import annotations

import argparse
from pathlib import Path


def build_pdf(output_path: Path) -> None:
    try:
        from reportlab.lib.pagesizes import letter
        from reportlab.lib.styles import getSampleStyleSheet
        from reportlab.platypus import Paragraph, SimpleDocTemplate, Spacer
    except ImportError as exc:  # pragma: no cover
        raise SystemExit(
            "reportlab is required. Install with: pip install reportlab"
        ) from exc

    doc = SimpleDocTemplate(str(output_path), pagesize=letter)
    styles = getSampleStyleSheet()
    story = []

    def add(text: str, style: str = "Normal", spacer: int = 10) -> None:
        story.append(Paragraph(text, styles[style]))
        story.append(Spacer(1, spacer))

    add("StagePort Systems — Phase II Agreement", "Title")

    add(
        "This Phase II Agreement outlines the deployment and governance implementation "
        "of the system architecture defined in Phase I between AVC Systems Studio and Client."
    )

    add("1. Purpose", "Heading2")
    add(
        "Phase II activates and stabilizes the system architecture defined in Phase I, "
        "transitioning from documentation to operational system deployment."
    )

    add("2. Scope of Work", "Heading2")
    add("System Deployment: Implementation of StagePort Ledger framework, scoring systems, and structured outputs.")
    add("Governance Layer Extension: Enforcement of boundaries, audit trail expansion, and system constraints.")
    add("Interface & Outputs: Ledger reports, dashboards, export-ready artifacts.")
    add("Operational Stabilization: 30-day controlled deployment cycle with validation and iteration.")

    add("3. Deliverables", "Heading2")
    add("• Live system layer (local/cloud)")
    add("• Functional scoring + reporting outputs")
    add("• Updated governance record")
    add("• Phase II deployment log")

    add("4. Engagement Terms", "Heading2")
    add("This is a fixed-scope engagement. No open-ended consulting. All work remains within defined Phase II boundaries.")

    add("5. Fee", "Heading2")
    add("$9,500 USD — Fixed Phase II Engagement Fee")

    add("6. Position", "Heading2")
    add("AVC Systems Studio operates as Founding Systems Architect — Governance & Infrastructure.")

    add("7. Acceptance", "Heading2")
    add("Execution of this agreement confirms alignment on Phase II scope and authorization to proceed.")

    add("Signature (Client): ____________________________")
    add("Signature (AVC Systems Studio): ____________________________")

    doc.build(story)


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Generate StagePort Phase II contract PDF")
    parser.add_argument(
        "--output",
        type=Path,
        default=Path("/mnt/data/StagePort_Phase_II_Contract.pdf"),
        help="Output PDF path (default: /mnt/data/StagePort_Phase_II_Contract.pdf)",
    )
    return parser.parse_args()


if __name__ == "__main__":
    args = parse_args()
    args.output.parent.mkdir(parents=True, exist_ok=True)
    build_pdf(args.output)
    print(args.output)
