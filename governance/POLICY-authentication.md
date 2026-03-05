# Policy: Authentication & Secrets

- Secrets and environment variables must be injected by deployment platforms and never committed.
- `apps/portal` and `apps/api` manage env vars independently in Vercel project settings.
- Shared packages must not read secret env vars at import time.
