# StagePort Core Agent Topology (MVP)

## Agent 1: Session Agent

Responsibilities:

- create/start/stop/archive session,
- enforce lifecycle status transitions,
- emit session-level audit events.

## Agent 2: Primitive Agent

Responsibilities:

- receive signal frames,
- map frames to supported ChoreoCode primitives,
- attach confidence and sequence ordering.

## Agent 3: FSM Agent

Responsibilities:

- enforce AURE FSM constraints,
- validate transitions across `GLISSADE`, `JETE`, `FERMATA`, `CODA`,
- reject invalid transitions with reason codes.

## Agent 4: Scoring Agent (PyRouette)

Responsibilities:

- compute `TES`, `PCS`, `GOE`, `BV`, `total`,
- tag scoring ruleset version,
- return deterministic score packet for replay.

## Agent 5: Reviewer Agent

Responsibilities:

- present queue of pending sessions,
- process reviewer decisions (confirm/promote/discard/annotate),
- reopen scoring when reviewer overrides occur.

## Agent 6: Receipt Agent

Responsibilities:

- build canonical session artifact,
- hash output (SHA-256),
- write receipt + lineage record,
- finalize immutably.

## Agent 7: Audit Agent

Responsibilities:

- append-only mutation logging,
- actor attribution for every state change,
- query support for compliance/forensics.

## Delegation model

- Stage 1: assistive (human-in-loop for all session finalization).
- Stage 2: partial automation for high-confidence primitives.
- Stage 3+: selective autonomy by routine and environment confidence.
