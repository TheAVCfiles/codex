#!/usr/bin/env python3
"""Mapstein v6 pilot utilities.

Implements a narrow, local-first pipeline:
1) harvest: dataset page -> intake ledger rows with stable IDs + hashes
2) bridge: entity rows -> co-occurrence edges + bridge-node scores
"""

from __future__ import annotations

import argparse
import csv
import hashlib
import json
import re
from collections import Counter, defaultdict
from dataclasses import dataclass
from datetime import UTC, datetime
from html.parser import HTMLParser
from pathlib import Path
from typing import Iterable
from urllib.parse import urljoin
from urllib.request import Request, urlopen


PDF_PATTERN = re.compile(r"\.pdf(?:[?#].*)?$", re.IGNORECASE)


class PdfLinkParser(HTMLParser):
    """Collect PDF links from an HTML page."""

    def __init__(self) -> None:
        super().__init__()
        self.links: list[str] = []

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        if tag.lower() != "a":
            return
        href = dict(attrs).get("href")
        if href and PDF_PATTERN.search(href):
            self.links.append(href)


@dataclass(frozen=True)
class IntakeRow:
    dataset: str
    doc_id: str
    filename: str
    source_url: str
    source_hash: str
    ingest_date: str
    parse_status: str
    page_count: str
    notes: str


def fetch_html(source: str) -> str:
    if source.startswith(("http://", "https://")):
        req = Request(source, headers={"User-Agent": "mapstein-v6-harvester/1.0"})
        with urlopen(req, timeout=30) as resp:  # nosec B310
            return resp.read().decode("utf-8", errors="replace")
    return Path(source).read_text(encoding="utf-8")


def parse_pdf_links(html: str, base_url: str) -> list[str]:
    parser = PdfLinkParser()
    parser.feed(html)
    resolved = [urljoin(base_url, href) for href in parser.links]
    # deterministic, unique order
    deduped = sorted(set(resolved))
    return deduped


def build_doc_id(dataset: str, url: str) -> str:
    digest = hashlib.sha256(url.encode("utf-8")).hexdigest()[:12].upper()
    return f"{dataset}-{digest}"


def harvest_dataset(dataset: str, source: str) -> list[IntakeRow]:
    html = fetch_html(source)
    links = parse_pdf_links(html, source)
    now = datetime.now(UTC).isoformat()
    rows: list[IntakeRow] = []
    for link in links:
        filename = link.rsplit("/", 1)[-1]
        source_hash = hashlib.sha256(link.encode("utf-8")).hexdigest()
        rows.append(
            IntakeRow(
                dataset=dataset,
                doc_id=build_doc_id(dataset, link),
                filename=filename,
                source_url=link,
                source_hash=source_hash,
                ingest_date=now,
                parse_status="queued",
                page_count="",
                notes="seeded_from_dataset_page",
            )
        )
    return rows


def write_intake_csv(rows: Iterable[IntakeRow], output_csv: Path) -> None:
    output_csv.parent.mkdir(parents=True, exist_ok=True)
    with output_csv.open("w", newline="", encoding="utf-8") as fh:
        writer = csv.DictWriter(
            fh,
            fieldnames=[
                "dataset",
                "doc_id",
                "filename",
                "source_url",
                "source_hash",
                "ingest_date",
                "parse_status",
                "page_count",
                "notes",
            ],
        )
        writer.writeheader()
        for row in rows:
            writer.writerow(row.__dict__)


def load_entities(path: Path) -> dict[str, set[str]]:
    """Load rows with columns: doc_id,entity."""
    by_doc: dict[str, set[str]] = defaultdict(set)
    with path.open(newline="", encoding="utf-8") as fh:
        reader = csv.DictReader(fh)
        missing = {"doc_id", "entity"} - set(reader.fieldnames or [])
        if missing:
            raise ValueError(f"entity csv is missing required columns: {sorted(missing)}")
        for row in reader:
            doc_id = (row.get("doc_id") or "").strip()
            entity = (row.get("entity") or "").strip()
            if doc_id and entity:
                by_doc[doc_id].add(entity)
    return by_doc


def build_graph_metrics(by_doc: dict[str, set[str]]) -> dict[str, object]:
    edges: Counter[tuple[str, str]] = Counter()
    degree: Counter[str] = Counter()

    for entities in by_doc.values():
        ordered = sorted(entities)
        for i, left in enumerate(ordered):
            degree[left] += max(0, len(ordered) - 1)
            for right in ordered[i + 1 :]:
                edges[(left, right)] += 1

    # betweenness approximation for lightweight/no-dependency environment:
    # count how often a node appears in high-weight triads as a connector.
    node_triads: Counter[str] = Counter()
    neighbors: dict[str, set[str]] = defaultdict(set)
    for (a, b), _w in edges.items():
        neighbors[a].add(b)
        neighbors[b].add(a)

    for node, nbrs in neighbors.items():
        node_triads[node] = len(nbrs) * (len(nbrs) - 1) // 2

    bridge_scores = []
    for node in neighbors:
        bridge = degree[node] + node_triads[node]
        bridge_scores.append(
            {
                "entity": node,
                "degree": degree[node],
                "cluster_overlap": node_triads[node],
                "bridge_score": bridge,
            }
        )

    bridge_scores.sort(key=lambda item: (-item["bridge_score"], item["entity"]))

    edge_rows = [
        {"source": a, "target": b, "weight": w}
        for (a, b), w in sorted(edges.items(), key=lambda kv: (-kv[1], kv[0]))
    ]

    return {
        "summary": {
            "documents": len(by_doc),
            "unique_entities": len(neighbors),
            "edges": len(edge_rows),
            "generated_at": datetime.now(UTC).isoformat(),
        },
        "bridge_candidates": bridge_scores,
        "edges": edge_rows,
    }


def cmd_harvest(args: argparse.Namespace) -> int:
    rows = harvest_dataset(args.dataset, args.source)
    write_intake_csv(rows, Path(args.output))
    print(f"Harvested {len(rows)} PDFs into {args.output}")
    return 0


def cmd_bridge(args: argparse.Namespace) -> int:
    by_doc = load_entities(Path(args.entities_csv))
    report = build_graph_metrics(by_doc)
    output_path = Path(args.output)
    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_text(json.dumps(report, indent=2), encoding="utf-8")
    print(
        f"Computed bridge report for {report['summary']['documents']} docs / "
        f"{report['summary']['unique_entities']} entities -> {args.output}"
    )
    return 0


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description="Mapstein v6 pilot tooling")
    sub = parser.add_subparsers(dest="command", required=True)

    harvest = sub.add_parser("harvest", help="Harvest PDF links from a dataset page")
    harvest.add_argument("--dataset", required=True, help="Dataset identifier (e.g. DS07)")
    harvest.add_argument("--source", required=True, help="Dataset page URL or local HTML path")
    harvest.add_argument("--output", default="output/mapstein/intake_log.csv")
    harvest.set_defaults(func=cmd_harvest)

    bridge = sub.add_parser("bridge", help="Create bridge-node report from extracted entities")
    bridge.add_argument("--entities-csv", required=True, help="CSV with doc_id,entity columns")
    bridge.add_argument("--output", default="output/mapstein/bridge_report.json")
    bridge.set_defaults(func=cmd_bridge)

    return parser


def main() -> int:
    parser = build_parser()
    args = parser.parse_args()
    return args.func(args)


if __name__ == "__main__":
    raise SystemExit(main())
