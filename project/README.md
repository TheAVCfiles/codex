# Sovereign Beta Portal

A single-page, dark-themed astrology landing page for The Sovereign Beta Portal. It uses Tailwind CSS via CDN and vanilla JavaScript to power cosmic visuals, monetized offerings, and birth-chart intake forms. The countdown targets the portal's closing time and adapts to timezone changes.

## Running locally

Serve the `index.html` file with any static server, for example:

```
python -m http.server 8000
```

Then open `http://localhost:8000/project/index.html` in your browser.

## Additional page

- `project/studio-portal.jsx`: StudioOS operator interface now includes PayGait Local + Ecosystem Map views.
- `project/ecosystem_map.md`: compact ecosystem architecture + integration map artifact.
- `project/prima-first-dreamm.html`: standalone “Prima • First Dreamm” landing page for Carrd/Super-style publishing.
- `project/founderos/`: clean FounderOS v0 scaffold (Dashboard, FSM kernel, role gating, multi-founder local ledger, hashing, and README).
- `project/paygait-local.html`: standalone PayGait local prototype for ingesting links/videos, exporting stamp bundles, and handling choreographer claim stakes for whole-work protection.
- `project/contracts/Stagecoin.sol` + `project/contracts/SentientCents.sol`: ERC-20 reward contracts for visible Stagecoin/Streetcred and source royalty flows.
- `project/tokenomics_gasless_strategy.md`: rollout strategy for gasless UX, custodial SentientCents, and batched settlement.

## Smart contract workspace

The token contracts now live in `project/contracts` with a local Hardhat setup for compilation/tests.

```bash
cd project/contracts
npm install
npm test
```

This includes:

- `Stagecoin.sol`: AccessControl ERC-20 with mint/burn roles, guarded royalty configuration, and royalty-on-transfer.
- `SentientCents.sol`: AccessControl ERC-20 (2 decimals) with mint/burn roles, guarded royalty configuration, and royalty-on-transfer.
- `test/Stagecoin.test.js` + `test/SentientCents.test.js`: baseline behavior and royalty tests.

Hardhat helper script:

```bash
cd project/contracts
npm run deploy:local
```

This runs `scripts/deploy-and-grant.js` to deploy both tokens and assign minter/burner/royalty admin roles.
