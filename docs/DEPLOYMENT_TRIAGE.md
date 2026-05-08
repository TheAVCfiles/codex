# Deployment Triage Policy

## Purpose

This repository uses **selective deployment triage** to keep live/dynamic surfaces stable while ensuring static and governance surfaces remain publishable even when unrelated Vercel checks fail.

## Deployment Classes

### 1) Keep on Vercel (dynamic/live)

Use Vercel for surfaces that need runtime capabilities:

- serverless or edge functions
- backend runtime behavior
- database-backed interactions
- preview/runtime features that are actively used in production

### 2) Publish via GitHub Pages (static/preservation)

Use GitHub Pages for static and preservation surfaces:

- documentation
- crawler-facing files (JSON-LD, metadata, policy docs)
- `llms.txt`, `ai-rights.txt`
- governance notes
- static dashboards and static frontends

### 3) Archive/Pause

Pause or archive low-value deployment noise:

- duplicate PR branches
- failed Codex dump branches
- old `v0` experiments without active operational value
- unused forks that consume deployment cycles

## Decision Rule

- If a Vercel surface deploys successfully and is useful, **keep it on Vercel**.
- If a Vercel surface repeatedly fails (especially `v0-neon-community-starter`), **move static output to GitHub Pages** or **mark it paused**.
- GitHub Pages is **not** a replacement for dynamic APIs; it is a static preservation and fallback rail.

## PR Triage Checklist

Before merging any PR, check:

- [ ] Does this PR change only docs/static metadata?
- [ ] Does this PR require Vercel runtime features?
- [ ] Can this change publish through GitHub Pages?
- [ ] Does this PR touch backend/serverless/database code?
- [ ] Is this PR a duplicate of an existing PR?

## Operator Workflow

1. Keep production-grade dynamic surfaces on Vercel.
2. Route static/governance/crawler updates through GitHub Pages.
3. Do not let unrelated Vercel failures block static-only merges.
4. Periodically close duplicate or stale rescue branches.
