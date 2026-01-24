# Roadmap

## v0 — The Spine (minimum runnable governance)

**Goal:** prove enforceable safety with the smallest surface area.

- StagePort Gate (write + read)
- Coda append-only log
- MemNode store (file/db ok)
- Deny path that cannot leak content

## v0.1 — Eval harness

- leakage tests (notification + cross-context)
- overwrite tests (no silent mutation)
- injection tests (integration tool outputs)

## v0.2 — Corridors

- typed edges
- traversal constraints
- depth limits + context gates

## v0.3 — Masking modes

- masked recall (internal) vs redacted output (external)
- user-visible “what do you remember?” view
- revocation flows

## v1 — Connector hardening

- integration sandboxing
- provenance requirements
- dependency budgets + integrity verification

## v1.1 — Policy packs

- nudge constitution packs by domain (education, health-adjacent, enterprise)
- audit exports for compliance reviews
