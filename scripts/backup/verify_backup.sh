#!/usr/bin/env bash
set -euo pipefail

BACKUP_DIR="${1:-}"

if [ -z "$BACKUP_DIR" ]; then
  echo "Usage: $0 <backup_dir>" >&2
  exit 1
fi

BUNDLE_FILE=$(ls "$BACKUP_DIR"/*.bundle 2>/dev/null | head -n 1 || true)
TAR_FILE=$(ls "$BACKUP_DIR"/*-workspace.tar.gz 2>/dev/null | head -n 1 || true)

if [ -n "$BUNDLE_FILE" ]; then
  git bundle verify "$BUNDLE_FILE"
else
  echo "No bundle found in $BACKUP_DIR" >&2
  exit 1
fi

if [ -n "$TAR_FILE" ]; then
  tar -tzf "$TAR_FILE" >/dev/null
else
  echo "No workspace snapshot found in $BACKUP_DIR" >&2
  exit 1
fi

printf "Backup verified: %s\n" "$BACKUP_DIR"
