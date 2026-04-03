# Operator Guide (Internal Only)

## Purpose
The Operator Shell (`operator/`) is the private control surface for internal delivery operations. It is designed for local-first execution and repository-native governance.

## What it controls
1. Intake visibility for Codex dump records (`data/codex_dumps.json`).
2. Release-state review for musings (`data/musings.json`).
3. Build-action controls for demos, deal rooms, witness pages, and scoring workflows.
4. Publication queue awareness (ready / gated / hold states).
5. Operator authority and delivery status from `operator/state/default_state.json`.
6. Local audit ledger entries via browser localStorage.

## What it does not control
- Public hosting infrastructure.
- Secrets management.
- External deployment permissions.
- Non-artifact publication channels.

The shell controls generation decisions and operator flow; public publication remains in artifact pipelines.

## Recommended operating order
1. Open `operator/index.html` locally.
2. Review **Intake Buffer** for new dump entries.
3. Update musing release states in **Review Panel**.
4. Confirm queue effects in **Publication Queue**.
5. Use **Build Control** actions as a tracked execution checklist.
6. Export state snapshot using `scripts/operator_export_state.py`.
7. Refresh release queue using `scripts/operator_build_queue.py`.

## Before You Publish
- Never deploy `operator/` as a public site.
- Public Pages should contain rendered artifacts only.
- Never expose scoring logic, internal mappings, operator state, or queue logic.
