#!/usr/bin/env python3
"""Generate timing reconciliation PDFs and an optional merged packet."""

from __future__ import annotations

import argparse
from pathlib import Path

from PyPDF2 import PdfMerger
from reportlab.lib import colors
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.platypus import Paragraph, SimpleDocTemplate, Spacer, Table, TableStyle


def build_pdf(path: Path, title: str, subtitle: str, blocks: list[dict], table: dict | None = None) -> None:
    """Create a one-page PDF with headers, body blocks, and an optional table."""
    path.parent.mkdir(parents=True, exist_ok=True)
    doc = SimpleDocTemplate(
        str(path),
        pagesize=letter,
        rightMargin=36,
        leftMargin=36,
        topMargin=36,
        bottomMargin=36,
    )
    styles = getSampleStyleSheet()
    styles.add(ParagraphStyle(name="Title", fontSize=14, leading=18, alignment=1, spaceAfter=8))
    styles.add(
        ParagraphStyle(
            name="Subtitle",
            fontSize=9,
            leading=12,
            alignment=1,
            textColor=colors.grey,
            spaceAfter=12,
        )
    )
    styles.add(ParagraphStyle(name="Heading", fontSize=10, leading=14, fontName="Helvetica-Bold", spaceBefore=8))
    styles.add(ParagraphStyle(name="Body", fontSize=9, leading=12))

    story = [Paragraph(title, styles["Title"]), Paragraph(subtitle, styles["Subtitle"])]

    for block in blocks:
        story.append(Paragraph(block["heading"], styles["Heading"]))
        story.append(Paragraph(block["text"], styles["Body"]))
        story.append(Spacer(1, 6))

    if table:
        tbl = Table(table["data"], colWidths=table.get("widths"))
        tbl.setStyle(TableStyle(table.get("style", [])))
        story.append(Spacer(1, 6))
        story.append(tbl)

    doc.build(story)


def build_heat_map(output_dir: Path) -> Path:
    path = output_dir / "Timing_Heat_Map_Missed_Deadlines_NYS_v1.pdf"
    blocks = [
        {
            "heading": "PURPOSE",
            "text": "Visualize where statutory or policy clocks accelerated, stalled, or conflicted across agencies.",
        }
    ]
    table = {
        "data": [
            ["System", "Clock", "Expected Window", "Observed Pattern", "Risk Level"],
            ["FOIL", "Acknowledgment", "<=5 business days", "Delayed / No date-certain", "High"],
            [
                "Housing",
                "Vacate / Arrears",
                "Accommodation required",
                "Hard deadline without accommodation",
                "High",
            ],
            ["ACP", "Breach Response", "Immediate remediation", "Lagged reliance on breached data", "Critical"],
            ["CPS", "Investigation", "<=60 days", "Escalation amid concurrent crises", "Medium-High"],
            ["Courts", "Service/Transmission", "Rule-bound windows", "Protected info transmission ambiguity", "Medium"],
        ],
        "widths": [90, 120, 110, 150, 60],
        "style": [
            ("GRID", (0, 0), (-1, -1), 0.5, colors.grey),
            ("BACKGROUND", (0, 0), (-1, 0), colors.whitesmoke),
            ("FONT", (0, 0), (-1, 0), "Helvetica-Bold"),
            ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ],
    }
    build_pdf(path, "TIMING HEAT MAP — MISSED & CONFLICTING CLOCKS", "Neutral · Visual Aid", blocks, table)
    return path


def build_event_mapping(output_dir: Path) -> Path:
    path = output_dir / "Event_to_Statutory_Clock_Mapping_NYS_v1.pdf"
    blocks = [{"heading": "METHOD", "text": "Map documented events to codified NYS clocks without interpretation."}]
    table = {
        "data": [
            ["Event", "Agency", "Clock", "Citation", "Status"],
            ["ACP breach disclosure", "DOS/Courts", "Immediate fail-safe", "Exec Law §108", "Unreconciled"],
            ["Housing vacate notice", "Housing Operator", "Accommodation analysis", "HUD/NYS admin", "Contested"],
            ["FOIL requests", "Multiple", "<=5 biz days ack", "POL §§84–90", "Active"],
            ["CPS escalation", "County DSS", "<=60 days complete", "SSL/OCFS", "Concurrent"],
            ["Service of records", "Courts", "Rule-bound service", "CPLR", "Ambiguous"],
        ],
        "widths": [120, 90, 110, 100, 90],
        "style": [
            ("GRID", (0, 0), (-1, -1), 0.5, colors.grey),
            ("BACKGROUND", (0, 0), (-1, 0), colors.whitesmoke),
            ("FONT", (0, 0), (-1, 0), "Helvetica-Bold"),
            ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ],
    }
    build_pdf(path, "EVENT → STATUTORY CLOCK MAPPING", "Record-Based · Non-Interpretive", blocks, table)
    return path


def build_appendix(output_dir: Path) -> Path:
    path = output_dir / "Timing_Reconciliation_Appendix_NYS_v1.pdf"
    blocks = [
        {
            "heading": "STATEMENT",
            "text": "This appendix identifies applicable NYS timing rules governing actions referenced in the record and notes where clocks required reconciliation.",
        },
        {
            "heading": "FOIL",
            "text": "Acknowledgment within 5 business days; date-certain required; silence is appealable.",
        },
        {
            "heading": "HOUSING",
            "text": "Hard deadlines must be accommodated where safety/protected status applies.",
        },
        {"heading": "ACP", "text": "Post-breach remediation is immediate; reliance on compromised data is unsound."},
        {
            "heading": "CPS",
            "text": "Investigation windows run concurrently with due-process safeguards.",
        },
        {"heading": "COURTS", "text": "Service and transmission windows establish knowledge and duty."},
    ]
    build_pdf(path, "TIMING RECONCILIATION APPENDIX", "One-Page · Neutral", blocks)
    return path


def merge_packet(output_dir: Path, base_packet: Path | None, packet_name: str, inputs: list[Path]) -> Path:
    output_path = output_dir / packet_name
    merger = PdfMerger()
    if base_packet:
        merger.append(str(base_packet))
    for input_path in inputs:
        merger.append(str(input_path))
    output_path.parent.mkdir(parents=True, exist_ok=True)
    merger.write(str(output_path))
    merger.close()
    return output_path


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Generate timing reconciliation PDFs.")
    parser.add_argument(
        "--output-dir",
        default="./dist",
        help="Destination directory for generated PDFs.",
    )
    parser.add_argument(
        "--base-packet",
        help="Optional base PDF to prepend before the timing packet.",
    )
    parser.add_argument(
        "--merged-name",
        default="Record_Integrity_Spine_AVC_MASTER_PACKET_v3_TIMING.pdf",
        help="Filename for the merged PDF packet.",
    )
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    output_dir = Path(args.output_dir)
    base_packet = Path(args.base_packet) if args.base_packet else None

    appendix = build_appendix(output_dir)
    event_mapping = build_event_mapping(output_dir)
    heat_map = build_heat_map(output_dir)

    merge_packet(output_dir, base_packet, args.merged_name, [appendix, event_mapping, heat_map])


if __name__ == "__main__":
    main()
