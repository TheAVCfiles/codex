# Py.rouette — Finite-State Decision Primitives (Pitch Deck Notes)

This document captures the textual content provided for a six-slide
Py.rouette investor/partner deck and the accompanying architectural framing.

## Slide Deck Core Narrative

### Slide 1 — Cover

- **Title:** Py.rouette
- **Subtitle:** Finite-State Decision Primitives from Embodied Training
- **Founder:** Allison Van Cura (Py.rouette / StagePort)
- **Core claim:** Embodied expert behavior can be compiled into auditable,
  low-latency decision primitives with explicit risk gates and receipts.

### Slide 2 — Problem & Opportunity

- Operational systems (trading, robotics, HCI) face noisy inputs,
  oscillation, and brittle trigger behavior.
- Existing approaches are incomplete:
  - Heuristic gates fail under distribution shift.
  - Black-box ML is hard to audit.
  - Control implementations often miss embodied timing primitives.
- Market opportunity: enterprise decision governance and control where teams
  pay for stability, latency discipline, and explainable action logic.

### Slide 3 — Solution & Technology

- Product described as an FSM compiler + scoring layer.
- Primitive set:
  - **State**
  - **Guard**
  - **Permission Gate**
  - **Risk-Decay** (timed exit + hysteresis)
  - **Receipt** (auditable decision packet)
- Differentiators:
  1. Human-validated FSMs from expert sessions.
  2. Receipt-first governance.
  3. Operational sampling and latency targets.
  4. Cross-domain transferability (dance → robotics/trading/HCI).

### Slide 4 — Pilot Plan (8 Weeks)

- Setup/instrumentation, collection, labeling, model mapping,
  robustness testing, audit/compliance, and final handoff.
- Deliverables include labeled multimodal data, scoring model, receipts log,
  demo, and audit report with latency/stability metrics.
- Budget anchor in source text: **$75k** standard pilot.

### Slide 5 — Commercial Model & GTM

- Revenue streams:
  - Scoring module licensing
  - Data/model integration services
  - Professional services for pilot-to-production transition
- GTM path: paid pilots → proof-of-value POC → enterprise licensing.

### Slide 6 — Team, IP & Ask

- Founder-led core with technical/security partners.
- IP framing: software receipts and scoring models as licensable assets.
- Primary ask: 20–30 minute technical review meeting leading to pilot kickoff.

## Extracted Systems Framing

The accompanying text repeatedly converges on the same stack model:

```text
MYTHEMATICS
   ↓
Balanchine Cipher (logic layer)
   ↓
Glissé Engine (state machine)
   ↓
Rosetta Console (human interface)
```

Key translation pattern:

- Movement notation is treated as a finite-state grammar.
- Session outputs become auditable "reason receipts."
- Timing under uncertainty is the common variable across dance,
  algorithmic decision systems, and market signal processing.

In the framing language from the provided material:

- Ballet lineage contains implicit algorithmic structure.
- The project role is to make the structure explicit, machine-legible, and
  governable in production settings.

## Practical Positioning Notes

- This concept is strongest when presented as **translation/formalization** of
  existing embodied expertise (rather than invention of an entirely new field).
- Enterprise relevance depends on proving:
  - lower false-trigger rates,
  - bounded decision latency,
  - higher stability under noisy inputs,
  - and forensic explainability via receipts.
