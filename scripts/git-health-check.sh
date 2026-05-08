#!/usr/bin/env bash
set -euo pipefail

current_branch="$(git branch --show-current)"
remote_summary="$(git remote -v || true)"
status_porcelain="$(git status --porcelain)"
unpushed="$(git log --oneline @{u}..HEAD 2>/dev/null || true)"
latest_commit="$(git log --oneline -1)"

printf 'Branch: %s\n' "$current_branch"
printf 'Remotes:\n%s\n' "${remote_summary:-<none>}"
printf 'Latest commit: %s\n' "$latest_commit"

printf '\nUncommitted changes:\n'
git diff --name-status || true

printf '\nUntracked files:\n'
git ls-files --others --exclude-standard || true

printf '\nUnpushed commits:\n'
if [[ -n "$unpushed" ]]; then
  printf '%s\n' "$unpushed"
else
  printf 'None\n'
fi

if [[ -n "$status_porcelain" || -n "$unpushed" ]]; then
  echo "\nGit health check failed: repository has uncommitted changes and/or unpushed commits."
  exit 1
fi

echo "\nGit health check passed: clean working tree and no unpushed commits."
