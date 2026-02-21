# AVC FounderOS: GitHub + Replit Deterministic Setup

Use this sequence exactly to avoid setup drift.

## A) Create the GitHub repository

1. In GitHub, open your org and click **New repository**.
2. Configure:
   - **Repository name:** `avc-founder-os`
   - **Private:** enabled
   - **Initialize with README:** enabled
3. Click **Create repository**.

Do not add a license or `.gitignore` at this step.

## B) Import to Replit

1. In Replit, go to **Create → Import from GitHub**.
2. Select or paste: `AVC-Systems-Studio/avc-founder-os`.
3. Create the Repl.

Expected baseline: `README.md` is visible in the file tree.

## C) Scaffold Vite React in Replit shell

From the repository root (where `README.md` exists), run:

```bash
npm create vite@latest . -- --template react
npm install
npm run dev -- --host 0.0.0.0 --port 3000
```

If prompted with `Proceed?`, answer `y`.

If Replit auto-started another process, stop it first.

## D) Commit sequence after scaffold

After the default Vite+React page loads:

```bash
git status
git add -A
git commit -m "chore: scaffold Vite React app"
git push
```

If prompted for GitHub auth in Replit, complete that one-time connection.

## E) Apply FounderOS files (exact set)

Create folders:

- `src/components/`
- `src/fsm/`
- `src/engines/`
- `src/lib/`

Add/update this exact file set:

- `src/lib/hash.js`
- `src/lib/auth.js`
- `src/lib/ledger.js` (localStorage version)
- `src/fsm/founderMachine.js`
- `src/engines/regimeEngine.js`
- `src/components/LedgerReport.jsx`
- `src/components/Dashboard.jsx`
- `src/App.jsx` (render `Dashboard`)

Then commit:

```bash
git add -A
git commit -m "feat: FounderOS console with localStorage ledger + PDF export"
git push
```

## F) Quick sanity checks

Browser expectations:

- Page shows **FounderOS Console**.
- **Run Engine** transitions state to `BUILDING` (and sometimes `ESCALATED` via `OVERDRIVE`).
- Refresh keeps ledger data (persisted via `localStorage`).
- **Export PDF** opens print dialog with a clean report.

DevTools expectations:

- Logs indicate ledger persistence with hash fields.

## Common gotchas

1. **Export PDF popup blocked**
   - Allow popups for the Replit preview domain.
2. **Escalate button says Permission denied**
   - Expected behavior: role-based auth blocks `ESCALATE` for `FOUNDER`, and the FSM path escalates through `OVERDRIVE`.

## Final verification question

After Vite scaffold, confirm the file tree includes:

- `package.json`
- `vite.config.js`
- `src/`
