from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.platypus import Paragraph, SimpleDocTemplate, Spacer


def generate_pdf_summary(new_files, build_date):
    out_path = 'FINDINGS_SNAPSHOT_SUMMARY.pdf'
    doc = SimpleDocTemplate(out_path, pagesize=letter)
    styles = getSampleStyleSheet()
    story = []

    story.append(Paragraph("Snapshot Summary", styles['Heading1']))
    story.append(Spacer(1, 12))
    story.append(Paragraph(f"Build Date: {build_date}", styles['Normal']))
    story.append(Paragraph(f"Number of new sources: {len(new_files)}", styles['Normal']))

    doc.build(story)
    return out_path
