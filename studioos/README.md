# StudioOS Canonical Monorepo

This repository follows a canonical monorepo pattern with stage-based boundaries:

- **Portal UI stage**: `apps/portal`
- **Server/API stage**: `apps/api`
- **Docs stage**: `apps/docs`
- **Reusable domain and platform packages**: `packages/*`
- **Human governance docs**: `governance/*`

## Structure

```txt
studioos/
  apps/
    portal/
    api/
    docs/
  packages/
    ui/
    config/
    db/
    ledger/
    auth/
    governance/
  governance/
  scripts/
  package.json
  pnpm-workspace.yaml
  turbo.json
  vercel.json
```

## Deployment topology

### Recommended: Option A (multiple Vercel projects)

- `studioos-portal` root directory: `apps/portal`
- `studioos-api` root directory: `apps/api`
- `studioos-docs` root directory: `apps/docs` (optional)

Benefits:
- independent rollbacks and failures
- app-specific environment variables
- reduced redeploy blast radius

### Alternative: Option B (single Vercel project)

Use `apps/portal` as the root and proxy `/api/*` to the API deployment via rewrites.
This is supported, but less clean operationally.

## Quick start

```bash
pnpm install
pnpm dev
```

## Governance baseline

- `governance/ADR/0001-monorepo.md`: architectural decision record
- `governance/POLICY/secrets-and-env.md`: env ownership and secrets policy
- `governance/POLICY/data-and-ledger.md`: financial truth and ledger policy
