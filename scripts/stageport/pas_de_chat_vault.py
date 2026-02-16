#!/usr/bin/env python3
"""PAS DE CHAT VAULT utility.

Commands:
- push: capture raw text verbatim into Airtable and emit a salvage summary.
- rinse: fetch Todo records, hash Name content, print Gossip Rag summary, mark Done.

Environment variables:
- AIRTABLE_API_KEY (or AIRTABLE_TOKEN / AIRTABLE_PAT)
- AIRTABLE_BASE_ID (default: appS16p6gJO5U78JS)
- AIRTABLE_TABLE (default: Table 1)
"""

from __future__ import annotations

import argparse
import hashlib
import json
import os
import re
import sys
from collections import Counter
from dataclasses import dataclass
from typing import Any
from urllib.parse import quote


DEFAULT_BASE_ID = "appS16p6gJO5U78JS"
DEFAULT_TABLE = "Table 1"
VALID_CATEGORIES = {"ChatGPT", "File", "Idea", "Other"}
VALID_STATUS = {"Todo", "In progress", "Done"}
STOPWORDS = {
    "the",
    "and",
    "for",
    "with",
    "that",
    "this",
    "from",
    "are",
    "you",
    "your",
    "not",
    "all",
    "into",
    "then",
    "them",
    "will",
    "have",
    "hash",
    "todo",
    "done",
    "chat",
}


@dataclass
class SalvageSummary:
    category: str
    keywords: list[str]
    why_it_matters: str
    next_action: str


def _require_requests():
    try:
        import requests  # type: ignore

        return requests
    except ModuleNotFoundError as exc:
        raise RuntimeError("Missing dependency: requests. Install with `pip install requests`.") from exc


def _api_key() -> str:
    key = (
        os.environ.get("AIRTABLE_API_KEY")
        or os.environ.get("AIRTABLE_TOKEN")
        or os.environ.get("AIRTABLE_PAT")
    )
    if not key:
        raise RuntimeError("Set AIRTABLE_API_KEY (or AIRTABLE_TOKEN / AIRTABLE_PAT).")
    return key


def _api_root() -> str:
    base_id = os.environ.get("AIRTABLE_BASE_ID", DEFAULT_BASE_ID)
    table = os.environ.get("AIRTABLE_TABLE", DEFAULT_TABLE)
    return f"https://api.airtable.com/v0/{base_id}/{quote(table, safe='')}"


def _headers() -> dict[str, str]:
    return {
        "Authorization": f"Bearer {_api_key()}",
        "Content-Type": "application/json",
    }


def _infer_category(raw: str, explicit: str | None = None) -> str:
    if explicit:
        return explicit if explicit in VALID_CATEGORIES else "ChatGPT"

    lowered = raw.lower()
    if re.search(r"\b(pdf|\.txt|\.md|\.zip|\/mnt\/data|file|attachment)\b", lowered):
        return "File"
    if re.search(r"\bidea|concept|brainstorm|proposal|vision\b", lowered):
        return "Idea"
    return "ChatGPT"


def _extract_keywords(raw: str, limit: int = 6) -> list[str]:
    words = re.findall(r"[a-zA-Z][a-zA-Z0-9_-]{2,}", raw.lower())
    counts = Counter(w for w in words if w not in STOPWORDS)
    return [word for word, _ in counts.most_common(limit)]


def _salvage(raw: str, category: str) -> SalvageSummary:
    keywords = _extract_keywords(raw)
    if not keywords:
        keywords = ["capture", "archive", "forensics"]

    why = (
        "This capture preserves operator intent and implementation details in a verifiable form, "
        "which protects downstream synthesis and auditability."
    )
    next_action = "Review keywords, then run `rinse` to hash and close Todo records."
    return SalvageSummary(
        category=category,
        keywords=keywords,
        why_it_matters=why,
        next_action=next_action,
    )


def _read_raw(args: argparse.Namespace) -> str:
    if args.raw_text is not None:
        return args.raw_text
    if args.raw_file:
        with open(args.raw_file, "r", encoding="utf-8") as handle:
            return handle.read()
    if not sys.stdin.isatty():
        return sys.stdin.read()
    return ""


def push(args: argparse.Namespace) -> int:
    raw = _read_raw(args)
    if raw == "":
        print("RAW capture is empty; no record created.")
        return 0

    category = _infer_category(raw, args.category)
    salvage = _salvage(raw, category)
    payload = {
        "records": [
            {
                "fields": {
                    "Name": raw,
                    "MemJar": salvage.category,
                    "Status": "Todo",
                }
            }
        ],
        "typecast": True,
    }

    requests = _require_requests()
    response = requests.post(_api_root(), headers=_headers(), json=payload, timeout=30)
    response.raise_for_status()
    body = response.json()
    record_id = body.get("records", [{}])[0].get("id")

    print(f"record_id: {record_id}")
    print("salvage:")
    print(f"  category: {salvage.category}")
    print(f"  keywords: {', '.join(salvage.keywords)}")
    print(f"  why_it_matters: {salvage.why_it_matters}")
    print(f"  next_action: {salvage.next_action}")
    return 0


def _fetch_todos() -> list[dict[str, Any]]:
    records: list[dict[str, Any]] = []
    params: dict[str, str] = {"filterByFormula": "{Status}='Todo'"}
    while True:
        requests = _require_requests()
        response = requests.get(_api_root(), headers=_headers(), params=params, timeout=30)
        response.raise_for_status()
        payload = response.json()
        records.extend(payload.get("records", []))
        offset = payload.get("offset")
        if not offset:
            break
        params["offset"] = offset
    return records


def _patch_done(record_ids: list[str]) -> None:
    for i in range(0, len(record_ids), 10):
        chunk = record_ids[i : i + 10]
        payload = {
            "records": [
                {
                    "id": rec_id,
                    "fields": {
                        "Status": "Done",
                    },
                }
                for rec_id in chunk
            ]
        }
        requests = _require_requests()
        response = requests.patch(_api_root(), headers=_headers(), json=payload, timeout=30)
        response.raise_for_status()


def rinse(_: argparse.Namespace) -> int:
    records = _fetch_todos()
    if not records:
        print("Gossip Rag — Nothing to rinse. (0 Todo records)")
        return 0

    print("Gossip Rag — This Week's Rinse")
    print(f"Total Todos: {len(records)}")

    ids: list[str] = []
    for index, rec in enumerate(records, start=1):
        fields = rec.get("fields", {})
        name = str(fields.get("Name", ""))
        memjar = str(fields.get("MemJar", "ChatGPT"))
        digest = hashlib.sha256(name.encode("utf-8")).hexdigest()
        preview = " ".join(name.split())
        if len(preview) > 72:
            preview = preview[:71] + "…"
        print(f"{index:2d}) {memjar:<9} {digest[:12]}…  [{preview}]")
        ids.append(rec["id"])

    _patch_done(ids)
    print("Status patched: Done ✅")
    return 0


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="PAS DE CHAT VAULT helper")
    subparsers = parser.add_subparsers(dest="command", required=True)

    push_parser = subparsers.add_parser("push", help="Push verbatim raw capture into Airtable")
    push_parser.add_argument("--raw-text", help="Raw text content to store verbatim")
    push_parser.add_argument("--raw-file", help="Path to a file whose full content becomes Name")
    push_parser.add_argument(
        "--category",
        choices=sorted(VALID_CATEGORIES),
        help="Optional MemJar override (defaults to inferred or ChatGPT)",
    )
    push_parser.set_defaults(func=push)

    rinse_parser = subparsers.add_parser("rinse", help="Hash Todo Name entries and mark Done")
    rinse_parser.set_defaults(func=rinse)

    return parser.parse_args()


def main() -> int:
    args = parse_args()
    return args.func(args)


if __name__ == "__main__":
    raise SystemExit(main())
