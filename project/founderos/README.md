# FounderOS (Local-First Governance Console)

FounderOS is a deterministic governance dashboard that tracks founder state transitions with a local hash ledger.

## Core features

- Finite state machine (FSM) runtime for founder operating states
- Role-based action gating (admin/founder/observer)
- Multi-founder ledger isolation (`founders[founderId]` namespace)
- SHA-256 hashing for each appended ledger entry
- Four-lever control panel UI (`Run Engine`, `Trigger Throttle`, `Escalate`, `Reset`)
- Translation compiler boundary (`core/translation`) for internal vs external render language
- Authority-gated execution wrapper for protected actions (`executeAction`)

## Folder map

- `components/Dashboard.jsx` — complete operator dashboard
- `fsm/founderMachine.js` — deterministic transitions
- `engines/regimeEngine.js` — baseline signal engine
- `lib/auth.js` — role gating logic
- `lib/hash.js` — SHA-256 utility
- `lib/ledger.js` — localStorage-backed append-only ledger
- `core/translation/*.ts` — registry, compiler, authority, and presenter modules
- `data/ledger.json` — server-side starter ledger shape (for future backend swap)

## Runtime notes

- Current implementation is browser-local and writes to `localStorage`.
- To move to Node/Express or Next API routes, keep the same event schema and replace `lib/ledger.js` read/write adapters.
