# FounderOS (Local-First Governance Console)

FounderOS is a deterministic governance dashboard that tracks founder state transitions with a local hash ledger.

## Core features

- Finite state machine (FSM) runtime for founder operating states
- Authority-based action gating (role + credential + standing)
- Multi-founder ledger isolation (`founders[founderId]` namespace)
- SHA-256 hashing for each appended ledger entry
- Governance control panel (`Run Engine`, `Trigger Throttle`, `Reset`, `Export Ledger`)

## Folder map

- `components/Dashboard.jsx` — complete operator dashboard
- `fsm/founderMachine.js` — deterministic transitions
- `engines/regimeEngine.js` — baseline signal engine
- `lib/auth.js` — role gating logic
- `lib/hash.js` — SHA-256 utility
- `lib/ledger.js` — localStorage-backed append-only ledger
- `data/ledger.json` — server-side starter ledger shape (for future backend swap)

## Runtime notes

- Current implementation is browser-local and writes to `localStorage`.
- To move to Node/Express or Next API routes, keep the same event schema and replace `lib/ledger.js` read/write adapters.
