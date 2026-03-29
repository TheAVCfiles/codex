# State Model (Local-First)

The operator state model is defined in `operator/state/default_state.json`.

## settings
- `role`: Operational role label (e.g., `DIRECTOR`).
- `credential`: Credential standing (e.g., `ACTIVE`).
- `status`: Operational status (e.g., `GOOD_STANDING`).

These fields provide institutional state framing in the console.

## queue
A local array reserved for explicit queue annotations from future operators.

## notes
A local array for concise operator notes or incident references.

## audit
Local action history for shell interactions (state updates and build action logs).

## last_build
Tracks most recent build action and timestamp.

## Why local-first
- Reduces dependency on external services for day-to-day operation.
- Keeps internal operating metadata private during review.
- Supports quick handoff via repository snapshots.
- Preserves clear separation between internal operator control and public artifact outputs.
