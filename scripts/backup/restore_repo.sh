#!/usr/bin/env bash
set -euo pipefail

if [ "$#" -lt 2 ]; then
  echo "Usage: $0 <backup_dir> <restore_dir>" >&2
  exit 1
fi

BACKUP_DIR="$1"
RESTORE_DIR="$2"

BUNDLE_FILE=$(ls "$BACKUP_DIR"/*.bundle 2>/dev/null | head -n 1 || true)
TAR_FILE=$(ls "$BACKUP_DIR"/*-workspace.tar.gz 2>/dev/null | head -n 1 || true)

if [ -z "$BUNDLE_FILE" ] && [ -z "$TAR_FILE" ]; then
  echo "No backup bundle or workspace tarball found in $BACKUP_DIR" >&2
  exit 1
fi

mkdir -p "$RESTORE_DIR"

if [ -n "$TAR_FILE" ]; then
  echo "Restoring workspace snapshot from $TAR_FILE"
  tar -xzf "$TAR_FILE" -C "$RESTORE_DIR"
fi

if [ -n "$BUNDLE_FILE" ]; then
  echo "Restoring git history from $BUNDLE_FILE"
  if [ ! -d "$RESTORE_DIR/.git" ]; then
    git init "$RESTORE_DIR" >/dev/null
  fi
  git -C "$RESTORE_DIR" fetch "$BUNDLE_FILE" "refs/*:refs/*"
  git -C "$RESTORE_DIR" checkout -f
fi

printf "Restore complete: %s\n" "$RESTORE_DIR"
