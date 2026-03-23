"""Generate the StagePort submission packet as a styled PDF document.

This script packages the StagePort pitch supplied in the repository into a
print-friendly PDF with broad Unicode coverage. The output path is configurable
via the CLI, and parent directories are created automatically.
"""
from __future__ import annotations

import argparse
from dataclasses import dataclass
from pathlib import Path
from typing import Iterable, List

from reportlab.lib.enums import TA_CENTER
from reportlab.lib.pagesizes import LETTER
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import inch
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.cidfonts import UnicodeCIDFont
from reportlab.platypus import ListFlowable, ListItem, Paragraph, SimpleDocTemplate, Spacer


@dataclass(frozen=True)
class BulletSection:
    """A titled bullet-list section in the submission packet."""

    title: str
    bullets: List[str]


TITLE = "StagePort™: Embodied Intelligence Infrastructure for Human Data Encoding"
DEFAULT_OUTPUT = Path("StagePort_Submission_Packet.pdf")
CORE_STATEMENT = "This is not a story. This is a system."

ONE_LINE_SUMMARY = (
    "A system that converts human experience—movement, narrative, and decision-making—"
    "into structured, auditable data systems for AI, governance, and creative computation."
)

EXPANDED_DESCRIPTION = (
    "StagePort™ is a novel infrastructure layer that translates human experience into "
    "structured, machine-legible data. Built from over a decade of work in choreography, "
    "spoken word, and systems design, the project introduces a new paradigm: embodied "
    "intelligence—where movement, memory, and narrative are encoded as computational artifacts."
)

SYSTEM_COMPONENTS = BulletSection(
    "Core system components",
    [
        "PyRouette Engine — a scoring and translation layer converting human motion into measurable outputs.",
        "Regime Analytics Engine — a governance layer that evaluates ethical, structural, and behavioral signals.",
        "Sentient Cents Framework — a value-routing system that assigns economic and credential weight to human-generated data.",
        "DeCrypt the Girl — a narrative OS that reframes lived experience as structured, provable system input.",
    ],
)

PROBLEM = (
    "Current AI systems lack structured human input beyond text and basic signals, "
    "governance-aware data frameworks, and mechanisms for capturing lived experience as "
    "usable data. The result is incomplete intelligence models, exploitative data systems, "
    "and loss of authorship and provenance."
)

SOLUTION = (
    "StagePort™ introduces a pre-model infrastructure layer that captures embodied and "
    "narrative input, structures it into auditable formats, and enables integration into "
    "AI, governance, and decision systems. Instead of extracting data from users, the "
    "system credentials human experience as data."
)

INNOVATION = (
    "This work treats human movement and narrative as computational input, creates a "
    "repeatable system rather than a one-off artwork, bridges choreography, AI, and "
    "governance into a single architecture, and introduces ethical scoring and value "
    "attribution at the data level."
)

PROOF = BulletSection(
    "Proof / traction",
    [
        "Live system architecture developed across StagePort™, PyRouette, Sentient Cents, and DeCrypt the Girl.",
        "Applied in real-world contexts spanning education, performance, and structured analysis.",
        "Demonstrated ability to translate non-technical human input into structured outputs.",
        "Founder has national media exposure and long-term authorship history in performance and systems thinking.",
    ],
)

USE_CASES = BulletSection(
    "Use cases",
    [
        "AI training data for embodied and behavioral datasets.",
        "Education and skill credentialing.",
        "Performance analytics.",
        "Ethical governance systems.",
        "Creative computation and narrative systems.",
        "Human-AI interaction design.",
    ],
)

WHY_NOW = (
    "AI systems are rapidly scaling without ethical grounding, human-centered data "
    "structures, or provenance tracking. StagePort™ addresses a critical gap by making "
    "human experience structured, provable, and valuable before AI consumes it."
)

FOUNDER = (
    "Allison Van Cura is a systems architect, choreographer, and writer building embodied "
    "intelligence infrastructure. Her background spans performance, language systems, and "
    "human-centered design, including prior leadership as a COO, national media exposure, "
    "and authorship of DeCrypt the Girl and Adaptive Ethics frameworks."
)

CLOSING_LINE = "Movement becomes data. Data becomes accountability. Accountability becomes freedom."


def build_styles() -> dict:
    """Create ReportLab styles with broad Unicode coverage."""

    pdfmetrics.registerFont(UnicodeCIDFont("HeiseiMin-W3"))
    styles = getSampleStyleSheet()
    styles.add(
        ParagraphStyle(
            name="PacketTitle",
            parent=styles["Title"],
            alignment=TA_CENTER,
            fontName="HeiseiMin-W3",
            leading=26,
            spaceAfter=10,
        )
    )
    styles.add(
        ParagraphStyle(
            name="SectionHeader",
            parent=styles["Heading2"],
            fontName="HeiseiMin-W3",
            leading=18,
            spaceBefore=10,
            spaceAfter=4,
        )
    )
    styles.add(
        ParagraphStyle(
            name="Body",
            parent=styles["BodyText"],
            fontName="HeiseiMin-W3",
            leading=15,
            spaceAfter=8,
        )
    )
    styles.add(
        ParagraphStyle(
            name="CenterStatement",
            parent=styles["Heading3"],
            alignment=TA_CENTER,
            fontName="HeiseiMin-W3",
            leading=18,
            spaceAfter=12,
        )
    )
    styles.add(
        ParagraphStyle(
            name="Closing",
            parent=styles["BodyText"],
            alignment=TA_CENTER,
            fontName="HeiseiMin-W3",
            leading=16,
            spaceBefore=12,
        )
    )
    return styles


def build_bullet_list(items: Iterable[str], styles: dict) -> ListFlowable:
    """Render a bullet list using the shared body style."""

    bullet_items = [ListItem(Paragraph(item, styles["Body"])) for item in items]
    return ListFlowable(bullet_items, bulletType="bullet", start="•", leftIndent=16)


def build_story(styles: dict) -> list:
    """Create the flowables that make up the PDF."""

    story: list = [
        Paragraph(TITLE, styles["PacketTitle"]),
        Paragraph("One-line summary", styles["SectionHeader"]),
        Paragraph(ONE_LINE_SUMMARY, styles["Body"]),
        Paragraph("Core statement", styles["SectionHeader"]),
        Paragraph(CORE_STATEMENT, styles["CenterStatement"]),
        Paragraph("Expanded description", styles["SectionHeader"]),
        Paragraph(EXPANDED_DESCRIPTION, styles["Body"]),
        Paragraph(SYSTEM_COMPONENTS.title, styles["SectionHeader"]),
        build_bullet_list(SYSTEM_COMPONENTS.bullets, styles),
        Spacer(1, 0.08 * inch),
        Paragraph("Problem", styles["SectionHeader"]),
        Paragraph(PROBLEM, styles["Body"]),
        Paragraph("Solution", styles["SectionHeader"]),
        Paragraph(SOLUTION, styles["Body"]),
        Paragraph("Innovation", styles["SectionHeader"]),
        Paragraph(INNOVATION, styles["Body"]),
        Paragraph(PROOF.title, styles["SectionHeader"]),
        build_bullet_list(PROOF.bullets, styles),
        Spacer(1, 0.08 * inch),
        Paragraph(USE_CASES.title, styles["SectionHeader"]),
        build_bullet_list(USE_CASES.bullets, styles),
        Spacer(1, 0.08 * inch),
        Paragraph("Why now", styles["SectionHeader"]),
        Paragraph(WHY_NOW, styles["Body"]),
        Paragraph("Founder", styles["SectionHeader"]),
        Paragraph(FOUNDER, styles["Body"]),
        Paragraph(CLOSING_LINE, styles["Closing"]),
    ]
    return story


def create_pdf(output_path: Path) -> Path:
    """Render the submission packet to the requested output path."""

    output_path.parent.mkdir(parents=True, exist_ok=True)
    styles = build_styles()
    doc = SimpleDocTemplate(
        str(output_path),
        pagesize=LETTER,
        leftMargin=0.8 * inch,
        rightMargin=0.8 * inch,
        topMargin=0.75 * inch,
        bottomMargin=0.75 * inch,
        title=TITLE,
        author="Allison Van Cura",
    )
    doc.build(build_story(styles))
    return output_path


def parse_args() -> argparse.Namespace:
    """Parse CLI arguments for the packet builder."""

    parser = argparse.ArgumentParser(description="Generate the StagePort submission packet as a PDF.")
    parser.add_argument(
        "--output",
        "-o",
        type=Path,
        default=DEFAULT_OUTPUT,
        help="Destination path for the generated PDF (directories will be created).",
    )
    return parser.parse_args()


def main() -> None:
    """Generate the PDF and report its location."""

    args = parse_args()
    pdf_path = create_pdf(args.output)
    print(f"Created StagePort submission packet at {pdf_path.resolve()}")


if __name__ == "__main__":
    main()
