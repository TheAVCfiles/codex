#!/usr/bin/env python3
"""Generate a Sunday integrity report from chunk records.

The script accepts a JSON file with weekly chunks and optionally compares them
against an existing vault file to detect hash or semantic conflicts.
"""

from __future__ import annotations

import argparse
import csv
import hashlib
import json
import re
from dataclasses import dataclass
from datetime import datetime
from pathlib import Path
from typing import Any


@dataclass
class Chunk:
    title: str
    proves: str
    sha256: str


class SundayRinse:
    def __init__(self, vault_path: str = "artifact_index.csv") -> None:
        self.vault_path = Path(vault_path)
        self.glitch_rate = 0.02

    @staticmethod
    def calculate_jaccard(t1: str, t2: str) -> float:
        a, b = [set(re.findall(r"\w+", str(s).lower())) for s in (t1, t2)]
        return len(a & b) / len(a | b) if a | b else 0.0

    def load_existing_vault(self) -> list[Chunk]:
        if not self.vault_path.exists():
            return []

        existing: list[Chunk] = []
        with self.vault_path.open("r", encoding="utf-8", newline="") as handle:
            reader = csv.DictReader(handle)
            for row in reader:
                title = row.get("title") or row.get("Title") or "Untitled"
                proves = row.get("proves") or row.get("Proves") or ""
                sha256 = row.get("sha256") or row.get("SHA-256 Seal") or ""
                if not sha256 and proves:
                    sha256 = hashlib.sha256(proves.encode("utf-8")).hexdigest()
                if sha256:
                    existing.append(Chunk(title=title, proves=proves, sha256=sha256))
        return existing

    def detect_conflicts(self, new_records: list[Chunk], existing_vault: list[Chunk]) -> list[str]:
        """Flags exact hash matches or semantic overlaps > 0.85."""
        conflicts: list[str] = []
        for new in new_records:
            for old in existing_vault:
                if new.sha256 == old.sha256:
                    conflicts.append(f"CONFLICT: {new.title} matches {old.title} hash.")

                similarity = self.calculate_jaccard(new.proves, old.proves)
                if similarity > 0.85:
                    conflicts.append(
                        f"WARNING: {new.title} has {similarity:.2f} overlap with {old.title}."
                    )
        return conflicts

    def generate_gossip_rag(self, weekly_chunks: list[Chunk], output_dir: str = ".") -> Path:
        """Compiles the report for the Sunday Ritual."""
        stamp = datetime.now().strftime("%Y%m%d")
        output_path = Path(output_dir) / f"GOSSIP_RAG_{stamp}.md"
        existing_vault = self.load_existing_vault()
        conflicts = self.detect_conflicts(weekly_chunks, existing_vault)

        with output_path.open("w", encoding="utf-8") as handle:
            handle.write(f"# 🗞 THE SUNDAY BRUNCH RINSE | {datetime.now().date()}\n")
            handle.write("## Conflict & Integrity Report\n")
            if not conflicts:
                handle.write("✅ STATUS: CLEAN. No system melt detected.\n\n")
            else:
                for conflict in conflicts:
                    handle.write(f"⚠️ {conflict}\n")
                handle.write("\n")

            handle.write("## Weekly Chunks (Ready for CODA)\n---\n")
            for chunk in weekly_chunks:
                handle.write(f"### ✦ {chunk.title}\n")
                handle.write(f"**Proves:** {chunk.proves}\n")
                handle.write(f"**Hash:** `{chunk.sha256[:16]}`\n---\n")

        return output_path



def parse_weekly_chunks(raw_records: list[dict[str, Any]]) -> list[Chunk]:
    chunks: list[Chunk] = []
    for record in raw_records:
        title = str(record.get("title", "Untitled"))
        proves = str(record.get("proves", ""))
        sha256 = str(record.get("sha256", "")).strip()
        if not sha256:
            sha256 = hashlib.sha256(proves.encode("utf-8")).hexdigest()
        chunks.append(Chunk(title=title, proves=proves, sha256=sha256))
    return chunks


def load_weekly_records(path: str) -> list[dict[str, Any]]:
    with open(path, "r", encoding="utf-8") as handle:
        payload = json.load(handle)

    if isinstance(payload, dict) and "records" in payload:
        records = payload["records"]
    else:
        records = payload

    if not isinstance(records, list):
        raise ValueError("Weekly chunks input must be a list or an object containing a 'records' list.")

    return [record for record in records if isinstance(record, dict)]


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description="Generate Sunday Rinse markdown reports.")
    parser.add_argument("--weekly", required=True, help="Path to JSON file containing weekly chunks.")
    parser.add_argument(
        "--vault",
        default="artifact_index.csv",
        help="Path to existing vault CSV for conflict checks (default: artifact_index.csv).",
    )
    parser.add_argument(
        "--output-dir",
        default=".",
        help="Directory where the markdown report should be written.",
    )
    return parser


def main() -> int:
    parser = build_parser()
    args = parser.parse_args()

    weekly_records = load_weekly_records(args.weekly)
    weekly_chunks = parse_weekly_chunks(weekly_records)

    rinse = SundayRinse(vault_path=args.vault)
    report = rinse.generate_gossip_rag(weekly_chunks, output_dir=args.output_dir)
    print(f"Wrote report: {report}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
