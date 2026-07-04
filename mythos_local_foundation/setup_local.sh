#!/usr/bin/env bash
set -euo pipefail

python3 -m venv .venv
source .venv/bin/activate
python -m pip install --upgrade pip
pip install -r requirements.txt

echo "✅ Local environment initialized."
echo "Run: source .venv/bin/activate && uvicorn server:app --reload"
