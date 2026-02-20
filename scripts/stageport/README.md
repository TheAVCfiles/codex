# StagePort utilities

This folder contains lightweight Python helpers for StagePort workflows.

## Generating the StagePort System Bible PDF

1. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
2. Render the upgraded Bible (V2) to a PDF:
   ```bash
   python stageport_bible.py --output ./dist/StagePort_System_Bible_Upgraded.pdf
   ```

The script registers the `HeiseiMin-W3` font for broad Unicode coverage and
creates parent folders for the destination automatically.

## Generating the Founding Faculty Premiere Invitation

1. Install dependencies (if not already installed):
   ```bash
   pip install -r requirements.txt
   ```
2. Render the invitation one-pager:
   ```bash
   python premiere_pitch.py --output ./dist/Founding_Faculty_Premiere_Invitation.pdf
   ```

The script centers the masthead, preserves the covenant language, and builds
bullet lists for packet contents and corridor actions. Directories for the
output path are created automatically.

## PAS DE CHAT VAULT helper

Use `pas_de_chat_vault.py` for Airtable capture + rinse workflows aligned with the
`Table 1` schema (`Name`, `MemJar`, `Status`).

### Push a verbatim capture

```bash
export AIRTABLE_API_KEY=...
python pas_de_chat_vault.py push --raw-file /path/to/capture.txt
# or:
echo "Pas de chat push" | python pas_de_chat_vault.py push
```

### Run rinse (Todo → Done)

```bash
export AIRTABLE_API_KEY=...
python pas_de_chat_vault.py rinse
```

Notes:

- `push` stores the exact raw bytes as `Name` and only writes `Name`, `MemJar`, and `Status`.
- Empty captures are skipped.
- `rinse` computes SHA-256 from `Name`, prints a concise Gossip Rag, then patches `Status` to `Done`.

## NAAB Bridge Kit builder

Build the Syracuse ENV-ARC evidence scaffold, deterministic manifest, and optional ZIP:

```bash
python build_bridge_kit.py --output SYR_ENV_ARC_PILOT_2026 --studio-id SYR_ENV_ARC_PILOT_2026 --zip
```

Useful flags:

- `--timestamp <ISO8601>`: freeze generated timestamps for reproducible outputs.
- `--force`: overwrite scaffold artifacts if they already exist.
- `--zip`: package a deterministic archive after manifest generation.

The builder also prints a Merkle root over manifest lines. The PC.8 proof schema used for validation is stored at `schemas/spc_pc8_equity_proof.schema.json`.

## Generating AVC Welcome Stack PDFs

1. Install dependencies (if not already installed):
   ```bash
   pip install -r requirements.txt
   ```
2. Generate PDF #2 and #3 in `/mnt/data` (default):
   ```bash
   python avc_welcome_stack.py
   ```
3. Optionally generate all three PDFs (#1/#2/#3):
   ```bash
   python avc_welcome_stack.py --include-welcome
   ```
4. Write output somewhere else:
   ```bash
   python avc_welcome_stack.py --output-dir ./dist
   ```
