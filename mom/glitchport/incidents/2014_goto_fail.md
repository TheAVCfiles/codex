# 2014 — goto fail (HANDOFF.FAIL / STATE.GHOST)

## What happened

A duplicated line in TLS certificate verification logic disabled a critical check, weakening security.

## Why it matters to M.O.M.

Governance systems fail catastrophically when:

- a single check is accidentally bypassed
- boundary enforcement is not tested at the edge
- “it compiles” is mistaken for “it’s safe”

## Score (Impact × Coupling × Speed)

- Impact: 5 (security boundary failure)
- Coupling: 4 (TLS used widely)
- Speed: 4 (silent until exploited)
  Total: 80/125

## Fall type

HANDOFF.FAIL (and a hint of STATE.GHOST: old assumptions woke up)

## Preventable invariant

**Invariant:** StagePort MUST have a mandatory deny-path test: “no gate, no access.”

## Test that would catch it

- Mutation test: remove/duplicate a policy line and ensure the suite fails.
- Boundary test: attempts to bypass StagePort MUST be denied.

## Policy to contain blast radius

- Defense-in-depth: independent secondary checks for high-risk outputs (notifications, cross-context surfacing).
