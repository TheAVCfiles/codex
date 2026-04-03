"""Generate StagePort evaluation sales assets.

Outputs:
- Multi-page evaluation report PDF
- Credential certificate PDF
- One-page HTML landing page

This script is intentionally lightweight so the assets can be produced quickly
for same-day sales outreach.
"""

from __future__ import annotations

import argparse
import hashlib
from dataclasses import dataclass
from datetime import UTC, datetime
from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.pagesizes import LETTER
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import inch
from reportlab.platypus import (
    PageBreak,
    Paragraph,
    SimpleDocTemplate,
    Spacer,
    Table,
    TableStyle,
)

DEFAULT_REPORT_ID = "SP-2026-001"


@dataclass(frozen=True)
class EvaluationMeta:
    system_name: str
    submitted_by: str
    organization: str
    report_id: str
    date_label: str


def _styles() -> dict[str, ParagraphStyle]:
    sample = getSampleStyleSheet()
    return {
        "title": ParagraphStyle(
            "title",
            parent=sample["Title"],
            fontName="Times-Bold",
            fontSize=28,
            leading=34,
            textColor=colors.black,
            spaceAfter=16,
        ),
        "h1": ParagraphStyle(
            "h1",
            parent=sample["Heading1"],
            fontName="Times-Bold",
            fontSize=19,
            leading=24,
            textColor=colors.black,
            spaceAfter=10,
        ),
        "h2": ParagraphStyle(
            "h2",
            parent=sample["Heading2"],
            fontName="Times-Bold",
            fontSize=14,
            leading=18,
            spaceAfter=6,
        ),
        "body": ParagraphStyle(
            "body",
            parent=sample["BodyText"],
            fontName="Times-Roman",
            fontSize=12,
            leading=16,
            textColor=colors.HexColor("#121212"),
        ),
        "small": ParagraphStyle(
            "small",
            parent=sample["BodyText"],
            fontName="Times-Roman",
            fontSize=10.5,
            leading=14,
            textColor=colors.HexColor("#303030"),
        ),
    }


def _report_story(meta: EvaluationMeta, verify_url: str, digest: str) -> list:
    styles = _styles()
    story: list = []

    # PAGE 1 — COVER
    story.extend(
        [
            Paragraph("StagePort™ Evaluation Report", styles["title"]),
            Paragraph("Structured System Assessment + Credential Review", styles["h2"]),
            Spacer(1, 0.35 * inch),
            Paragraph(f"<b>System Name:</b> {meta.system_name}", styles["body"]),
            Paragraph(f"<b>Submitted By:</b> {meta.submitted_by}", styles["body"]),
            Paragraph(f"<b>Organization:</b> {meta.organization}", styles["body"]),
            Paragraph(f"<b>Date:</b> {meta.date_label}", styles["body"]),
            Paragraph(f"<b>Evaluation ID:</b> {meta.report_id}", styles["body"]),
            PageBreak(),
        ]
    )

    # PAGE 2 — EXECUTIVE SUMMARY
    story.extend(
        [
            Paragraph("Executive Summary", styles["h1"]),
            Paragraph(
                "This system was evaluated across five core dimensions: conceptual "
                "integrity, boundary discipline, implementation plausibility, governance "
                "safety, and clarity of communication.",
                styles["body"],
            ),
            Spacer(1, 0.25 * inch),
            Paragraph("<b>Final Result:</b>", styles["h2"]),
            Paragraph("• Score: 21.8 / 25", styles["body"]),
            Paragraph("• Tier: STRONG SIGNAL", styles["body"]),
            Paragraph("• Credential Level: GOLD", styles["body"]),
            PageBreak(),
        ]
    )

    # PAGE 3 — SCORING TABLE
    story.append(Paragraph("Scoring Table", styles["h1"]))
    table = Table(
        [
            ["Dimension", "Score", "Weight"],
            ["Conceptual Integrity", "4", "1.0"],
            ["Boundary Discipline", "5", "1.5"],
            ["Implementation", "4", "1.0"],
            ["Governance", "4", "1.3"],
            ["Clarity", "4", "1.0"],
        ],
        colWidths=[3.2 * inch, 1.1 * inch, 1.1 * inch],
    )
    table.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#D4AF37")),
                ("TEXTCOLOR", (0, 0), (-1, 0), colors.black),
                ("FONTNAME", (0, 0), (-1, 0), "Times-Bold"),
                ("FONTNAME", (0, 1), (-1, -1), "Times-Roman"),
                ("GRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#333333")),
                ("LEFTPADDING", (0, 0), (-1, -1), 8),
                ("RIGHTPADDING", (0, 0), (-1, -1), 8),
                ("TOPPADDING", (0, 0), (-1, -1), 6),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
            ]
        )
    )
    story.extend([table, Spacer(1, 0.25 * inch), Paragraph("<b>Weighted Total: 21.8</b>", styles["body"]), PageBreak()])

    # PAGE 4 — RISK FLAGS
    story.extend(
        [
            Paragraph("Risk Flags", styles["h1"]),
            Paragraph("No critical risk flags identified.", styles["body"]),
            PageBreak(),
        ]
    )

    # PAGE 5 — QUALITATIVE ANALYSIS
    story.extend(
        [
            Paragraph("Qualitative Analysis", styles["h1"]),
            Paragraph("Strongest Point", styles["h2"]),
            Paragraph(
                "The system demonstrates unusually strong boundary discipline, with clear "
                "separation between conceptual layer and execution layer — reducing ambiguity "
                "in real-world deployment.",
                styles["body"],
            ),
            Spacer(1, 0.12 * inch),
            Paragraph("Weakest Point", styles["h2"]),
            Paragraph(
                "Phase II implementation dependencies are implied but not operationalized, "
                "creating potential friction under scale conditions.",
                styles["body"],
            ),
            Spacer(1, 0.12 * inch),
            Paragraph("Break Analysis", styles["h2"]),
            Paragraph(
                "The system is most vulnerable at the point of credential interpretation — "
                "specifically where external parties may overextend its validated scope.",
                styles["body"],
            ),
            PageBreak(),
        ]
    )

    # PAGE 6 — TRUST SCOPE
    story.extend(
        [
            Paragraph("Trust Scope", styles["h1"]),
            Paragraph("• Investors ✅", styles["body"]),
            Paragraph("• Institutions ✅", styles["body"]),
            Paragraph("• General public ⚠️", styles["body"]),
            PageBreak(),
        ]
    )

    # PAGE 7 — FOOTER BLOCK
    story.extend(
        [
            Paragraph("Footer Block", styles["h1"]),
            Paragraph("Reviewed under StagePort™ Evaluation Framework", styles["body"]),
            Spacer(1, 0.08 * inch),
            Paragraph("Issuer: Global AVC Systems, Inc.", styles["body"]),
            Paragraph("Architect: Allison Van Cura", styles["body"]),
            Spacer(1, 0.08 * inch),
            Paragraph(f"Report ID: {meta.report_id}", styles["body"]),
            Paragraph(f"Credential ID: STAGEPORT-EVAL-2026-001", styles["body"]),
            Paragraph(f"Verify: {verify_url}", styles["body"]),
            Paragraph(f"Hash: {digest}", styles["small"]),
            Paragraph(f"Timestamp: {meta.date_label}", styles["body"]),
        ]
    )
    return story


def _credential_story(meta: EvaluationMeta, digest: str) -> list:
    styles = _styles()
    return [
        Paragraph("StagePort™ Credential Certificate", styles["title"]),
        Spacer(1, 0.25 * inch),
        Paragraph("This certifies that", styles["body"]),
        Spacer(1, 0.06 * inch),
        Paragraph(f"<b>{meta.system_name}</b>", styles["h1"]),
        Paragraph(f"submitted by <b>{meta.submitted_by} / {meta.organization}</b>", styles["body"]),
        Spacer(1, 0.08 * inch),
        Paragraph("has been evaluated under the StagePort Framework", styles["body"]),
        Paragraph("and issued a <b>GOLD</b> credential", styles["body"]),
        Spacer(1, 0.4 * inch),
        Paragraph(f"Credential ID: STAGEPORT-EVAL-2026-001", styles["body"]),
        Paragraph(f"Date: {meta.date_label}", styles["body"]),
        Paragraph("Signature: Allison Van Cura", styles["body"]),
        Paragraph(f"Hash: {digest}", styles["small"]),
    ]


def build_landing_page(output_path: Path) -> None:
    html = """<!doctype html>
<html lang=\"en\">
<head>
  <meta charset=\"utf-8\" />
  <meta name=\"viewport\" content=\"width=device-width,initial-scale=1\" />
  <title>StagePort Evaluation</title>
  <style>
    :root { --bg:#111111; --paper:#f8f5ef; --gold:#d4af37; --text:#141414; }
    body { margin:0; background:var(--bg); font-family: Georgia, 'Times New Roman', serif; }
    main { max-width: 860px; margin: 2rem auto; background: var(--paper); color: var(--text); padding: 2.2rem; }
    h1,h2 { margin:0 0 .8rem 0; }
    h1 { font-size: 2rem; }
    p,li { line-height: 1.45; }
    section { margin-top: 1.6rem; }
    .cta { display:inline-block; background:var(--gold); color:#111; padding:.7rem 1rem; text-decoration:none; font-weight:700; }
    .tag { color:#6e5a10; font-weight:700; }
  </style>
</head>
<body>
  <main>
    <h1>Turn Your System Into Something Investors Take Seriously</h1>
    <p>Structured evaluation → formal report → credential + verification layer</p>
    <p><a class=\"cta\" href=\"#\">Start Evaluation — $2,000</a></p>

    <section>
      <h2>What This Is</h2>
      <p>Most systems get ignored because they lack structure, proof, and positioning. This process turns what you built into something credible, reviewable, and usable in real conversations.</p>
    </section>

    <section>
      <h2>What You Get</h2>
      <ul>
        <li>Structured evaluation (5 dimensions)</li>
        <li>Formal score report (PDF)</li>
        <li>Credential certificate</li>
        <li>Verification hash (proof layer)</li>
      </ul>
    </section>

    <section>
      <h2>How It Works</h2>
      <ol>
        <li>Pay + onboard</li>
        <li>Submit your system</li>
        <li>Structured evaluation</li>
        <li>Receive report + credential</li>
      </ol>
    </section>

    <section>
      <h2>Pricing</h2>
      <p><span class=\"tag\">Standard Evaluation — $2,000</span></p>
      <ul>
        <li>Full scoring</li>
        <li>Report</li>
        <li>Credential</li>
        <li>Hash proof</li>
      </ul>
      <p><a class=\"cta\" href=\"#\">Start Evaluation</a></p>
    </section>

    <section>
      <h2>Positioning</h2>
      <p>This is not feedback.</p>
      <p>This is formal evaluation + positioning.</p>
      <p>If you’re trying to be taken seriously, this changes how people respond to what you built.</p>
    </section>

    <section>
      <h2>Ready to formalize your system?</h2>
      <p><a class=\"cta\" href=\"#\">Start Evaluation</a></p>
    </section>
  </main>
</body>
</html>
"""
    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_text(html, encoding="utf-8")


def generate_assets(output_dir: Path, meta: EvaluationMeta) -> None:
    output_dir.mkdir(parents=True, exist_ok=True)
    payload = f"{meta.system_name}|{meta.submitted_by}|{meta.organization}|{meta.report_id}|{meta.date_label}"
    digest = hashlib.sha256(payload.encode("utf-8")).hexdigest()

    report_path = output_dir / "StagePort_Evaluation_Report.pdf"
    credential_path = output_dir / "StagePort_Credential_Certificate.pdf"
    landing_path = output_dir / "stageport_landing.html"
    verify_url = f"stageport.co/verify/STAGEPORT-EVAL-2026-001"

    report_doc = SimpleDocTemplate(
        str(report_path),
        pagesize=LETTER,
        leftMargin=0.9 * inch,
        rightMargin=0.9 * inch,
        topMargin=0.95 * inch,
        bottomMargin=0.95 * inch,
    )
    report_doc.build(_report_story(meta, verify_url=verify_url, digest=digest))

    credential_doc = SimpleDocTemplate(
        str(credential_path),
        pagesize=LETTER,
        leftMargin=0.9 * inch,
        rightMargin=0.9 * inch,
        topMargin=1.0 * inch,
        bottomMargin=1.0 * inch,
    )
    credential_doc.build(_credential_story(meta, digest=digest))

    build_landing_page(landing_path)

    print(f"Created report: {report_path}")
    print(f"Created credential: {credential_path}")
    print(f"Created landing page: {landing_path}")


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Generate StagePort sales assets.")
    parser.add_argument("--output-dir", type=Path, default=Path("dist/stageport_offer"))
    parser.add_argument("--system-name", default="Sample System")
    parser.add_argument("--submitted-by", default="Sample Name")
    parser.add_argument("--organization", default="Sample Organization")
    parser.add_argument("--report-id", default=DEFAULT_REPORT_ID)
    parser.add_argument(
        "--date",
        default=datetime.now(UTC).strftime("%B %d, %Y"),
        help="Display date label for the documents.",
    )
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    meta = EvaluationMeta(
        system_name=args.system_name,
        submitted_by=args.submitted_by,
        organization=args.organization,
        report_id=args.report_id,
        date_label=args.date,
    )
    generate_assets(args.output_dir, meta)


if __name__ == "__main__":
    main()
