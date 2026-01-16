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

## Generating the Timing Packet PDFs

1. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
2. Generate the three timing PDFs and the merged packet:
   ```bash
   python timing_packet.py --output-dir ./dist --base-packet /path/to/Record_Integrity_Spine_AVC_MASTER_PACKET_v2_BOOKMARKED.pdf
   ```

The script outputs three standalone PDFs plus a merged packet named
`Record_Integrity_Spine_AVC_MASTER_PACKET_v3_TIMING.pdf` by default. Use
`--merged-name` to override the output filename.
