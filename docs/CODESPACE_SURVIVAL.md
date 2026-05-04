# Codespace Survival Guide

Codespaces are temporary development environments. Your **repository branch and pushed commits** are the durable system of record.

## If GitHub warns your Codespace may be deleted

1. Run a health check:
   ```bash
   bash scripts/git-health-check.sh
   ```
2. Snapshot your current work:
   ```bash
   bash scripts/codespace-snapshot.sh
   ```
3. Push all serious work before ending your session.
4. Open a pull request for review/merge.

## Required safety setup

Configure repo-local Git hooks:

```bash
git config core.hooksPath .githooks
```

## Terms

- **Uncommitted changes**: modified tracked files not yet committed.
- **Untracked files**: new files Git sees but does not track yet.
- **Unpushed commits**: local commits not yet sent to remote.
- **Safety branch**: a dedicated branch for preservation snapshots.
- **Pull request**: GitHub review/merge request from one branch into another (often `main`).

## Commands

- `bash scripts/git-health-check.sh` to detect risky Git state before closing a Codespace.
- `bash scripts/codespace-snapshot.sh` to capture and push safe in-progress work.
