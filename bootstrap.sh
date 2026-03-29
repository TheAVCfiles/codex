#!/usr/bin/env bash
set -euo pipefail

echo "[stageport] bootstrap start"

REPO_NAME="stageport-system"
GITHUB_USER="TheAVCfiles"

if ! command -v gh >/dev/null 2>&1; then
  echo "[stageport] error: GitHub CLI (gh) is not installed"
  exit 1
fi

if ! gh auth status >/dev/null 2>&1; then
  echo "[stageport] GitHub CLI is not authenticated. Run: gh auth login"
  exit 1
fi

if gh repo view "$GITHUB_USER/$REPO_NAME" >/dev/null 2>&1; then
  echo "[stageport] repo exists: $GITHUB_USER/$REPO_NAME"
else
  echo "[stageport] creating repo: $GITHUB_USER/$REPO_NAME"
  gh repo create "$GITHUB_USER/$REPO_NAME" \
    --private \
    --description "GitHub-native StagePort pipeline with automated workflows and a self-explaining code scaffold" \
    --clone
fi

if [ -d "$REPO_NAME/.git" ]; then
  cd "$REPO_NAME"
else
  if [ ! -d "$REPO_NAME" ]; then
    git clone "https://github.com/$GITHUB_USER/$REPO_NAME.git"
  fi
  cd "$REPO_NAME"
fi

mkdir -p .github/workflows scripts data site/{demos,rooms,witness,assets} docs operator/state operator/docs

git add .
git commit -m "Bootstrap system scaffold" || true
git push origin main

echo "[stageport] bootstrap complete"
