# 2019 — Cloudflare regex outage (REGEX.DOOMSDAY)

## What happened

A single regex triggered catastrophic backtracking, spiking CPU and causing widespread service disruption.

## Why it matters to M.O.M.

Memory systems often rely on:

- text filters
- redaction patterns
- policy matching

Regex in the boundary path can become a denial-of-service weapon if not constrained.

## Score (Impact × Coupling × Speed)

- Impact: 4
- Coupling: 4
- Speed: 5
  Total: 80/125

## Fall type

REGEX.DOOMSDAY

## Preventable invariant

**Invariant:** Any pattern-matching used in StagePort MUST be time-bounded or use safe-regex tooling.

## Test that would catch it

- Fuzz test policy patterns against adversarial inputs.
- Runtime budget test: StagePort checks must complete within a strict time limit.

## Policy to contain blast radius

- Timeout + fallback deny: if policy evaluation exceeds budget, StagePort denies.
