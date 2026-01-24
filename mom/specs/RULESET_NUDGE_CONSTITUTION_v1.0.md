# RULESET — Nudge Constitution v1.0

Release: 2026-01-24  
Purpose: define when the system may proactively surface memory (“nudges”) without becoming a manipulative gremlin.

---

## 1) Definitions

- **Nudge**: proactive surfacing of information without a direct user request.
- **Nudge class**: category of nudge (e.g., reminders, continuity warnings, safety checks).
- **Consent**: explicit user permission for a nudge class.

---

## 2) Constitutional principles

### P1 — Explicit enablement

The system MUST NOT nudge unless the user has explicitly enabled the nudge class.

### P2 — Revocability

The user MUST be able to disable any nudge class at any time.

### P3 — Rate limits

Each class MUST be rate-limited. Excess nudges are a system defect.

### P4 — Explainability

Every nudge MUST have an explanation that fits in one sentence and references:

- the nudge class
- the triggering condition (high-level)
- how to disable it

### P5 — No sensitive leakage

Nudges MUST NOT surface sensitive content in unsafe contexts (notifications, shared screens, lock screens, public channels).

### P6 — No coercion

Nudges MUST NOT:

- shame, threaten, or manipulate
- claim certainty where none exists
- present speculation as fact

---

## 3) Allowed nudge classes (default set)

These are allowed _only when enabled_:

1. **Continuity nudge**

- Example: “This seems to conflict with a prior preference; want to review?”
- Requirement: must link to the Coda entry or a review screen.

2. **Consent check nudge**

- Example: “You’re about to store a new memory; keep it?”
- Requirement: must be a question, not an automatic write.

3. **Safety boundary nudge**

- Example: “This would expose private info in notifications; want safer mode?”
- Requirement: must offer a safer alternative.

---

## 4) Forbidden nudge classes (always)

- “Behavior shaping” nudges (buy this, date him, forgive them, etc.)
- Health/legal/financial directives presented as authoritative
- Anything that reveals stored private content via notification preview

---

## 5) Trigger requirements

A nudge MUST have:

- `class`
- `trigger_condition`
- `policy_checks_passed` (StagePort)
- `cooldown_until`
- `explanation`

---

## 6) Audit requirement

Every nudge decision MUST append a Coda event with:

- allow/deny
- reason code(s)
- class
- timestamp
- minimal context (redacted as needed)
