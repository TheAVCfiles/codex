#!/usr/bin/env bash
set -euo pipefail

LASTNAME="${1:-YourLastName}"
DATESTR="$(date +%Y%m%d)"
FOLDER="PRATI_REQUEST_${LASTNAME}_${DATESTR}"
ZIPNAME="${FOLDER}.zip"

mkdir -p "$FOLDER"
cp 00_Cover_Turin_EN_IT.txt "$FOLDER/"
cp 01_Cover_Alessandria_EN_IT.txt "$FOLDER/"
cp 02_Cover_Essex_EN.txt "$FOLDER/"
cp 03_Prati_Affidavit_scans.txt "$FOLDER/"
cp 04_Provenance_Declaration_Notarized_EN_IT.txt "$FOLDER/"
cp 05_Readme_Attachments.txt "$FOLDER/"
cp 06_EvidenceMatrix.csv "$FOLDER/"
cp 07_Executive_Summary.txt "$FOLDER/"
cp 08_Italian_Push_Email.txt "$FOLDER/"

zip -r "$ZIPNAME" "$FOLDER" >/dev/null
printf 'ZIP created: %s\n' "$ZIPNAME"
