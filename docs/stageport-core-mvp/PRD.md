# StagePort Core MVP PRD (v0.1)

## One-line pitch

StagePort Core turns physical performance into structured, scored, and provenance-bearing digital assets by compiling movement primitives through a governed scoring pipeline.

## Product scope (30-day MVP)

Build one reliable, reviewable loop:

1. Session initialized
2. Signal captured (upload or simulated stream)
3. Primitive mapped to ChoreoCode
4. AURE FSM transition executed
5. PyRouette score computed
6. Reviewer validates / overrides
7. Receipt + lineage record minted and archived

## Primary users

- Studio Admin (creates and governs sessions)
- Reviewer / Faculty (validates primitives and scoring)
- Operator (runs ingest and session operations)

## Problem statement

Studios and adjudicators currently rely on fragmented artifacts (video clips, notes, spreadsheets, memory, and manual scoring sheets). There is no institutional-grade workflow that makes movement evaluation:

- measurable,
- reproducible,
- auditable,
- portable across organizations.

## Non-goals (MVP)

- No broad “creative AI” tooling.
- No open public signup.
- No autonomous adjudication.
- No token economy / credential issuance in MVP.

## Functional requirements

### 1) Invite-only access and roles

- Cognito-backed invite-only login.
- Roles: `Admin`, `Reviewer`, `Operator`.

### 2) Session management

- Create, start, stop, archive session.
- Session source types: `live` (simulated telemetry first), `upload`.
- Session status visible in reviewer console.

### 3) Primitive stream (ChoreoCode)

Supported primitives in MVP:

- `FIFTH()`
- `PASSE(side)`
- `SOUS_SUS()`
- `SOUTENU(angle)`
- `ECHO(payload)`

Capabilities:

- Assisted suggestion from signal pipeline.
- Manual reviewer correction/override.
- Confidence score on each detected primitive.

### 4) AURE Governance FSM

States:

- `GLISSADE`
- `JETE`
- `FERMATA`
- `CODA`

Rules:

- Every transition must include reason and actor.
- Invalid transitions are rejected and logged.

### 5) PyRouette scoring

Compute final score packet:

- `TES`
- `PCS`
- `GOE`
- `BV`
- `total`

### 6) Reviewer workflow

Reviewer actions:

- confirm primitive,
- promote,
- discard,
- annotate,
- approve final score.

### 7) Receipt & provenance

On finalize:

- Produce canonical session summary JSON.
- Generate SHA-256 hash.
- Persist immutable audit event.
- Store receipt with timestamp and author.

## Success metrics (MVP)

- ≥20 completed sessions in pilot.
- ≥90% session-to-receipt completion rate.
- Median reviewer latency < 2 minutes per session.
- Primitive-review agreement trend improving week-over-week.
- Cost per processed session under $0.20 at pilot scale.

## Acceptance criteria

- A full session can be run end-to-end from initialization to receipt without manual database edits.
- Every score can be traced back to primitive and transition history.
- Reviewer overrides are fully auditable.
- Exportable receipt JSON includes hash + scoring + lineage metadata.
