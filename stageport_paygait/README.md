# PayGait → StagePort Starter Package

This folder contains a practical starter implementation for:

- A gas-sponsored relayer that validates EIP-712 signatures and mints Stagecoin.
- Hardhat contracts for `Stagecoin` and `SentientCents` with role-based controls.
- A React paygate component for a Ballet Bank conversion flow.
- Operational docs for deployment, roles, and safety.

## Structure

- `relayer/` – Express relayer + Stripe webhook prototype + Docker artifacts.
- `contracts/` – Hardhat project with contracts, tests, and deploy script.
- `client/` – React paygate component for signing and convert requests.
- `docs/` – Operational notes and a studio-owner handout.

## Quick Start

1. Deploy contracts from `contracts/`.
2. Configure `relayer/.env` with RPC URL, relayer key, and deployed `Stagecoin` address.
3. Grant `MINTER_ROLE` on Stagecoin to the relayer wallet.
4. Add `client/Paygate.jsx` into your front-end and point it to your relayer API.

## Notes

- This starter uses a file DB (`db.json`) for prototyping; migrate to Postgres for production.
- Keep relayer keys in managed secrets storage (Vault, HSM-backed signer, or Safe automation).
- Run a security review before production launch.
