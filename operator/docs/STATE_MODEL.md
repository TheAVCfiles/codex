# State Model

## File
Primary baseline state is stored at `operator/state/default_state.json`.

## Model
```json
{
  "settings": {
    "role": "DIRECTOR",
    "credential": "ACTIVE",
    "status": "GOOD_STANDING"
  },
  "queue": [],
  "notes": [],
  "last_build": null
}
```

## Fields

### `settings`
Institutional operator identity and credential posture used by the console header.

### `queue`
Reserved internal queue object for lightweight local annotations. Canonical publication queue is maintained in `data/release_queue.json`.

### `notes`
Operator audit entries appended during review and build control operations.

### `last_build`
Most recent build action marker with action id and timestamp.

## Persistence Model
- Baseline state comes from `default_state.json`.
- Runtime edits are persisted to browser `localStorage` for local-first continuity.
- Optional snapshots can be exported for handoff and archival.

## Why Local-First
- Operators can work without external dependencies.
- Internal workflow remains available even when CI/hosting layers are unavailable.
- Sensitive operational context stays local by default.

## Publication Safety Boundary
- This state is internal only.
- Do not expose operator state or queue internals on public surfaces.
