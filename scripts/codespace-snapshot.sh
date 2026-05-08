#!/usr/bin/env bash
set -euo pipefail

timestamp="$(date -u +%Y%m%d-%H%M)"
branch="$(git branch --show-current)"

if [[ -z "$branch" ]]; then
  echo "Unable to determine current branch."
  exit 1
fi

git status

if [[ -z "$(git status --porcelain)" ]]; then
  echo "No changes to snapshot."
  exit 0
fi

secret_patterns=(
  '(^|/)\.env($|\.)'
  '(^|/)secrets?($|/)'
  '\.pem$'
  '\.key$'
  'id_rsa$'
  'id_ed25519$'
  'credentials?'
  'apikey|api_key|token'
  '^node_modules/'
)

mapfile -t changed_files < <(git status --porcelain | awk '{print $2}')
safe_files=()
blocked_files=()

for file in "${changed_files[@]}"; do
  is_blocked=0
  for pattern in "${secret_patterns[@]}"; do
    if [[ "$file" =~ $pattern ]]; then
      blocked_files+=("$file")
      is_blocked=1
      break
    fi
  done
  if [[ $is_blocked -eq 0 ]]; then
    safe_files+=("$file")
  fi
done

if [[ ${#blocked_files[@]} -gt 0 ]]; then
  printf 'Refusing to commit potentially sensitive files:\n'
  printf ' - %s\n' "${blocked_files[@]}"
fi

if [[ ${#safe_files[@]} -eq 0 ]]; then
  echo "No safe files to snapshot after secret checks."
  exit 1
fi

git add -- "${safe_files[@]}"

if git diff --cached --quiet; then
  echo "No staged changes to commit after filtering."
  exit 0
fi

git commit -m "Codespace snapshot ${timestamp}"
git push -u origin "$branch"

echo "Snapshot complete on branch: $branch"
echo "Next steps:"
echo "  1) Review the commit: git log --oneline -1"
echo "  2) Verify push: git status"
echo "  3) Open a PR if this branch contains work for main"
