"""Generate the AVC Welcome Stack PDFs.

Creates:
- AVC_Founder_Reality_Kit_Templates.pdf (#2)
- AVC_Governance_Primer.pdf (#3)

Optional:
- AVC_Welcome_Founder_Reality_Kit.pdf (#1) when --include-welcome is passed.
"""
from __future__ import annotations

import argparse
from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.pagesizes import LETTER
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.platypus import PageBreak, Paragraph, SimpleDocTemplate, Spacer, Table, TableStyle


FILE2 = "AVC_Founder_Reality_Kit_Templates.pdf"
FILE3 = "AVC_Governance_Primer.pdf"
WELCOME_FILE = "AVC_Welcome_Founder_Reality_Kit.pdf"


def build_styles() -> dict:
    styles = getSampleStyleSheet()
    styles.add(ParagraphStyle(name="Header", fontSize=16, spaceAfter=14, leading=20))
    styles.add(ParagraphStyle(name="SubHeader", fontSize=12, spaceAfter=10, leading=15))
    styles.add(ParagraphStyle(name="Body", fontSize=10.5, spaceAfter=10, leading=15))
    return styles


def build_doc(path: Path) -> SimpleDocTemplate:
    path.parent.mkdir(parents=True, exist_ok=True)
    return SimpleDocTemplate(
        str(path),
        pagesize=LETTER,
        rightMargin=54,
        leftMargin=54,
        topMargin=54,
        bottomMargin=54,
    )


def build_templates_pdf(output_path: Path, styles: dict) -> Path:
    doc = build_doc(output_path)
    story = []

    story.append(Paragraph("AVC Founder Reality Kit", styles["Header"]))
    story.append(Paragraph("Templates to turn intent into structure.", styles["Body"]))
    story.append(PageBreak())

    story.append(Paragraph("1. Founder Declaration", styles["Header"]))
    story.append(
        Paragraph(
            "I, ____________________, declare authorship and responsibility for the work described below.",
            styles["Body"],
        )
    )
    story.append(Paragraph("What I am building:<br/>Why it exists:<br/>What it is not:", styles["Body"]))
    story.append(Paragraph("Signature: ____________________   Date: ____________", styles["Body"]))
    story.append(PageBreak())

    story.append(Paragraph("2. Corridor Assignment", styles["Header"]))
    table = Table(
        [["Person", "Corridor", "Authority", "KPIs", "Review Cycle"], ["", "", "", "", ""]],
        colWidths=[80, 100, 120, 80, 80],
    )
    table.setStyle(
        TableStyle(
            [
                ("GRID", (0, 0), (-1, -1), 1, colors.black),
                ("BACKGROUND", (0, 0), (-1, 0), colors.lightgrey),
            ]
        )
    )
    story.append(table)
    story.append(PageBreak())

    story.append(Paragraph("3. Weekly Founder Log", styles["Header"]))
    story.append(
        Paragraph(
            "What moved the company forward?<br/>What drained energy?<br/>What decision is avoided?",
            styles["Body"],
        )
    )

    doc.build(story)
    return output_path


def build_governance_primer_pdf(output_path: Path, styles: dict) -> Path:
    doc = build_doc(output_path)
    story = []

    story.append(Paragraph("AVC Governance Primer", styles["Header"]))
    story.append(Paragraph("A plain-language guide to how this company stays clean.", styles["Body"]))
    story.append(PageBreak())

    story.append(Paragraph("The Rule", styles["Header"]))
    story.append(Paragraph("Responsibility and equity are aligned. No exceptions.", styles["Body"]))
    story.append(PageBreak())

    story.append(Paragraph("Decision-Making", styles["Header"]))
    story.append(
        Paragraph(
            "Decisions live inside corridors. Authority follows responsibility.",
            styles["Body"],
        )
    )
    story.append(PageBreak())

    story.append(Paragraph("IP Ownership", styles["Header"]))
    story.append(
        Paragraph(
            "IP is owned by AVC IP HOLDINGS LLC. Operating companies receive licenses.",
            styles["Body"],
        )
    )

    doc.build(story)
    return output_path


def build_welcome_pdf(output_path: Path, styles: dict) -> Path:
    doc = build_doc(output_path)
    story = []

    story.append(Paragraph("Welcome to AVC", styles["Header"]))
    story.append(
        Paragraph(
            "This is not an accelerator. It is not a hustle lab. It is not a vibes-based incubator.<br/><br/>"
            "This is a governed studio for founders who want to build something real without losing themselves, "
            "their authorship, or their future.",
            styles["Body"],
        )
    )
    story.append(Spacer(1, 20))
    story.append(Paragraph("AVC Founder Reality Kit", styles["SubHeader"]))
    story.append(PageBreak())

    story.append(Paragraph("A Letter from AVC", styles["Header"]))
    story.append(
        Paragraph(
            "You are here because something you are building matters enough to protect.<br/><br/>"
            "Most founders are taught to move fast by erasing memory: undocumented decisions, "
            "unclear ownership, fuzzy authority, and emotional equity deals that feel fine until they fail.<br/><br/>"
            "We do the opposite. We build memory first so growth does not destroy the people inside it.",
            styles["Body"],
        )
    )
    story.append(
        Paragraph(
            "Working with AVC means clarity before comfort. It means responsibility paired with authority. "
            "It means authorship is respected, provenance is documented, and no one disappears into chaos or gets "
            "dragged by speed.<br/><br/>"
            "This kit is not bureaucracy. It is a stabilizer. Use it lightly, but use it honestly.",
            styles["Body"],
        )
    )
    story.append(PageBreak())

    story.append(Paragraph("What This Studio Is", styles["Header"]))
    story.append(
        Paragraph(
            "• A place where equity means responsibility<br/>"
            "• A place where IP is protected before it is monetized<br/>"
            "• A place where governance exists to preserve humans, not control them<br/>"
            "• A place where clarity is kindness",
            styles["Body"],
        )
    )
    story.append(PageBreak())

    story.append(Paragraph("What This Studio Is Not", styles["Header"]))
    story.append(
        Paragraph(
            "• We are not optimizing for virality<br/>"
            "• We are not building at the expense of nervous systems<br/>"
            "• We are not extracting unpaid emotional labor<br/>"
            "• We are not confusing proximity with ownership",
            styles["Body"],
        )
    )
    story.append(PageBreak())

    story.append(Paragraph("How to Use This Kit", styles["Header"]))
    story.append(
        Paragraph(
            "You do not need to complete everything at once. Start with what brings relief.<br/><br/>"
            "1. Read the governance principle.<br/>"
            "2. Write your Founder Declaration.<br/>"
            "3. Assign corridors honestly.<br/>"
            "4. Keep a light weekly log.<br/><br/>"
            "The goal is not perfection. The goal is to never have to guess what you agreed to.",
            styles["Body"],
        )
    )

    doc.build(story)
    return output_path


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Generate AVC Welcome Stack PDFs.")
    parser.add_argument(
        "--output-dir",
        type=Path,
        default=Path("/mnt/data"),
        default=Path("./output"),
    )
    parser.add_argument(
        "--include-welcome",
        action="store_true",
        help=f"Also generate {WELCOME_FILE} (#1).",
    )
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    styles = build_styles()
    outputs = [
        build_templates_pdf(args.output_dir / FILE2, styles),
        build_governance_primer_pdf(args.output_dir / FILE3, styles),
    ]
    if args.include_welcome:
        outputs.append(build_welcome_pdf(args.output_dir / WELCOME_FILE, styles))

    for output in outputs:
        print(output)


if __name__ == "__main__":
    main()
