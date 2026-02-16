#!/usr/bin/env python3
"""Generate a weekly integrity report from RAW_INGEST-style records.

This script can run in two modes:
1) JSON input mode: read weekly records and optional vault records from files.
2) Airtable mode: fetch pending records directly from Airtable using env vars.

Output: GOSSIP_RAG_YYYYMMDD.md
"""

from __future__ import annotations

import argparse
import csv
import hashlib
import html
import json
import os
import re
from dataclasses import dataclass
from datetime import datetime
from pathlib import Path
from typing import Any
from urllib.parse import quote


def _require_requests() -> Any:
    try:
        import requests  # type: ignore

        return requests
    except ModuleNotFoundError as exc:
        raise RuntimeError(
            "The 'requests' package is required for Airtable mode. Install with: pip install requests"
        ) from exc


@dataclass
class RinseRecord:
    title: str
    proves: str
    sha256: str
    source_id: str = ""


class SundayRinse:
    def __init__(self, vault_path: str = "artifact_index.csv", glitch_rate: float = 0.02) -> None:
        self.vault_path = Path(vault_path)
        self.glitch_rate = glitch_rate

    @staticmethod
    def calculate_jaccard(text_1: str, text_2: str) -> float:
        tokens_1 = set(re.findall(r"\w+", str(text_1).lower()))
        tokens_2 = set(re.findall(r"\w+", str(text_2).lower()))
        union = tokens_1 | tokens_2
        if not union:
            return 0.0
        return len(tokens_1 & tokens_2) / len(union)

    def detect_conflicts(
        self,
        new_records: list[RinseRecord],
        existing_vault: list[RinseRecord],
    ) -> list[str]:
        """Flag exact hash matches or semantic overlaps above threshold."""
        conflicts: list[str] = []
        for new in new_records:
            for old in existing_vault:
                if new.sha256 and new.sha256 == old.sha256:
                    conflicts.append(f"CONFLICT: {new.title} matches {old.title} hash.")

                similarity = self.calculate_jaccard(new.proves, old.proves)
                if similarity > 0.85:
                    conflicts.append(
                        f"WARNING: {new.title} has {similarity:.2f} overlap with {old.title}."
                    )
        return conflicts

    def load_vault_csv(self) -> list[RinseRecord]:
        if not self.vault_path.exists():
            return []

        loaded: list[RinseRecord] = []
        with self.vault_path.open("r", encoding="utf-8", newline="") as handle:
            reader = csv.DictReader(handle)
            for row in reader:
                loaded.append(
                    RinseRecord(
                        title=row.get("title", "Untitled"),
                        proves=row.get("proves", ""),
                        sha256=row.get("sha256", ""),
                        source_id=row.get("source_id", ""),
                    )
                )
        return loaded

    @staticmethod
    def _extract_fields(entry: dict[str, Any]) -> dict[str, Any]:
        fields = entry.get("fields")
        return fields if isinstance(fields, dict) else entry

    @staticmethod
    def _normalize_record(entry: dict[str, Any]) -> RinseRecord:
        fields = SundayRinse._extract_fields(entry)
        proves = str(
            fields.get("proves")
            or fields.get("Raw_Text")
            or fields.get("Raw Content")
            or fields.get("MemJar")
            or ""
        )
        title = str(fields.get("title") or fields.get("Title") or fields.get("Name") or "Untitled")
        sha = str(fields.get("sha256") or fields.get("SHA-256 Seal") or "")
        if not sha:
            sha = hashlib.sha256(proves.encode("utf-8")).hexdigest() if proves else ""

        source_id = str(entry.get("source_id") or entry.get("id") or fields.get("source_id") or "")
        return RinseRecord(title=title, proves=proves, sha256=sha, source_id=source_id)

    @staticmethod
    def _load_json_records(path: str) -> list[dict[str, Any]]:
        with open(path, "r", encoding="utf-8") as handle:
            payload = json.load(handle)

        if isinstance(payload, list):
            return payload
        if isinstance(payload, dict) and "records" in payload:
            records = payload["records"]
            if not isinstance(records, list):
                raise ValueError("'records' must be an array")
            return records

        raise ValueError("JSON input must be a list or an object containing a 'records' array")

    @staticmethod
    def _airtable_auth_token() -> str:
        token = (
            os.environ.get("AIRTABLE_TOKEN")
            or os.environ.get("AIRTABLE_KEY")
            or os.environ.get("AIRTABLE_PAT")
        )
        if not token:
            raise RuntimeError(
                "Set AIRTABLE_TOKEN (or AIRTABLE_KEY / AIRTABLE_PAT) for Airtable mode"
            )
        return token

    @staticmethod
    def _airtable_url(base_id: str, table: str) -> str:
        return f"https://api.airtable.com/v0/{base_id}/{quote(table, safe='')}"

    @staticmethod
    def _fetch_airtable_records() -> list[dict[str, Any]]:
        token = SundayRinse._airtable_auth_token()
        base_id = os.environ.get("AIRTABLE_BASE_ID", "appS16p6gJO5U78JS")
        table = os.environ.get("AIRTABLE_TABLE", "Table 1")
        status_field = os.environ.get("AIRTABLE_STATUS_FIELD", "Status")
        pending_value = os.environ.get("AIRTABLE_PENDING_VALUE", "Todo")

        url = SundayRinse._airtable_url(base_id, table)
        headers = {
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json",
        }
        params = {
            "filterByFormula": f"{{{status_field}}} = '{pending_value}'",
            "pageSize": 100,
            "maxRecords": 200,
        }
        requests = _require_requests()
        records: list[dict[str, Any]] = []
        offset: str | None = None

        while True:
            page_params = dict(params)
            if offset:
                page_params["offset"] = offset
            response = requests.get(url, headers=headers, params=page_params, timeout=30)
            response.raise_for_status()
            payload = response.json()
            records.extend(payload.get("records", []))
            if len(records) >= int(params["maxRecords"]):
                return records[: int(params["maxRecords"])]
            offset = payload.get("offset")
            if not offset:
                return records

    @staticmethod
    def _mark_airtable_processed(record_ids: list[str], seals: dict[str, str] | None = None) -> None:
        if not record_ids:
            return

        token = SundayRinse._airtable_auth_token()
        base_id = os.environ.get("AIRTABLE_BASE_ID", "appS16p6gJO5U78JS")
        table = os.environ.get("AIRTABLE_TABLE", "Table 1")
        status_field = os.environ.get("AIRTABLE_STATUS_FIELD", "Status")
        processed_value = os.environ.get("AIRTABLE_PROCESSED_VALUE", "Done")
        key_topics_field = os.environ.get("AIRTABLE_KEY_TOPICS_FIELD")

        url = SundayRinse._airtable_url(base_id, table)
        headers = {
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json",
        }
        requests = _require_requests()

        # Airtable update endpoint supports up to 10 records per request.
        for i in range(0, len(record_ids), 10):
            batch = record_ids[i : i + 10]
            payload = {
                "records": [
                    {
                        "id": record_id,
                        "fields": {
                            **({key_topics_field: f"Forensic Seal (SHA-256): {seals[record_id]}"} if key_topics_field and seals and record_id in seals else {}),
                            status_field: processed_value,
                        },
                    }
                    for record_id in batch
                ]
            }
            response = requests.patch(url, headers=headers, json=payload, timeout=30)
            response.raise_for_status()

    @staticmethod
    def _require_reportlab() -> tuple[Any, Any, Any, Any, Any]:
        try:
            from reportlab.lib.pagesizes import LETTER  # type: ignore
            from reportlab.lib.styles import getSampleStyleSheet  # type: ignore
            from reportlab.lib.units import inch  # type: ignore
            from reportlab.platypus import Paragraph, SimpleDocTemplate, Spacer  # type: ignore

            return LETTER, getSampleStyleSheet, inch, Paragraph, SimpleDocTemplate, Spacer
        except ModuleNotFoundError as exc:
            raise RuntimeError(
                "The 'reportlab' package is required for PDF output. Install with: pip install reportlab"
            ) from exc

    def generate_gossip_rag(
        self,
        weekly_records: list[RinseRecord],
        existing_vault: list[RinseRecord],
        output_dir: str = ".",
    ) -> Path:
        filename = f"GOSSIP_RAG_{datetime.now().strftime('%Y%m%d')}.md"
        output_path = Path(output_dir) / filename

        conflicts = self.detect_conflicts(weekly_records, existing_vault)

        with output_path.open("w", encoding="utf-8") as handle:
            handle.write(f"# 🗞 THE SUNDAY BRUNCH RINSE | {datetime.now().date()}\n")
            handle.write("## Conflict & Integrity Report\n")
            if not conflicts:
                handle.write("✅ STATUS: CLEAN. No system melt detected.\n\n")
            else:
                for item in conflicts:
                    handle.write(f"⚠️ {item}\n")

            handle.write("\n## Weekly Chunks (Ready for CODA)\n---\n")
            for chunk in weekly_records:
                preview = chunk.proves[:700] + "..." if len(chunk.proves) > 700 else chunk.proves
                handle.write(f"### ✦ {chunk.title}\n")
                handle.write(f"**Proves:** {preview}\n")
                handle.write(f"**Hash:** `{chunk.sha256[:16]}…`\n")
                if chunk.source_id:
                    handle.write(f"**Record:** {chunk.source_id}\n")
                handle.write("---\n")

        return output_path

    def write_pdf_report(self, weekly_records: list[RinseRecord], output_dir: str = ".") -> Path:
        LETTER, get_sample_style_sheet, inch, Paragraph, SimpleDocTemplate, Spacer = (
            self._require_reportlab()
        )

        filename = f"GOSSIP_RAG_{datetime.now().strftime('%Y%m%d')}.pdf"
        output_path = Path(output_dir) / filename
        styles = get_sample_style_sheet()

        doc = SimpleDocTemplate(
            str(output_path),
            pagesize=LETTER,
            rightMargin=0.75 * inch,
            leftMargin=0.75 * inch,
            topMargin=0.75 * inch,
            bottomMargin=0.75 * inch,
        )

        story: list[Any] = []
        story.append(Paragraph("STAGEPORT · SUNDAY BRUNCH RINSE", styles["Heading1"]))
        story.append(Paragraph(f"Weekly Momentum + Integrity Report — {datetime.now().date()}", styles["BodyText"]))
        story.append(Spacer(1, 12))

        for idx, chunk in enumerate(weekly_records, 1):
            story.append(Paragraph(f"{idx}. {html.escape(chunk.title)}", styles["Heading2"]))
            story.append(Paragraph(f"Hash: {html.escape(chunk.sha256[:16])}…", styles["BodyText"]))
            safe_preview = html.escape(chunk.proves[:900] + ("..." if len(chunk.proves) > 900 else ""))
            story.append(Paragraph(safe_preview.replace("\n", "<br/>"), styles["BodyText"]))
            story.append(Spacer(1, 10))

        doc.build(story)
        return output_path


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Run Sunday integrity rinse over weekly records")
    parser.add_argument(
        "--weekly-json",
        help="Path to JSON with weekly records (list or {records:[...]}). If omitted, fetch from Airtable.",
    )
    parser.add_argument(
        "--vault-json",
        help="Optional JSON file with existing vault records. Defaults to --vault-csv when absent.",
    )
    parser.add_argument(
        "--vault-csv",
        default="artifact_index.csv",
        help="CSV file containing historical records (default: artifact_index.csv)",
    )
    parser.add_argument(
        "--output-dir",
        default=".",
        help="Directory where GOSSIP_RAG markdown should be written",
    )
    parser.add_argument(
        "--mark-processed",
        action="store_true",
        help="When fetching from Airtable, update processed records after report generation",
    )
    parser.add_argument(
        "--write-pdf",
        action="store_true",
        help="Also render a PDF report (requires reportlab)",
    )
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    rinse = SundayRinse(vault_path=args.vault_csv)

    if args.weekly_json:
        weekly_raw = SundayRinse._load_json_records(args.weekly_json)
    else:
        weekly_raw = SundayRinse._fetch_airtable_records()

    if args.vault_json:
        vault_raw = SundayRinse._load_json_records(args.vault_json)
        existing_vault = [rinse._normalize_record(r) for r in vault_raw]
    else:
        existing_vault = rinse.load_vault_csv()

    weekly_records = [rinse._normalize_record(r) for r in weekly_raw]
    weekly_records = [r for r in weekly_records if r.proves.strip()]
    report_path = rinse.generate_gossip_rag(weekly_records, existing_vault, args.output_dir)
    print(f"Generated report: {report_path}")

    if args.write_pdf:
        pdf_path = rinse.write_pdf_report(weekly_records, args.output_dir)
        print(f"Generated PDF: {pdf_path}")

    if args.mark_processed and not args.weekly_json:
        ids = [r.source_id for r in weekly_records if r.source_id]
        seals = {r.source_id: r.sha256 for r in weekly_records if r.source_id and r.sha256}
        SundayRinse._mark_airtable_processed(ids, seals)


if __name__ == "__main__":
    main()
