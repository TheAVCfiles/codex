# StagePort Operations Notes

## Roles and controls

- Keep contract admin in a multisig.
- Grant relayer `MINTER_ROLE` only on Stagecoin.
- Keep a separate key for deployment and for relaying.

## Relayer safety

- Add per-wallet/day conversion caps.
- Add idempotency keys for convert requests.
- Restrict admin endpoints with authn/authz.
- Migrate from file DB to Postgres before production.

## Gas strategy

- Default to Base for low fees.
- Batch `mintWithRoyalty` operations with `batchMint`.
- Consider Merkle batch roots + claims for higher scale.

## Compliance posture

- Start with internal-only credits and no cashout.
- Add KYC checks for external withdrawal paths.
- Log all role changes, mint events, and treasury actions.
