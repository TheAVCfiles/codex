#!/usr/bin/env python3
"""PAS DE CHAT VAULT helper for Airtable capture and rinse workflows.

Commands
- push: capture raw text verbatim into Airtable (`Name`), then print salvage summary.
- rinse: fetch Todo records, print concise hash summary, patch records to Done.

Environment
- AIRTABLE_PAT (preferred) or AIRTABLE_TOKEN / AIRTABLE_KEY
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
import textwrap
from dataclasses import dataclass
from typing import Any
from urllib.parse import quote


def _require_requests() -> Any:
    try:
        import requests  # type: ignore

        return requests
    except ModuleNotFoundError as exc:
        raise RuntimeError(
            "The 'requests' package is required. Install with: pip install requests"
        ) from exc


MEMJAR_VALUES = {"ChatGPT", "File", "Idea", "Other"}


@dataclass
class AirtableConfig:
    token: str
    base_id: str = "appS16p6gJO5U78JS"
    table: str = "Table 1"

    @property
    def url(self) -> str:
        return f"https://api.airtable.com/v0/{self.base_id}/{quote(self.table, safe='')}"


@dataclass
class Salvage:
    category: str
    keywords: list[str]
    why_it_matters: str
    next_action: str


def _token() -> str:
    token = (
        os.environ.get("AIRTABLE_PAT")
        or os.environ.get("AIRTABLE_TOKEN")
        or os.environ.get("AIRTABLE_KEY")
    )
    if not token:
        raise RuntimeError("Set AIRTABLE_PAT (or AIRTABLE_TOKEN / AIRTABLE_KEY)")
    return token


def _config(require_token: bool = True) -> AirtableConfig:
    token = _token() if require_token else ""
    return AirtableConfig(
        token=token,
        base_id=os.environ.get("AIRTABLE_BASE_ID", "appS16p6gJO5U78JS"),
        table=os.environ.get("AIRTABLE_TABLE", "Table 1"),
    )


def _headers(token: str) -> dict[str, str]:
    return {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json",
    }


def _extract_keywords(raw: str, *, max_items: int = 8) -> list[str]:
    tokens = re.findall(r"[A-Za-z][A-Za-z0-9_-]{2,}", raw.lower())
    stop = {
        "the",
        "and",
        "for",
        "with",
        "from",
        "this",
        "that",
        "into",
        "your",
        "you",
        "are",
        "not",
        "all",
        "but",
        "was",
        "have",
        "has",
        "will",
        "then",
        "they",
        "their",
        "table",
        "status",
        "name",
        "raw",
    }
    freq: dict[str, int] = {}
    for tok in tokens:
        if tok in stop or len(tok) < 4:
            continue
        freq[tok] = freq.get(tok, 0) + 1

    ranked = sorted(freq.items(), key=lambda kv: (-kv[1], kv[0]))
    return [word for word, _ in ranked[:max_items]]


def _guess_category(raw: str, override: str | None) -> str:
    if override:
        if override not in MEMJAR_VALUES:
            raise ValueError(f"Invalid category '{override}'. Expected one of: {sorted(MEMJAR_VALUES)}")
        return override

    lower = raw.lower()
    if any(marker in lower for marker in (".pdf", ".doc", ".txt", "zip", "file:")):
        return "File"
    if any(marker in lower for marker in ("idea:", "concept", "brainstorm", "hypothesis")):
        return "Idea"
    return "ChatGPT"


def _build_salvage(raw: str, category: str) -> Salvage:
    keywords = _extract_keywords(raw)
    preview = " ".join(raw.split())
    preview = textwrap.shorten(preview, width=170, placeholder="…")
    why = (
        "This capture preserves operator intent and implementation detail that can be converted into reusable IP. "
        f"Key signal: {preview}"
    )
    action = "Create downstream implementation tasks from the top keywords and keep this capture immutable in Airtable."
    return Salvage(category=category, keywords=keywords[:8], why_it_matters=why, next_action=action)


def _read_push_text(args: argparse.Namespace) -> str:
    if args.text is not None:
        return args.text
    if args.input_file:
        with open(args.input_file, "r", encoding="utf-8") as handle:
            return handle.read()
    return sys.stdin.read()


def push_command(args: argparse.Namespace) -> int:
    raw = _read_push_text(args)
    if not raw.strip():
        print("RAW capture is empty. No record created.")
        return 0

    category = _guess_category(raw, args.category)
    salvage = _build_salvage(raw, category)

    record_id: str | None = None
    if not args.dry_run:
        cfg = _config(require_token=True)
        requests = _require_requests()
        payload = {
            "records": [
                {
                    "fields": {
                        "Name": raw,
                        "MemJar": category,
                        "Status": "Todo",
                    }
                }
            ],
            "typecast": True,
        }
        response = requests.post(
            cfg.url,
            headers=_headers(cfg.token),
            json=payload,
            timeout=30,
        )
        response.raise_for_status()
        body = response.json()
        recs = body.get("records", [])
        if recs and isinstance(recs, list):
            record_id = recs[0].get("id")

    print("pas de chat push — RESULT")
    print(f"- Airtable record id: {record_id or 'not available'}")
    print(f"- category (MemJar): {salvage.category}")
    print(f"- keywords: {', '.join(salvage.keywords) if salvage.keywords else 'n/a'}")
    print(f"- why it matters: {salvage.why_it_matters}")
    print(f"- suggested next action: {salvage.next_action}")
    return 0


def _fetch_todo_records(cfg: AirtableConfig, status_field: str, pending_value: str) -> list[dict[str, Any]]:
    requests = _require_requests()
    headers = _headers(cfg.token)

    records: list[dict[str, Any]] = []
    offset: str | None = None
    while True:
        params: dict[str, str] = {
            "filterByFormula": f"{{{status_field}}}='{pending_value}'",
            "pageSize": "100",
        }
        if offset:
            params["offset"] = offset
        response = requests.get(cfg.url, headers=headers, params=params, timeout=30)
        response.raise_for_status()
        data = response.json()
        records.extend(data.get("records", []))
        offset = data.get("offset")
        if not offset:
            break

    return records


def _patch_status_done(
    cfg: AirtableConfig,
    record_ids: list[str],
    status_field: str,
    processed_value: str,
) -> None:
    if not record_ids:
        return

    requests = _require_requests()
    headers = _headers(cfg.token)
    for i in range(0, len(record_ids), 10):
        batch = record_ids[i : i + 10]
        payload = {
            "records": [
                {
                    "id": record_id,
                    "fields": {status_field: processed_value},
                }
                for record_id in batch
            ]
        }
        response = requests.patch(cfg.url, headers=headers, json=payload, timeout=30)
        response.raise_for_status()


def rinse_command(args: argparse.Namespace) -> int:
    cfg = _config(require_token=not args.dry_run)
    status_field = os.environ.get("AIRTABLE_STATUS_FIELD", "Status")
    pending_value = os.environ.get("AIRTABLE_PENDING_VALUE", "Todo")
    processed_value = os.environ.get("AIRTABLE_PROCESSED_VALUE", "Done")

    records: list[dict[str, Any]]
    if args.input_json:
        with open(args.input_json, "r", encoding="utf-8") as handle:
            payload = json.load(handle)
        if isinstance(payload, dict):
            records = payload.get("records", [])
        elif isinstance(payload, list):
            records = payload
        else:
            raise ValueError("JSON input must be a list or object with a records array")
    else:
        records = _fetch_todo_records(cfg, status_field, pending_value)

    if not records:
        print("Gossip Rag — Nothing to rinse. (0 Todo records)")
        return 0

    print("Gossip Rag — This Week's Rinse")
    print(f"Total Todos: {len(records)}")
    ids_to_patch: list[str] = []

    for i, rec in enumerate(records, 1):
        fields = rec.get("fields", rec)
        raw = str(fields.get("Name") or "")
        if not raw:
            continue
        memjar = str(fields.get("MemJar") or "ChatGPT")
        digest = hashlib.sha256(raw.encode("utf-8")).hexdigest()
        preview = textwrap.shorten(" ".join(raw.split()), width=60, placeholder="…")
        print(f"{i:2d}) {memjar:<8} {digest[:12]}…  [{preview}]")
        record_id = rec.get("id")
        if record_id:
            ids_to_patch.append(record_id)

    if args.dry_run:
        print("Status patched: skipped (dry-run)")
    elif not args.input_json:
        _patch_status_done(cfg, ids_to_patch, status_field, processed_value)
        print("Status patched: Done ✅")

    return 0


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="PAS DE CHAT VAULT helper")
    sub = parser.add_subparsers(dest="command", required=True)

    push = sub.add_parser("push", help="Capture raw text verbatim and push to Airtable")
    push.add_argument("--text", help="Raw capture text. If omitted, reads --input-file or stdin")
    push.add_argument("--input-file", help="Path to file containing verbatim raw capture")
    push.add_argument(
        "--category",
        choices=sorted(MEMJAR_VALUES),
        help="MemJar category override. Defaults to heuristic; falls back to ChatGPT.",
    )
    push.add_argument("--dry-run", action="store_true", help="Do not call Airtable API")
    push.set_defaults(func=push_command)

    rinse = sub.add_parser("rinse", help="Fetch Todo records, hash Name, and mark Done")
    rinse.add_argument(
        "--input-json",
        help="Optional Airtable-shaped JSON file ({records:[...]}) for offline testing",
    )
    rinse.add_argument("--dry-run", action="store_true", help="Do not patch Airtable status")
    rinse.set_defaults(func=rinse_command)

    return parser.parse_args()


def main() -> int:
    args = parse_args()
    return args.func(args)


if __name__ == "__main__":
    raise SystemExit(main())
