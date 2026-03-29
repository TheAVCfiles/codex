from reportlab.lib import colors
from reportlab.lib.pagesizes import LETTER
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, ListFlowable, ListItem

OUTPUT_PATH = "project/output/stageport_crest_system_plan.pdf"

styles = getSampleStyleSheet()

TITLE = ParagraphStyle(
    "TitleCustom",
    parent=styles["Title"],
    fontName="Helvetica-Bold",
    fontSize=20,
    textColor=colors.HexColor("#0B1F2A"),
    spaceAfter=14,
)

H2 = ParagraphStyle(
    "H2",
    parent=styles["Heading2"],
    fontName="Helvetica-Bold",
    fontSize=13,
    textColor=colors.HexColor("#0B1F2A"),
    spaceBefore=8,
    spaceAfter=6,
)

BODY = ParagraphStyle(
    "Body",
    parent=styles["BodyText"],
    fontName="Helvetica",
    fontSize=10.5,
    leading=14,
)


def bullet(items):
    return ListFlowable(
        [ListItem(Paragraph(i, BODY), leftIndent=10) for i in items],
        bulletType="bullet",
        leftIndent=18,
        bulletFontName="Helvetica",
        bulletFontSize=8,
        spaceAfter=8,
    )


def build_pdf(path: str = OUTPUT_PATH) -> None:
    doc = SimpleDocTemplate(
        path,
        pagesize=LETTER,
        leftMargin=50,
        rightMargin=50,
        topMargin=50,
        bottomMargin=50,
        title="StagePort / Crest Network Plan",
        author="Syvaq / StagePort",
    )

    story = [
        Paragraph("StagePort / Crest Network — System Plan", TITLE),
        Paragraph("Prepared: March 28, 2026 (ET)", BODY),
        Spacer(1, 10),

        Paragraph("1) Core Concept", H2),
        Paragraph(
            "The Crest Network is a governed access layer for founders operating inside the "
            "StagePort system. Identity, contribution, and authority are formalized into "
            "credentialed artifacts.",
            BODY,
        ),
        Paragraph("Short version: Not a community. A credentialed system.", BODY),

        Paragraph("2) Crest ID System", H2),
        Paragraph("ID format: <b>CRST-[YEAR]-[CLIENTCODE]-[LEVEL]</b> (example: CRST-2026-SYV-L2)", BODY),
        Paragraph("Required profile fields:", BODY),
        bullet([
            "Identity Layer — Name, Company, Role, Entry Date",
            "System Status — Tier (L1-L4), Corridor (Teach / Invest / Build), Active Phase (1/2/3)",
            "Contribution Ledger — Sessions completed, key outputs, decisions logged",
            "Authority Markers — Corridors assigned, ownership lanes, decision scope",
            "Financial Layer — Entry investment, investment tier, optional capital unlocked",
        ]),

        Paragraph("3) Tier Architecture", H2),
        bullet([
            "L1 Initiate — Paid entry ($2.5K), observing and evaluating, no authority",
            "L2 Active Builder — Phase 2 paid ($7.5K-$12K), structured work starts, outputs logged",
            "L3 Crest Holder — Verified outputs, authority in defined lanes, visible in system",
            "L4 Inner Network — Institutional layer, deal access, licensing/expansion",
        ]),

        Paragraph("4) Visual Crest Spec", H2),
        bullet([
            "Shape: Shield/Crest",
            "Tier Colors: L1 muted gray-blue, L2 navy + gold accent, L3 gold + white, L4 black + gold",
            "Corridor Icons: Teach (book), Invest (upward triangle), Build (gear)",
            "Badge Example: CRST-2026-SYV-L2 / BUILD CORRIDOR / ACTIVE BUILDER",
        ]),

        Paragraph("5) Dossier + Dashboard Integration", H2),
        bullet([
            "Add dossier section: 'System Position Assignment' at Phase II activation",
            "Lily assignment: CRST-2026-SYV-L2, Tier Active Builder, Corridor Build, Status Activated",
            "Dashboard block: Crest ID, Tier, Corridor, Phase, Ledger Entries, 'View Crest Record' CTA",
        ]),

        Paragraph("6) Public Website Copy", H2),
        Paragraph("Headline: <b>A Credentialed Founder Network</b>", BODY),
        Paragraph(
            "Body: The Crest Network is a governed access layer for founders building inside "
            "the StagePort system. Participation is structured, recorded, and tied to real output.",
            BODY,
        ),
        Paragraph("Buttons: Request Access / Begin Triage", BODY),

        Paragraph("7) Immediate To-Do List", H2),
        bullet([
            "Build Lily crest badge (visual + PDF)",
            "Insert Crest assignment into Phase 2 dossier",
            "Update landing page section with Crest copy",
            "Wire payment + activation + crest assignment workflow",
            "Begin pipeline of first 3 Crest holders",
        ]),
    ]

    doc.build(story)


if __name__ == "__main__":
    build_pdf()
    print(f"Generated {OUTPUT_PATH}")
