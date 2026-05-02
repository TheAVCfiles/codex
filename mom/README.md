# M.O.M. (Memory. With. Governance.)

**M.O.M.** is a spec-first framework for building _privacy-first memory systems_ that don’t hallucinate consent, don’t silently overwrite history, and don’t “nudge” users into traps.

This repo is the **spine**: invariants, rules, threat model, and a paid installation sprint for teams shipping memory + proactive behaviors.

## What’s inside

- `specs/` — the system spec, nudge constitution, threat model, glossary
- `glitchport/` — failure taxonomy + famous incidents mapped to preventable invariants
- `offer/` — a 7-day governance sprint (install the spine into a real product)
- `docs/` — roadmap + FAQ

## Core principles (non-negotiable)

- **Consent is a gate, not a vibe.**
- **Continuity is append-only.** No silent rewrites.
- **Proactive behaviors are constitutional.** Rate-limited, explainable, revocable.
- **Fail closed at the boundary.** If policy can’t be verified, the system does nothing.

## Status

- Spec v1.1 is live (2026-01-24).
- Implementation is staged after invariants are staked. See `docs/ROADMAP.md`.

## Quick start (for teams)

1. Read `specs/SYSTEM_SPEC_v1.1.md` (data model + invariants).
2. Adopt `specs/RULESET_NUDGE_CONSTITUTION_v1.0.md` (proactive behavior rules).
3. Implement the boundary: **StagePort Gate + Coda Log** (Issue #1).

## Contact

Security disclosures: see `SECURITY.md`  
Commercial install sprint: see `offer/OFFER_7_DAY_GOVERNANCE_SPRINT.md`

---

**Pinned tagline:**  
_M.O.M. = memory with governance. Spec v1.1 is live. I install safe nudges + continuity in 7 days._
