# Codex Task — Unpack StagePort × CueR Public Demo Submission

## Goal
Turn the attached base64 ZIP payload into a clean repository folder for the StagePort × CueR public demo submission.

## Payload
The ZIP payload should be provided to Codex as `stageport-cuer-submission.zip`, then copied into a temporary unpack directory.

## Required steps

1. Unpack the ZIP:

```bash
mkdir -p /tmp/stageport-cuer/unpacked
unzip -q stageport-cuer-submission.zip -d /tmp/stageport-cuer/unpacked
```

2. Copy the public demo slice into the repository under:

`submissions/stageport-cuer-public-demo/`

Use this source path from the unzipped payload:

`/tmp/stageport-cuer/unpacked/submission/public-demo/`

3. Do **not** copy the duplicate top-level `submission/*.md` files unless they are needed. The curated copy already exists under `public-demo/docs/`.

4. Add or preserve a `.gitignore` that excludes runtime/cache/build output:

```gitignore
node_modules/
dist/
build/
.vite/
.env
.env.*
!.env.example
__pycache__/
*.pyc
.pytest_cache/
.venv/
.DS_Store
```

5. Commit the unpacked submission:

```bash
git add submissions/stageport-cuer-public-demo .gitignore
git commit -m "Add StagePort CueR public demo submission"
```

## Guardrails

- This is a public-safe review slice, not the canonical runnable production app.
- Preserve `NOTICE`, `README.md`, `docs/IP_BOUNDARY.md`, and `docs/PUBLIC_DEMO_SCOPE.md`.
- Do not invent deployment claims.
- Do not add secrets.
- Do not convert placeholder env vars into real credentials.
- Do not flatten the folder names unless needed for GitHub rendering.

## Expected final tree

```text
submissions/stageport-cuer-public-demo/
├─ README.md
├─ NOTICE
├─ .env.example
├─ docs/
├─ frontend/
├─ backend/
├─ agent/
└─ shared/
```

## PR summary to use

Add the StagePort × CueR public demo submission slice for review. This commit preserves the IP/compliance boundary, keeps only sanitized `.env.example` files, and stages the source under `submissions/stageport-cuer-public-demo/` as a bounded public review artifact.
