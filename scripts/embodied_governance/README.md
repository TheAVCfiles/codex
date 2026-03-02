# Embodied Governance PDF Generator

Use `build_embodied_governance_pdf.py` to produce a journal-style v2 PDF draft with:

- Structured sections for SSI, FSM, drift detection, and CERA.
- A reproducible SSI worked example.
- Bootstrap confidence interval gating for escalation checks.

## Usage

```bash
python scripts/embodied_governance/build_embodied_governance_pdf.py \
  --output /tmp/Embodied_Governance_Working_Summary_v2.pdf
```

Dependencies:

- `reportlab`
- `numpy`
