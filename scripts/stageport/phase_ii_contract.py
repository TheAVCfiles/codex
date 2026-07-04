"""Generate the StagePort Phase II contract PDF.

This script creates a send-ready agreement document covering Phase II deployment,
governance implementation, scope, deliverables, engagement terms, and fee.
"""

from __future__ import annotations

import argparse
from pathlib import Path

from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.platypus import Paragraph, SimpleDocTemplate, Spacer

DEFAULT_OUTPUT = Path("StagePort_Phase_II_Contract.pdf")


def build_contract(output_path: Path) -> Path:
    """Render the Phase II contract PDF to ``output_path``."""
    styles = getSampleStyleSheet()
    document = SimpleDocTemplate(str(output_path), pagesize=letter)

    story: list = []

    def add_paragraph(text: str, style_name: str = "Normal", spacer: int = 10) -> None:
        story.append(Paragraph(text, styles[style_name]))
        story.append(Spacer(1, spacer))

    add_paragraph("StagePort Systems — Phase II Agreement", "Title", spacer=14)

    add_paragraph(
        "This Phase II Agreement outlines the deployment and governance implementation "
        "of the system architecture defined in Phase I between AVC Systems Studio and Client."
    )

    add_paragraph("1. Purpose", "Heading2")
    add_paragraph(
        "Phase II activates and stabilizes the system architecture defined in Phase I, "
        "transitioning from documentation to operational system deployment."
    )

    add_paragraph("2. Scope of Work", "Heading2")
    add_paragraph(
        "System Deployment: Implementation of StagePort Ledger framework, scoring systems, "
        "and structured outputs."
    )
    add_paragraph(
        "Governance Layer Extension: Enforcement of boundaries, audit trail expansion, "
        "and system constraints."
    )
    add_paragraph(
        "Interface & Outputs: Ledger reports, dashboards, export-ready artifacts."
    )
    add_paragraph(
        "Operational Stabilization: 30-day controlled deployment cycle with validation "
        "and iteration."
    )

    add_paragraph("3. Deliverables", "Heading2")
    add_paragraph("• Live system layer (local/cloud)")
    add_paragraph("• Functional scoring + reporting outputs")
    add_paragraph("• Updated governance record")
    add_paragraph("• Phase II deployment log")

    add_paragraph("4. Engagement Terms", "Heading2")
    add_paragraph(
        "This is a fixed-scope engagement. No open-ended consulting. "
        "All work remains within defined Phase II boundaries."
    )

    add_paragraph("5. Fee", "Heading2")
    add_paragraph("$9,500 USD — Fixed Phase II Engagement Fee")

    add_paragraph("6. Position", "Heading2")
    add_paragraph("AVC Systems Studio operates as Founding Systems Architect — Governance & Infrastructure.")

    add_paragraph("7. Acceptance", "Heading2")
    add_paragraph(
        "Execution of this agreement confirms alignment on Phase II scope "
        "and authorization to proceed."
    )

    add_paragraph("Signature (Client): ____________________________")
    add_paragraph("Signature (AVC Systems Studio): ____________________________")

    document.build(story)
    return output_path


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Generate the StagePort Phase II contract PDF.")
    parser.add_argument(
        "--output",
        type=Path,
        default=DEFAULT_OUTPUT,
        help=f"Path for the generated PDF (default: {DEFAULT_OUTPUT}).",
    )
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    pdf_path = build_contract(args.output)
    print(f"Created Phase II contract at {pdf_path.resolve()}")


if __name__ == "__main__":
    main()
