# State Model (Internal Only)

State file: `operator/state/default_state.json`

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
- **settings**: operator identity and delivery posture shown in UI.
- **queue**: lightweight local action records for manual release overrides.
- **notes**: optional local operator notes.
- **last_build**: marker for last build control event.

## Local-first behavior
The shell stores lightweight edits and audit entries in browser `localStorage` for quick continuity without requiring a backend.

## Boundary rules
- Do not publish this state model to the public artifact surface.
- Do not expose queue reasoning publicly.
- Do not expose operator notes externally.
