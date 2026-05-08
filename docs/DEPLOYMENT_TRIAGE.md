# Deployment Triage Policy

This repository uses selective deployment, not blanket deployment.

## Core rule

Working Vercel surfaces persist. Failed or static Vercel surfaces move to GitHub Pages.

## Deployment classes

### Keep on Vercel

Use Vercel for live apps that need one or more of the following:

- serverless functions
- dynamic runtime behavior
- backend routes
- database integrations
- auth flows
- preview deployments that are actively useful

If a Vercel project deploys successfully and serves a valuable live surface, keep it connected.

### Move to GitHub Pages

Use GitHub Pages for static and preservation surfaces:

- documentation
- governance notes
- crawler-readable files
- JSON-LD
- `llms.txt`
- `ai-rights.txt`
- `robots.txt`
- `sitemap.xml`
- static dashboards
- static React or Vite builds
- preservation pages

GitHub Pages is the static fallback rail. It does not replace dynamic APIs.

### Pause or archive

Pause or archive surfaces that are:

- duplicate Codex dumps
- failed v0 experiments
- old fork branches
- unused preview apps
- branches that burn deployment minutes without producing a usable surface

## Failure rule

If Vercel succeeds and the app is useful, keep it.

If Vercel fails, especially on `v0-neon-community-starter`, do not let that failure block docs, crawler, governance, or static PRs. Move the static output to GitHub Pages or mark the surface as paused.

## PR checklist

Before merging a PR, ask:

- Does this PR change only docs or static metadata?
- Does it actually need Vercel?
- Can it publish through GitHub Pages?
- Does it touch backend, serverless, database, or auth code?
- Is this PR a duplicate of another branch?

## Operator rule

Vercel is for living dynamic apps.

GitHub Pages is for preservation, crawler truth, docs, static dashboards, and fallback continuity.

Failed Vercel surfaces get evacuated to Pages. Working Vercel surfaces persist.
