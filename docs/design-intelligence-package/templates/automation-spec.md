# Automation Spec (Low-Risk, Auditable)

## Purpose

Automate intake, tracking, and delivery packaging without altering decision content.

## Principles

- Deterministic outputs
- Read-only data sources
- Human approval before client delivery

## Automation stages

1. **Intake tracker:** auto-log new inputs and timestamps.
2. **Status digest:** weekly summary of progress and blockers.
3. **Delivery packager:** compile final artifacts into a single client-ready bundle.

## Required controls

- Manual approval gate before export
- Audit log of file changes
- Versioned outputs

## Disallowed automation

- Auto-generation of recommendations
- Auto-approval for client delivery
- Unlogged modifications to artifacts
