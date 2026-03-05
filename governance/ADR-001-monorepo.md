# ADR-001: Monorepo Architecture

## Decision
We use a pnpm workspace monorepo so `apps/portal` and `apps/api` can share versioned packages (`@studioos/ui`, `@studioos/ledger`) with one source of truth.

## Why
This keeps deployments independent per app while reducing duplication in UI and ledger utilities.
