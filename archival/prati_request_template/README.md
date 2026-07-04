# Prati / Van Cura Archival Freeze Packet Template

This folder contains ready-to-fill templates and build scripts for generating:

`PRATI_REQUEST_[YourLastName]_[YYYYMMDD].zip`

## Included template files

- `00_Cover_Turin_EN_IT.txt`
- `01_Cover_Alessandria_EN_IT.txt`
- `02_Cover_Essex_EN.txt`
- `03_Prati_Affidavit_scans.txt`
- `04_Provenance_Declaration_Notarized_EN_IT.txt`
- `05_Readme_Attachments.txt`
- `06_EvidenceMatrix.csv`
- `07_Executive_Summary.txt`
- `08_Italian_Push_Email.txt`
- `build_prati_zip.sh`
- `build_prati_zip.ps1`

## Quick use

1. Edit placeholders in all template files (`[Your full name]`, dates, contacts, etc.).
2. Replace `03_Prati_Affidavit_scans.txt` with actual scan files if available.
3. Run either script:
   - macOS/Linux: `bash build_prati_zip.sh`
   - Windows PowerShell: `./build_prati_zip.ps1`
4. The scripts create a date-stamped folder and ZIP archive in the current directory.
