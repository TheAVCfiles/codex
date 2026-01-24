# Contributing

M.O.M. is spec-first. Contributions that weaken guarantees will be declined politely and ruthlessly.

## What we accept

- Clarifications that tighten invariants (without adding loopholes)
- Threat model improvements (new attack surfaces, better mitigations)
- Incident analyses that end in enforceable invariants + tests
- Tooling ideas that strengthen auditability and consent enforcement

## What we do not accept

- “Just trust the model” logic
- Silent overwrite behavior
- Nudges without explicit user consent + revocation
- Features that create notification leakage or cross-context exposure

## Workflow

1. Open an issue describing: problem → proposed change → affected invariants.
2. Keep PRs small and reviewable.
3. Every PR touching policy MUST include:
   - the invariant being added/changed
   - the test that would catch violations
   - the blast-radius containment policy

## Style

- Be concrete. “User safety” is not a mechanism.
- Prefer SHALL / MUST / MUST NOT language in specs.
- If it can’t be audited, it’s not governance—it's vibes.
