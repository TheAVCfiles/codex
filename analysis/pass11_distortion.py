from __future__ import annotations

import argparse
import json
from pathlib import Path
from typing import Dict, Iterable, List, Tuple

import networkx as nx
import pandas as pd

CORE_VERBS_TO_CORRIDOR = {
    "TRAVELS_TO": "TRANSPORT",
    "PILOTS": "TRANSPORT",
    "PAYS": "FINANCE",
    "FILES": "LEGAL",
    "PUBLISHES": "COMMUNICATIONS",
    "EMAILS": "COMMUNICATIONS",
    "MANAGES_PROPERTY": "ESTATE",
    "SUPERVISES": "ESTATE",
}


def _normalized_year_span(values: Iterable[object]) -> float:
    years = []
    for value in values:
        text = str(value)
        if len(text) >= 4 and text[:4].isdigit():
            years.append(int(text[:4]))

    if not years:
        return 1.0

    return float(max(years) - min(years) + 1)


def build_graph(df: pd.DataFrame) -> nx.DiGraph:
    graph = nx.DiGraph()
    for row in df.itertuples(index=False):
        if row.subject == row.object:
            continue
        graph.add_edge(
            row.subject,
            row.object,
            verb=row.verb,
            doc=getattr(row, "doc", None),
            year=getattr(row, "year", None),
            corridor=CORE_VERBS_TO_CORRIDOR.get(row.verb, "UNMAPPED"),
        )
    return graph


def compute_bridge_distortion(df: pd.DataFrame, graph: nx.DiGraph) -> pd.DataFrame:
    betweenness = nx.betweenness_centrality(graph)

    touchpoints: Dict[str, set] = {}
    temporal: Dict[str, List[object]] = {}

    for row in df.itertuples(index=False):
        corridor = CORE_VERBS_TO_CORRIDOR.get(row.verb, "UNMAPPED")
        for node in (row.subject, row.object):
            touchpoints.setdefault(node, set()).add(corridor)
            temporal.setdefault(node, []).append(getattr(row, "year", ""))

    records = []
    for node in graph.nodes:
        channels_touched = len(touchpoints.get(node, set())) or 1
        temporal_span = _normalized_year_span(temporal.get(node, []))
        score = channels_touched * betweenness.get(node, 0.0) * temporal_span
        records.append(
            {
                "node": node,
                "channels_touched": channels_touched,
                "betweenness": round(betweenness.get(node, 0.0), 6),
                "temporal_span": temporal_span,
                "distortion_score": round(score, 6),
            }
        )

    return pd.DataFrame(records).sort_values(
        by=["distortion_score", "betweenness"], ascending=False
    )


def build_corridor_layer_graph(df: pd.DataFrame) -> nx.MultiDiGraph:
    layer_graph = nx.MultiDiGraph()

    for row in df.itertuples(index=False):
        subject = row.subject
        obj = row.object
        corridor = CORE_VERBS_TO_CORRIDOR.get(row.verb, "UNMAPPED")

        layer_graph.add_node(subject, type="entity")
        layer_graph.add_node(obj, type="entity")

        corridor_node = f"CORRIDOR::{corridor}"
        layer_graph.add_node(corridor_node, type="corridor")

        layer_graph.add_edge(subject, corridor_node, relation="OPERATES_IN", verb=row.verb)
        layer_graph.add_edge(corridor_node, obj, relation="TARGETS", verb=row.verb)

    return layer_graph


def build_timeline_overlay(df: pd.DataFrame, distortion_df: pd.DataFrame) -> dict:
    if "year" not in df.columns:
        df = df.copy()
        df["year"] = "unknown"

    top_nodes = distortion_df.head(15)["node"].tolist()

    timeline = []
    for year, year_df in df.groupby("year"):
        active_nodes = set(year_df["subject"]).union(set(year_df["object"]))
        key_nodes = [node for node in top_nodes if node in active_nodes]
        timeline.append(
            {
                "year": str(year),
                "edges": int(len(year_df)),
                "active_nodes": int(len(active_nodes)),
                "high_distortion_nodes_active": key_nodes,
            }
        )

    return {
        "timeline": sorted(timeline, key=lambda row: row["year"]),
        "top_distortion_nodes": top_nodes,
    }


def main() -> None:
    parser = argparse.ArgumentParser(
        description="Pass 11: bridge distortion scoring, corridor layer graph, timeline overlay"
    )
    parser.add_argument("--relationships", required=True, help="Path to filtered relationships CSV")
    parser.add_argument("--out-dir", required=True, help="Directory for pass11 artifacts")
    args = parser.parse_args()

    relationships_path = Path(args.relationships)
    out_dir = Path(args.out_dir)
    out_dir.mkdir(parents=True, exist_ok=True)

    df = pd.read_csv(relationships_path)
    required_cols = {"subject", "verb", "object"}
    missing = required_cols - set(df.columns)
    if missing:
        raise ValueError(f"Missing required columns: {sorted(missing)}")

    graph = build_graph(df)
    distortion_df = compute_bridge_distortion(df, graph)
    layer_graph = build_corridor_layer_graph(df)
    timeline_overlay = build_timeline_overlay(df, distortion_df)

    distortion_path = out_dir / "bridge_distortion_scores.csv"
    layer_graph_path = out_dir / "corridor_layer_graph.gexf"
    timeline_path = out_dir / "timeline_contagion_overlay.json"
    summary_path = out_dir / "pass11_summary.json"

    distortion_df.to_csv(distortion_path, index=False)
    nx.write_gexf(layer_graph, layer_graph_path)
    timeline_path.write_text(json.dumps(timeline_overlay, indent=2), encoding="utf-8")

    summary = {
        "input_rows": int(len(df)),
        "graph_nodes": int(graph.number_of_nodes()),
        "graph_edges": int(graph.number_of_edges()),
        "layer_nodes": int(layer_graph.number_of_nodes()),
        "layer_edges": int(layer_graph.number_of_edges()),
        "artifacts": [
            distortion_path.name,
            layer_graph_path.name,
            timeline_path.name,
        ],
    }
    summary_path.write_text(json.dumps(summary, indent=2), encoding="utf-8")

    print(json.dumps(summary, indent=2))


if __name__ == "__main__":
    main()
