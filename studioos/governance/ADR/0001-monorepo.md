# ADR-0001: StudioOS monorepo and stage boundaries

## Status
Accepted

## Decision
Use a canonical monorepo with `apps/*` for stage execution surfaces and `packages/*` for reusable code.

## Consequences
- clearer responsibility boundaries
- independent deployment of portal, api, and docs
- consistent shared package contracts
