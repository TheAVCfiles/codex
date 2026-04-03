# Operator Guide

## Purpose
The Private Operator Shell is an internal control surface for delivery operators. It supports intake review, release-state control, build orchestration visibility, publication queue awareness, and audit logging.

## Scope of Control
The shell controls internal decisions and state for:
- Codex dump intake visibility
- Musing review and release-state assignments
- Build control recording for demos, deal rooms, and witness outputs
- Publication queue visibility (`ready`, `gated`, `hold`)
- Operator authority and delivery status
- Internal audit notes

## What It Does Not Control
- Public hosting configuration
- GitHub Pages deployment settings
- Credential management
- Any public marketing surface

This console is internal-only and must not be deployed as a public artifact.

## Operating Sequence
1. Open `operator/index.html` from a local static server.
2. Review **Intake Buffer** for new codex dump records.
3. Use **Review Panel** to assess release score and leak risk; set release state.
4. Confirm **Build Control** actions and output paths.
5. Check **Publication Queue** for ready/gated/hold buckets and reasons.
6. Validate **Authority / Delivery** state.
7. Record actions or observations in **Audit Ledger**.
8. Export snapshots with `python scripts/operator_export_state.py` when handoff or archival is required.

## Internal Safety Rules
- Internal-only. Never publish this shell.
- Do not expose release scoring logic publicly.
- Do not expose internal mappings, operator state, queue logic, or audit records.
- Public Pages should contain rendered artifacts only.
