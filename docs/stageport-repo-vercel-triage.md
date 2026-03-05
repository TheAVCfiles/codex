# StagePort Repo + Vercel Triage

## Immediate unblock: `NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY`

If Stack Auth is enabled in a frontend app, set the publishable key in the app's environment:

- Variable: `NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY`
- Scope: client/runtime (safe for browser exposure)
- Where to set:
  - Local: `.env.local`
  - Vercel: **Project → Settings → Environment Variables**

Example:

```bash
NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY=pk_live_or_pk_test_value
```

---

## Why deployments are failing

The recurring `No Next.js version detected` error almost always means one of two issues:

1. Vercel is configured as `Next.js`, but the code is a Vite app.
2. The **Root Directory** is wrong (Vercel cannot see the intended `package.json`).

---

## Canonical repo model (public stage)

Use three visible repos only:

1. `stageport` (infrastructure + architecture)
2. `decrypt-the-girl` (narrative/cipher engine)
3. `avc-systems` (umbrella presentation + observation deck)

Move experiments into one private workspace (`lab` or `forge`).

---

## Recommended deployment topology

Prefer one deploy repo with multiple apps:

```text
/apps
  /stageport
  /dtg
  /observation-deck
```

Benefits:

- Fewer Vercel projects
- Fewer duplicated env vars
- Lower build and preview waste

---

## 90-minute triage runbook

1. Disable noisy failing GitHub workflows temporarily.
2. Pick one canonical deploy target and make it green first.
3. Set Vercel per app type:
   - Vite: framework `Vite`, output `dist`
   - Next: framework `Next.js`, output auto (`.next`)
4. Ensure **Root Directory** points at the folder containing the target app's `package.json`.
5. Add required env vars once per project/environment.
6. Re-enable workflows only after successful deploy + smoke test.

---

## Operational rule

Treat the platform as a staged system:

- **Public stage**: only finished products
- **Backstage lab**: all experiments

This keeps architecture legible for collaborators and prevents deployment entropy.
