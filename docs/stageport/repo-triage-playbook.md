# StagePort Repo Triage Playbook

## Intent

This playbook turns repo sprawl into a deliberate stage model:

- **Stage**: public-facing, canonical repositories.
- **Wings**: deployable app surfaces.
- **Archive/Lab**: experiments and scaffolds kept off the public stage.

## Canonical Public Repositories

### 1) `stageport`

Enterprise and systems core.

Suggested structure:

- `architecture/`
- `docs/`
- `case-capsule/`
- `command-center/`
- `engine/`

### 2) `decrypt-the-girl`

Narrative and cipher system.

Suggested structure:

- `poetry/`
- `ciphers/`
- `narrative-engines/`
- `observational-essays/`

### 3) `avc-systems`

Umbrella presentation layer for collaborators/investors.

Suggested structure:

- `observation-deck/`
- `system-overview/`
- `whitepaper/`
- `pitch/`

## Lab Policy (Backstage)

Move starter kits, framework probes, and temporary explorations into a non-public workspace (for example: `lab/` or `forge/`).

Examples of lab-class repos:

- template starters (`vite-react`, docs starters, astro starters)
- one-off SDK tests
- framework experiments not tied to a current release

Rule: **finished acts only on stage**.

## Vercel Stabilization Pattern

Use a single deployment repo with app folders to reduce duplicate pipelines and billing noise.

```text
/apps
  /stageport
  /dtg
  /observation-deck
```

Recommended setup:

1. One canonical deployment repo.
2. One Vercel project per real app surface (or one monorepo project with explicit root directories).
3. Explicit `Root Directory` for each deployed app.
4. Framework preset must match actual app type (for example, Vite vs Next.js).

## 90-Minute Cleanup Sequence

1. **Freeze**: choose the canonical `stageport` deployment root.
2. **Silence noise**: disable failing non-critical workflows temporarily.
3. **Classify repos**: `stage`, `wing`, or `lab`.
4. **Consolidate docs**: move command-center and strategy docs into canonical locations.
5. **Normalize deploy settings**: verify framework, root directory, and output directory in Vercel.
6. **Re-enable CI selectively**: only for canonical stage repos.
7. **Archive leftovers**: rename/mark experimental repos as lab artifacts.

## Operational Guardrails

- Avoid creating new public repos for short-term experiments.
- Keep one source of truth per subsystem.
- Require a role label for every repo: `stage`, `wing`, or `lab`.
- Treat deployment config drift as a production issue.

## Success Criteria

- Every public repo maps to a clear narrative or system role.
- Vercel projects deploy from known root directories.
- CI failures are signal, not ambient noise.
- External collaborators can understand the system in under 5 minutes.
