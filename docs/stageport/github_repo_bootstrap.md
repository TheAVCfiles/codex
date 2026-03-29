# GitHub Repository Bootstrap (Create + Scaffold + Actions)

This guide automates StagePort-style repository creation and initial scaffolding.

## Prerequisites

- A GitHub Personal Access Token in `GITHUB_TOKEN` with repository permissions.
- Local `git` configured with credentials that can push to the target owner/org.
- Python 3.11+.

## One-command bootstrap

```bash
python scripts/github_bootstrap_repo.py \
  --owner TheAVCfiles \
  --repo stageport-system \
  --private
```

Optional flags:

- `--description "..."`
- `--default-branch main`
- `--enable-pages`

## What gets created

- GitHub repo via `POST /user/repos`
- Scaffolded project tree:
  - `.github/workflows/pages.yml`
  - `scripts/` with placeholder pipeline scripts
  - `docs/`, `data/`, `site/`
  - `README.md`, `.gitignore`
- Initial commit and push to default branch.

## Notes

- The workflow deploys `./site` using `peaceiris/actions-gh-pages`.
- `--enable-pages` calls the Pages API after scaffold push; practical publishing still depends on a successful `gh-pages` branch deployment.
