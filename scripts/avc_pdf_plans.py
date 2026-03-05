"""Generate AVC planning PDFs using ReportLab Platypus.

Outputs:
- AVC_Rapid_Stabilization_Action_Plan.pdf
- AVC_30_Day_Income_Sprint_Plan.pdf
- AVC_DOJ_Civil_Rights_Complaint_Submission.pdf
"""

from __future__ import annotations

from pathlib import Path

from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.lib.units import inch
from reportlab.platypus import ListFlowable, ListItem, PageBreak, Paragraph, SimpleDocTemplate, Spacer


def _bullets(items: list[str], style: "ParagraphStyle"):
    return ListFlowable([ListItem(Paragraph(item, style)) for item in items], bulletType="bullet")


def build_rapid_stabilization_plan(output_dir: Path) -> Path:
    file_path = output_dir / "AVC_Rapid_Stabilization_Action_Plan.pdf"
    doc = SimpleDocTemplate(str(file_path), pagesize=letter)
    elements = []

    styles = getSampleStyleSheet()
    title_style = styles["Heading1"]
    section_style = styles["Heading2"]
    normal_style = styles["Normal"]

    elements.append(Paragraph("AVC Rapid Stabilization & Escalation Action Plan", title_style))
    elements.append(Spacer(1, 0.3 * inch))

    elements.append(Paragraph("Phase 1: Immediate Cash Flow Stabilization (0–14 Days)", section_style))
    elements.append(Spacer(1, 0.2 * inch))

    phase1_tasks = [
        "Register / Update profile on GLG, Guidepoint, AlphaSights, NewtonX (expert network consulting).",
        "Apply to Scale AI, Surge AI, Outlier, Invisible Technologies for higher-tier evaluator roles.",
        "Create one-page service pitch for ML evaluation, data annotation auditing, AI bias analysis.",
        "Set up Stripe + simple invoice template for direct consulting.",
        "Send 10 targeted outreach emails to ML / AI ethics / data ops contacts.",
    ]

    elements.append(_bullets(phase1_tasks, normal_style))
    elements.append(Spacer(1, 0.4 * inch))

    elements.append(
        Paragraph(
            "Phase 2: Wage Theft / IRS Whistleblower Path (Documentation First)",
            section_style,
        )
    )
    elements.append(Spacer(1, 0.2 * inch))

    phase2_tasks = [
        "Compile clean index of wage discrepancies (dates, amounts, evidence).",
        "File complaint with U.S. Department of Labor (WHD) if wage theft confirmed.",
        "If tax fraud evidence exists, prepare Form 211 for IRS Whistleblower Office.",
        "Consult whistleblower attorney (confidential intake) before submission if possible.",
        "Preserve evidence with timestamped backups (local + encrypted cloud).",
    ]

    elements.append(_bullets(phase2_tasks, normal_style))
    elements.append(Spacer(1, 0.4 * inch))

    elements.append(
        Paragraph(
            "Phase 3: Federal Oversight Escalation (After Cash Stabilizes)",
            section_style,
        )
    )
    elements.append(Spacer(1, 0.2 * inch))

    phase3_tasks = [
        "Draft 1-page factual summary (no narrative, only dates, statutes, violations).",
        "Submit complaint to HHS Office for Civil Rights if ACP privacy breach occurred.",
        "Submit complaint to DOJ Civil Rights Division if due process violations occurred.",
        "File complaint with appropriate Office of Inspector General (OIG).",
        "Submit federal constituent complaint via U.S. House or Senate office portal.",
    ]

    elements.append(_bullets(phase3_tasks, normal_style))
    elements.append(Spacer(1, 0.4 * inch))

    elements.append(Paragraph("Operational Rules", section_style))
    elements.append(Spacer(1, 0.2 * inch))

    rules = [
        "Do not escalate multiple fronts simultaneously without cash buffer.",
        "Separate emotional processing from documentation drafting.",
        "Every escalation must be written, indexed, and backed by evidence.",
        "Preserve bandwidth: income first, retaliation channels second.",
    ]

    elements.append(_bullets(rules, normal_style))

    doc.build(elements)
    return file_path


def build_30_day_income_sprint(output_dir: Path) -> Path:
    file_path = output_dir / "AVC_30_Day_Income_Sprint_Plan.pdf"
    doc = SimpleDocTemplate(str(file_path), pagesize=letter)
    elements = []

    styles = getSampleStyleSheet()
    title_style = styles["Heading1"]
    section_style = styles["Heading2"]
    normal_style = styles["Normal"]

    elements.append(Paragraph("AVC 30-Day Income Sprint Plan", title_style))
    elements.append(Spacer(1, 0.3 * inch))

    elements.append(Paragraph("Week 1: Infrastructure + Positioning", section_style))
    elements.append(Spacer(1, 0.2 * inch))
    week1 = [
        "Create 1-page capability sheet (ML evaluation, data annotation auditing, AI bias analysis).",
        "Update LinkedIn headline to: ML Evaluation & Systems Integrity Consultant.",
        "Register with GLG, Guidepoint, AlphaSights, NewtonX (expert networks).",
        "Apply to Scale AI, Surge AI, Outlier, Invisible Technologies (higher-tier roles).",
        "Set up Stripe + invoice template for direct contracts.",
        "Send 5 direct outreach emails to ML / AI ethics contacts.",
    ]
    elements.append(_bullets(week1, normal_style))
    elements.append(PageBreak())

    elements.append(Paragraph("Week 2: Activation + Cash Flow Initiation", section_style))
    elements.append(Spacer(1, 0.2 * inch))
    week2 = [
        "Follow up on expert network applications.",
        "Accept first paid expert call (target: $150–$300/hour).",
        "Pitch 3 companies directly for short-term evaluation contracts.",
        "Create Upwork profile focused on AI model auditing.",
        "Secure first small contract (even if modest).",
    ]
    elements.append(_bullets(week2, normal_style))
    elements.append(PageBreak())

    elements.append(Paragraph("Week 3: Momentum + Reputation", section_style))
    elements.append(Spacer(1, 0.2 * inch))
    week3 = [
        "Complete first contract deliverable with precision.",
        "Request testimonial (if appropriate).",
        "Increase outreach to 10 new prospects.",
        "Refine pitch based on call feedback.",
        "Raise rate slightly for new engagements.",
    ]
    elements.append(_bullets(week3, normal_style))
    elements.append(PageBreak())

    elements.append(Paragraph("Week 4: Stabilization + Buffer Building", section_style))
    elements.append(Spacer(1, 0.2 * inch))
    week4 = [
        "Secure recurring micro-contract (retainer or repeat evaluation).",
        "Aim for minimum $2,000–$4,000 cash inflow target.",
        "Create 2-week financial buffer plan.",
        "Begin whistleblower / oversight documentation once income stabilizes.",
        "Avoid new escalations until cash buffer exists.",
    ]
    elements.append(_bullets(week4, normal_style))

    doc.build(elements)
    return file_path


def build_doj_civil_rights_submission(output_dir: Path) -> Path:
    file_path = output_dir / "AVC_DOJ_Civil_Rights_Complaint_Submission.pdf"
    doc = SimpleDocTemplate(str(file_path), pagesize=letter)
    elements = []

    styles = getSampleStyleSheet()
    title_style = styles["Heading1"]
    section_style = styles["Heading2"]
    normal_style = styles["Normal"]

    elements.append(Paragraph("U.S. Department of Justice – Civil Rights Division Complaint", title_style))
    elements.append(Spacer(1, 0.3 * inch))

    elements.append(Paragraph("Complainant: Allison Van Cura", normal_style))
    elements.append(Paragraph("Jurisdiction: New York", normal_style))
    elements.append(Spacer(1, 0.3 * inch))

    elements.append(Paragraph("Nature of Complaint", section_style))
    elements.append(Spacer(1, 0.2 * inch))

    nature_points = [
        "Due Process Concern",
        "Retaliatory Enforcement Pattern",
        "Confidentiality / Safety Exposure (ACP)",
        "Potential Civil Rights Violation Under Color of Law",
    ]

    elements.append(_bullets(nature_points, normal_style))
    elements.append(Spacer(1, 0.4 * inch))

    elements.append(Paragraph("Summary of Concern", section_style))
    elements.append(Spacer(1, 0.2 * inch))

    summary_text = (
        "I am an active participant in the New York Address Confidentiality Program (ACP) "
        "with a valid Order of Protection. I allege repeated improper handling and/or "
        "disclosure of protected address information by state-connected agencies despite known "
        "safety risks. I have submitted written requests for corrective clarification without "
        "adequate remedial response. The agencies involved receive federal funding and are "
        "subject to federal civil rights compliance requirements. I am requesting review of "
        "whether due process protections, VAWA confidentiality provisions, and federally funded "
        "agency compliance standards have been violated."
    )
    elements.append(Paragraph(summary_text, normal_style))
    elements.append(Spacer(1, 0.4 * inch))

    elements.append(Paragraph("Key Facts (Chronological)", section_style))
    elements.append(Spacer(1, 0.2 * inch))

    facts = [
        "Active ACP enrollment and valid Order of Protection documented.",
        "Instance(s) of protected address disclosure or improper procedural handling identified.",
        "Written clarification and corrective requests submitted to relevant agency personnel.",
        "Insufficient or incomplete remedial action received.",
        "Agency connected to federal funding streams subject to compliance oversight.",
        "Ongoing safety exposure concerns due to proximity of restrained party.",
    ]

    elements.append(_bullets(facts, normal_style))
    elements.append(Spacer(1, 0.4 * inch))

    elements.append(Paragraph("Federal Interest & Statutory Framework", section_style))
    elements.append(Spacer(1, 0.2 * inch))

    statutes = [
        "42 U.S.C. §1983 – Deprivation of Rights Under Color of Law",
        "VAWA Confidentiality Provisions",
        "Federal Funding Compliance Obligations",
        "Civil Rights Enforcement Standards",
    ]

    elements.append(_bullets(statutes, normal_style))
    elements.append(Spacer(1, 0.4 * inch))

    elements.append(Paragraph("Requested Action", section_style))
    elements.append(Spacer(1, 0.2 * inch))

    requests = [
        "Formal compliance review and investigation as warranted.",
        "Immediate preservation of records relevant to ACP handling and disclosure.",
        "Written acknowledgment of complaint receipt.",
        "Determination of corrective safeguards if violations are identified.",
    ]

    elements.append(_bullets(requests, normal_style))

    doc.build(elements)
    return file_path


def main() -> None:
    output_dir = Path("/mnt/data")
    output_dir.mkdir(parents=True, exist_ok=True)

    generated = [
        build_rapid_stabilization_plan(output_dir),
        build_30_day_income_sprint(output_dir),
        build_doj_civil_rights_submission(output_dir),
    ]

    for path in generated:
        print(path)


if __name__ == "__main__":
    main()
