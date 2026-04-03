# Operator Guide (Internal Only)

## Purpose
The Private Operator Shell (`operator/`) is an internal console for release routing and artifact build control.

It controls:
1. Codex dump intake visibility.
2. Musing review states (`public_now`, `gated_preview`, `private_hold`).
3. Build action awareness for demos, deal rooms, and witness outputs.
4. Publication queue visibility (`ready`, `gated`, `hold`).
5. Operator audit notes in local browser storage.

It does **not** control:
- Public hosting configuration.
- GitHub Pages deployment settings.
- External credential management.

## Operating Sequence
1. Open `operator/index.html` locally.
2. Review **Intake Buffer** for latest dump classification.
3. In **Review Panel**, assign release state decisions.
4. Confirm **Publication Queue** bucket reasons.
5. Use **Build Control** to track which build action you are executing externally.
6. Export state snapshot with `python3 scripts/operator_export_state.py`.

## Internal Boundary
- Internal only.
- Never deploy `operator/` as a public artifact.
- Public Pages should contain rendered outputs only.
