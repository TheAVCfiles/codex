# StagePort Regime Notes (2026-03-06)

This note captures the consolidated architecture framing from the March 6, 2026
working session and translates the narrative into a compact systems brief.

## Core thesis

StagePort treats movement as a durable signal chain:

`movement → signal → scoring math → credential → ledger → economic value`

Anchor statement: **"Your movement is the product. We built the math to prove it."**

## Confirmed system layers

### 1) Movement telemetry

- Pressure tiles
- IMU motion sensors
- Balance board
- Depth camera
- ESP32 edge node
- Python fusion (timestamp sync + energy math)

### 2) Scoring + analytics

- Routine ingestion as structured JSON
- PyRouette scoring model execution
- TES-style reporting and comparison analytics

### 3) Credential + governance rails

- Report-backed credential issuance
- Ledger recording for institutional/economic recognition
- Replayable evidence trail

## Formal decision logic already present

Regime behavior can be described as a canonical adaptive loop:

`signal → validation → regime classification → action`

Observed examples from the current stack include:

- Threshold regime gates (e.g., velocity classifies `SAFE` vs `OVERDRIVE`)
- Statistical confidence checks (`p_value`, confidence exclusions, structure flags)
- Refusal behavior when statistical edge is absent (`risk = 0`, no action)

## State machine framing

The Stravinsky/Rosetta sequence can be interpreted as a finite-state engine:

`GLISSADE → JETÉ → FERMATA → CODA → RESET`

with transition drivers such as volatility momentum (`VZ`), acceleration (`AZ`),
and persistence (`M`).

## Operational claim to prove repeatedly

Smallest undeniable product proof:

1. Student performs routine
2. Routine becomes JSON
3. PyRouette generates score
4. Report is produced
5. Credential is recorded

The strategic guidance is to maximize repeatability of this exact loop before
expanding narrative or surface complexity.

## Key risk

The principal risk is not missing architecture; it is presentation density.
The stack spans dance, sensing, scoring, governance, and economics. For external
adoption, the front door must stay legible and narrow.

## Working principle

Timing is treated as information across three synchronized clocks:

1. Musical time (meter / dissonance / tempo shift)
2. Movement time (impulse / sustain / rest)
3. Market-like regime time (volatility / acceleration / persistence)

This alignment is the unifying research hypothesis for continued experimentation.
