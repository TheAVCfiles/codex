#!/usr/bin/env bash
set -euo pipefail

# Usage: ./notarize.sh artifact1 artifact2 ... -o out_bundle.zip
# Example:
# ./notarize.sh PyRouette_report.tex selfimproving_guidance.py cunning_mercy.html -o batch1_bundle.zip

OUT_ZIP="bundle_$(date +%Y%m%d_%H%M%S).zip"
FILES=()
while [[ $# -gt 0 ]]; do
  case "$1" in
    -o|--out) OUT_ZIP="$2"; shift 2 ;;
    *) FILES+=("$1"); shift ;;
  esac
done

if [ ${#FILES[@]} -eq 0 ]; then
  echo "No files provided. Usage: ./notarize.sh file1 file2 ... -o out.zip"
  exit 1
fi

# Create the zip
zip -r "$OUT_ZIP" "${FILES[@]}"

# Compute sha256
SHA256=$(shasum -a 256 "$OUT_ZIP" | awk '{print $1}')
echo "Bundle: $OUT_ZIP"
echo "SHA256: $SHA256" > "${OUT_ZIP}.sha256"
echo "SHA256 saved to ${OUT_ZIP}.sha256"

# Optional: GPG sign (if GPG is configured)
if command -v gpg >/dev/null 2>&1; then
  gpg --armor --detach-sign "${OUT_ZIP}.sha256" || true
  echo "GPG signature written: ${OUT_ZIP}.sha256.asc"
fi

# If ipfs is installed, pin the bundle and return CID
CID=""
if command -v ipfs >/dev/null 2>&1; then
  CID=$(ipfs add -Q "$OUT_ZIP")
  echo "Pinned to IPFS. CID: $CID"
  echo "$CID" > "${OUT_ZIP}.cid"
else
  echo "ipfs CLI not found; skipping IPFS pin. Install go-ipfs or use web pin service."
fi

echo "To notarize on-chain, run: node scripts/notarize.js --hash 0x${SHA256} --cid ${CID:-''}"
