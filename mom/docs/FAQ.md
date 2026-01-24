# FAQ

## What is M.O.M. really?

A governance spec for memory systems that need to be safe, auditable, and consent-driven.

## Why spec-first?

Because “we’ll fix safety later” is the origin story of every incident write-up in `glitchport/`.

## Does this require a specific database or vector store?

No. The model is implementation-agnostic. The invariants are not.

## What’s a StagePort?

The enforcement boundary. The point where the system is forced to prove it has permission.

## What’s Coda?

An append-only continuity log. It makes silent rewrites impossible to hide.

## What are Corridors?

Typed relationships between memories with traversal constraints. They prevent “everything connects to everything” chaos.

## Is this open source?

Not yet. `LICENSE.md` is intentionally protective until a strategy is chosen.

## What’s the fastest “money proof” move?

Implement Issue #1: StagePort Gate + Coda Log. Then you can demo governance, not vibes.
