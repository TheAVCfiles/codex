# ADR-002: Ledger Source of Truth

## Decision
All financial calculations live in `packages/ledger` and are consumed by both portal and API.

## Why
A single ledger model prevents divergence between frontend displays and backend responses.
