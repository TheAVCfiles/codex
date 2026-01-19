import json
import os
import zipfile
from datetime import datetime

from index_builder import generate_index
from manifest import generate_manifest
from pdf_summary import generate_pdf_summary

# Paths
ROOT = os.path.dirname(os.path.dirname(__file__))
INBOX = os.path.join(ROOT, 'inbox')
CORE = os.path.join(ROOT, 'core')
EXPORTS = os.path.join(ROOT, 'exports')
STATE = os.path.join(ROOT, 'state')
LAST_BUILD_FILE = os.path.join(STATE, 'last_build.json')

# Load last build
with open(LAST_BUILD_FILE, 'r') as f:
    state = json.load(f)
last_build = state['last_build']

# Get new files
new_files = []
last_build_timestamp = datetime.strptime(last_build, '%Y-%m-%d').timestamp()
for root, _, files in os.walk(INBOX):
    for file in files:
        file_path = os.path.join(root, file)
        if os.path.getmtime(file_path) > last_build_timestamp:
            new_files.append(file_path)
if not new_files:
    print("No new files. Exiting.")
    raise SystemExit(0)

# Validate file types
allowed = {'.png', '.jpg', '.pdf'}
for file in new_files:
    ext = os.path.splitext(file)[1].lower()
    if ext not in allowed:
        raise ValueError(f"Invalid file type: {file}")

# Build date
build_date = datetime.now().strftime('%Y%m%d')
zip_name = f'AUDIT_CORE_{build_date}.zip'
zip_path = os.path.join(EXPORTS, zip_name)

# Create ZIP
with zipfile.ZipFile(zip_path, 'w') as z:
    # Add core
    for root, _, files in os.walk(CORE):
        for file in files:
            z.write(os.path.join(root, file), arcname=file)

    # Add new evidence
    for file in new_files:
        arcname = os.path.relpath(file, INBOX)
        z.write(file, arcname='EVIDENCE/' + arcname)

    # Generate + add index
    index_path = generate_index(new_files)
    z.write(index_path, arcname='FINDINGS/INDEX.csv')

    # Generate + add manifest
    manifest_path = generate_manifest(zip_path)  # Temp zip for manifest
    z.write(manifest_path, arcname='METADATA/MANIFEST.csv')

    # Optional PDF
    pdf_path = generate_pdf_summary(new_files, build_date)
    z.write(pdf_path, arcname='FINDINGS/SNAPSHOT_SUMMARY.pdf')

# Check size
if os.path.getsize(zip_path) > 20 * 1024 * 1024:
    raise ValueError("ZIP exceeds 20MB")

# Update state
state['last_build'] = datetime.now().strftime('%Y-%m-%d')
with open(LAST_BUILD_FILE, 'w') as f:
    json.dump(state, f)

print(f"Build complete: {zip_name}")
