# Pull Request Checklist

## Deployment triage

- [ ] This PR requires Vercel runtime behavior
- [ ] This PR is static and can publish to GitHub Pages
- [ ] This PR touches docs, crawler, governance, or metadata only
- [ ] This PR touches backend, database, auth, or serverless code
- [ ] This PR is a duplicate cleanup candidate

## Notes

If Vercel fails but the PR is static, documentation-only, governance-only, or crawler-only, do not block the PR solely on unrelated Vercel failures.

Use GitHub Pages fallback when appropriate.
