# StagePort System Scaffold

This scaffold implements a Codex-to-GitHub dump pipeline with:

- PR ingest (`codex-sync`) and ledger logging
- Musings scoring and release-state classification
- Public-safe demo generation
- Witness Window timed/redeemable access
- Deal room initialization and event backbone
- GitHub workflows for classification, scoring, and demo build

## Structure

```text
stageport-system/
  apps/
    deal-room/
    studioos/
  services/
    musings-manager/
  supabase/
  .github/workflows/
```

## Environment

```bash
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
DEFAULT_TENANT_ID=

CODEX_SYNC_TOKEN=
CODEX_SYNC_URL=

MUSINGS_SCORE_URL=
MUSINGS_SCORE_TOKEN=

DEMO_BUILD_URL=
DEMO_BUILD_TOKEN=
```

## Security posture

- Keep all valuation/ranking/issuance logic server-side.
- Ship only rendered artifacts to public surfaces.
- Witness Window should remain tokenized, timed, one-time redeem, and fail-closed.
- Never expose service role keys or internal prompt/compiler artifacts to clients.
