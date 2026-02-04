# Backup and Recovery

This repository includes local-first backup scripts so your work is preserved even when you need to step away quickly. The flow creates both a full git history bundle and a compressed snapshot of the working tree.

## Quick start

From the repository root:

```bash
scripts/backup/backup_repo.sh
```

This creates a timestamped folder in `.backups/` containing:

- `codex.bundle` – full git history bundle
- `codex-workspace.tar.gz` – compressed working tree snapshot

## Configure the backup location

Set `BACKUP_ROOT` to store backups elsewhere (external drive, synced folder, etc.):

```bash
BACKUP_ROOT="/Volumes/RescueDrive/codex" scripts/backup/backup_repo.sh
```

## Verify a backup

```bash
scripts/backup/verify_backup.sh .backups/codex_20240101T000000Z
```

## Restore from a backup

```bash
scripts/backup/restore_repo.sh .backups/codex_20240101T000000Z ~/restored/codex
```

This restores the working tree snapshot and then reattaches the full git history.

## Suggested routine

- Run `scripts/backup/backup_repo.sh` before major changes or at the end of each working session.
- Copy the `.backups/` folder to a secondary device or encrypted drive.
- Keep at least two copies in separate locations whenever possible.
