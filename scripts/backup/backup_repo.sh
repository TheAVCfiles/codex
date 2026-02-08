#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="${ROOT_DIR:-$(pwd)}"
BACKUP_ROOT="${BACKUP_ROOT:-$ROOT_DIR/.backups}"
STAMP="${STAMP:-$(date -u +"%Y%m%dT%H%M%SZ")}" 
REPO_NAME="${REPO_NAME:-$(basename "$ROOT_DIR")}" 

mkdir -p "$BACKUP_ROOT"

BACKUP_DIR="$BACKUP_ROOT/${REPO_NAME}_$STAMP"
mkdir -p "$BACKUP_DIR"

printf "Saving backup to %s\n" "$BACKUP_DIR"

git -C "$ROOT_DIR" status --porcelain=v1 >/dev/null

git -C "$ROOT_DIR" bundle create "$BACKUP_DIR/${REPO_NAME}.bundle" --all

tar \
  --exclude "$BACKUP_ROOT" \
  --exclude "$ROOT_DIR/.git" \
  -czf "$BACKUP_DIR/${REPO_NAME}-workspace.tar.gz" \
  -C "$ROOT_DIR" \
  .

cat <<SUMMARY > "$BACKUP_DIR/README.txt"
Backup created: $STAMP
Repository: $REPO_NAME
Root: $ROOT_DIR

Files:
- ${REPO_NAME}.bundle (git history)
- ${REPO_NAME}-workspace.tar.gz (working tree snapshot)
SUMMARY

printf "Done.\n"
