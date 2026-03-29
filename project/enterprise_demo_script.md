# StagePort Enterprise Demo Script

A tight, 12-minute demo flow for institutional buyers. This script is designed to **show controlled execution** (not explain features).

## Demo Objective

By minute 12, the buyer should believe:

1. StagePort converts ambiguous inputs into structured outputs fast.
2. Governance and authority are enforced by the system, not by operator preference.
3. Every critical action is auditable.

## Demo Setup (Before Call)

- Use a dedicated demo tenant (example: `northstar-demo`).
- Preload one messy source artifact (meeting notes, project brief, or intake transcript).
- Confirm these are visible in UI:
  - Authority badge (example: `DIRECTOR · ACTIVE · GOOD STANDING`)
  - Intake Buffer
  - Audit Ledger
  - One blocked action path (for controlled denial)
- Keep one export action available (for proof of completion).

## Timing + Talk Track

## 0:00–1:00 — Open with Positioning

**Say:**

> "StagePort is an operator system for structured execution. We convert unstructured input into auditable output under enforced authority."

**Do:**

- Open tenant shell.
- Let interface sit for 3–5 seconds (no clicking).

**Why:**

- Signals control and confidence before feature tour behavior begins.

## 1:00–3:30 — Input Ingestion (Their Chaos)

**Say:**

> "I’ll start with unstructured intake. No cleanup first."

**Do:**

- Paste messy artifact into Intake Buffer.
- Trigger normalization/parse action.
- Briefly point at generated structure (headings, priorities, or action map).

**Do not say:**

- "Our AI helps summarize..."
- "This is a productivity tool..."

**Use instead:**

> "The system compiles input into an execution surface."

## 3:30–6:00 — Structured Output Generation

**Say:**

> "Now we move from intake to executable spec."

**Do:**

- Generate one-pager/spec output.
- Highlight exactly three fields:
  - Scope
  - Decision boundary
  - Next action set

**Rule:**

- Keep this section under 2.5 minutes. Proof over explanation.

## 6:00–8:00 — Governance Proof (Controlled Restriction)

**Say:**

> "Capabilities are unlocked by authority state, not by UI presence."

**Do:**

- Trigger one action you are not authorized to run in demo mode.
- Let the system deny access.
- Show denial text (e.g., `Access restricted`).

**Then say (one line):**

> "Restriction events are intentional and logged."

## 8:00–9:30 — Audit Ledger Proof

**Do:**

- Open Audit Ledger.
- Point to chronological entries:
  - Intake processed
  - Output generated
  - Restricted action attempt

**Say:**

> "This is append-only event evidence. The system can show who acted, what executed, and what was blocked."

## 9:30–10:30 — Export Proof

**Do:**

- Execute one approved export.
- Download/render artifact.

**Say:**

> "Every run ends in a tangible output artifact."

## 10:30–12:00 — Commercial Close

**Say exactly:**

> "If this maps to your operating constraints, we deploy your tenant with your authority model and terminology layer."

Then present only these options:

- **Operator License** — single team usage
- **System License** — org-wide deployment
- **Enterprise Deployment** — tenant-isolated rollout with custom governance rules

Stop talking after pricing line. Let silence close.

## Objection Handling (Short Responses)

### "Can we just do this in our existing tools?"

> "Existing tools can store work. StagePort governs execution and produces audit-grade output under authority constraints."

### "Is this just prompt automation?"

> "No. Prompting is one input path. The product is controlled dispatch, authority enforcement, and evidentiary logging."

### "Can we white-label it?"

> "Yes. Terminology and policy layers are tenant-configurable while the core execution engine remains fixed."

## Demo Guardrails

- Never narrate implementation internals unless asked.
- Never use mystical/internal language in enterprise calls.
- Never run more than one unscripted branch in the first meeting.
- Always end with one export artifact and one ledger view.

## Success Criteria Checklist

A successful call includes all of the following:

- [ ] Buyer sees messy input transformed into structure.
- [ ] Buyer sees one denied action due to authority restrictions.
- [ ] Buyer sees ledger evidence for execution + denial.
- [ ] Buyer sees one export artifact.
- [ ] Buyer hears a clear deployment offer.

## Internal Notes (Operator)

- Keep tone: calm, precise, non-performative.
- Replace adjectives with state transitions.
- Show sequence, not features.
- If conversation drifts, return to this phrase:

> "Input, governance, output."
