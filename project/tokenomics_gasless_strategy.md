# PayGait Tokenomics — Gasless & Low-Friction Strategy

## Objective

Eliminate user-facing gas friction while keeping Stagecoin + SentientCents economically coherent for artists.

## Recommended Hybrid (Pilot)

1. **SentientCents as internal credits first**
   - Keep SCENT custodial in StagePort during pilot.
   - Use SCENT for stamps, queue priority, and royalty accounting.

2. **Stagecoin as visible reputation layer**
   - Mint Stagecoin publicly (in batches) for approved recreations.
   - Keep Streetcred in-contract via `mintOnRecreation`.

3. **Gasless UX via relayer/paymaster path**
   - Users sign; platform relays transactions.
   - Treasury funds gas from subscription revenue + SCENT inflows.

4. **Anti-hoarding for SCENT**
   - Apply inactivity decay windows (`DECAY_TAU`, `DECAY_BPS`) to keep circulation active.
   - Decay is controlled by operator batch jobs using `applyInactivityDecay`.

## Why this is cheaper than a dual-engine ETH-heavy model

- Batch settlement + relayer dramatically lowers per-user chain costs.
- Fee-on-transfer royalties remain available for token-level economics, but user flow can remain custodial/gasless.
- More artist participation improves treasury health, enabling stronger gas subsidy and royalty reliability.

## Rollout Path

- **Phase 1**: custodial SCENT + batched Stagecoin minting.
- **Phase 2**: relayer-driven gasless on-chain actions.
- **Phase 3**: optional full on-chain SCENT redemption paths after compliance checks.
