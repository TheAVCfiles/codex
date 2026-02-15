#!/usr/bin/env python3
"""Push a raw memory entry into Airtable RAW_INGEST.

Environment variables:
- AIRTABLE_TOKEN: Personal access token
- AIRTABLE_BASE_ID: Airtable base id
- AIRTABLE_TABLE: Optional table name (defaults to RAW_INGEST)
"""

from __future__ import annotations

import json
import os
from typing import Iterable

import requests


AIRTABLE_TOKEN = os.environ["AIRTABLE_TOKEN"]
BASE_ID = os.environ["AIRTABLE_BASE_ID"]
TABLE = os.environ.get("AIRTABLE_TABLE", "RAW_INGEST")


def push_raw(
    raw_text: str,
    source: str = "ChatGPT",
    project: str = "Admin",
    tags: Iterable[str] | None = None,
) -> dict:
    """Create a RAW_INGEST record and return the Airtable response payload."""
    url = f"https://api.airtable.com/v0/{BASE_ID}/{TABLE}"
    headers = {
        "Authorization": f"Bearer {AIRTABLE_TOKEN}",
        "Content-Type": "application/json",
    }
    payload = {
        "fields": {
            "Source": source,
            "Project": project,
            "Raw_Text": raw_text,
            "Tags": list(tags or []),
        }
    }
    response = requests.post(url, headers=headers, data=json.dumps(payload), timeout=30)
    response.raise_for_status()
    return response.json()


if __name__ == "__main__":
    text = input("Paste RAW_INGEST text:\n")
    result = push_raw(text)
    print("Created:", result.get("id"))
