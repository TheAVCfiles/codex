from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, PageBreak
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.pagesizes import LETTER
from reportlab.lib.units import inch


def ensure_style(styles, style_obj):
    """
    ReportLab throws if you add a style with a duplicate name.
    This makes re-runs safe.
    """
    if style_obj.name not in styles.byName:
        styles.add(style_obj)


def build_pdf(file_path, title, subtitle, poems):
    doc = SimpleDocTemplate(
        file_path,
        pagesize=LETTER,
        rightMargin=72,
        leftMargin=72,
        topMargin=72,
        bottomMargin=72,
    )

    styles = getSampleStyleSheet()

    ensure_style(
        styles,
        ParagraphStyle(
            name="KCCR_PoemStyle",
            fontSize=12,
            leading=16,
            spaceAfter=14,
        ),
    )
    ensure_style(
        styles,
        ParagraphStyle(
            name="KCCR_TitleStyle",
            fontSize=18,
            leading=22,
            spaceAfter=24,
        ),
    )

    content = [
        Paragraph(title, styles["KCCR_TitleStyle"]),
        Paragraph(subtitle, styles["KCCR_PoemStyle"]),
        Spacer(1, 0.5 * inch),
    ]

    for i, poem_html in enumerate(poems):
        content.append(Paragraph(poem_html, styles["KCCR_PoemStyle"]))
        if i != len(poems) - 1:
            content.append(PageBreak())

    doc.build(content)
    return file_path


def main():
    poem_1_original = """
When prices fall to an eye for an eye?<br/>
I must now blind eye the throne<br/><br/>
I never needed roots to know<br/>
Ground that breaks<br/>
Revives the tone<br/><br/>
We break swords &amp; pen new worlds<br/>
New orders<br/>
To fulfill<br/><br/>
The windows were soul bound<br/>
Oculus<br/>
Ever willed<br/><br/>
Booked and booted<br/><br/>
Silo sill
"""

    poem_2_original = """
See you on the upside &amp; you know it<br/><br/>
My heart was always golden<br/>
The trip is not the circuit<br/><br/>
Rings that lead to gems like you<br/>
Lead me back home from the circus<br/><br/>
Can’t wait to see you on the surface<br/><br/>
Sending the light forward<br/>
(Meet me in Montauk)
"""

    poem_3_original = """
A requiem is a ritual for the dead.<br/>
A dream is a future that never gets to live.<br/><br/>
This is not metaphor.<br/>
This is a formal burial of hope itself.<br/><br/>
No villains.<br/>
Only machinery.<br/><br/>
No rest granted.<br/>
Only aftermath.
"""

    build_pdf(
        "/mnt/data/Kafka_Cochlear_Cocktail_Roach.pdf",
        "Kafka Cochlear Cocktail Roach",
        "Collected poems from the chat — served without anesthesia.",
        [poem_1_original, poem_2_original, poem_3_original],
    )

    poem_1_a = """
When prices fall to an eye for an eye?<br/>
I blind the throne—<br/>
not by rage, but by refusal.<br/><br/>
No roots required to know:<br/>
breakground revives tone.<br/><br/>
We break swords &amp; pen new worlds—<br/>
new orders to fulfill.<br/><br/>
Windows: soul-bound witness.<br/>
Oculus.<br/>
Ever-willed.<br/><br/>
Booked. Booted.<br/><br/>
Silo sill.
"""

    poem_2_a = """
See you on the upside—you know it.<br/><br/>
My heart stayed golden.<br/>
The trip is not the circuit.<br/><br/>
Rings that lead to gems like you<br/>
lead me home from the circus.<br/><br/>
Can’t wait to see you on the surface.<br/><br/>
Sending the light forward.<br/>
(Meet me in Montauk.)
"""

    poem_3_a = """
A requiem is for the dead.<br/>
A dream is a future.<br/><br/>
So this title means:<br/>
a funeral for what never got to live.<br/><br/>
No villains—<br/>
only machinery.<br/><br/>
No rest granted.<br/>
Only aftermath.
"""

    build_pdf(
        "/mnt/data/Kafka_Cochlear_Cocktail_Roach_Edited_A.pdf",
        "Kafka Cochlear Cocktail Roach — Edited A",
        "Tight cut. Clean blade. Same bones.",
        [poem_1_a, poem_2_a, poem_3_a],
    )

    poem_1_b = """
When prices fall to an eye for an eye,<br/>
the market becomes a judge.<br/><br/>
I blind-eye the throne—<br/>
starve it of witness,<br/>
deny it the glow.<br/><br/>
I never needed roots to know:<br/>
the ground that breaks<br/>
returns the tone.<br/><br/>
We break swords &amp; pen new worlds—<br/>
orders not carved in iron,<br/>
but written to fulfill.<br/><br/>
Windows were soul-bound—<br/>
Oculus—<br/>
ever-willed.<br/><br/>
Booked and booted,<br/>
filed into silence—<br/>
silo sill.
"""

    poem_2_b = """
See you on the upside &amp; you know it.<br/><br/>
My heart was always golden—<br/>
a lamp in a blackout.<br/>
The trip is not the circuit.<br/><br/>
Rings that lead to gems like you<br/>
lead me back home from the circus—<br/>
out of the noise,<br/>
out of the net.<br/><br/>
Can’t wait to see you on the surface.<br/><br/>
Sending the light forward.<br/>
(Meet me in Montauk.)
"""

    poem_3_b = """
A requiem is a rite for the dead.<br/>
A dream is a future with a
pulse.<br/><br/>
So the title is a knife:<br/>
a funeral for a future<br/>
before it can breathe.<br/><br/>
No mustache-twirling villain.<br/>
Just systems doing what they do.<br/><br/>
No “eternal rest.”<br/>
Only aftermath.
"""

    build_pdf(
        "/mnt/data/Kafka_Cochlear_Cocktail_Roach_Edited_B.pdf",
        "Kafka Cochlear Cocktail Roach — Edited B",
        "Ritual cut. Incantation intact.",
        [poem_1_b, poem_2_b, poem_3_b],
    )


if __name__ == "__main__":
    main()
