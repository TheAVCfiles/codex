#!/usr/bin/env python3
"""Generate the Syracuse ENV-ARC NAAB bridge kit folder and manifest."""

from __future__ import annotations

import argparse
import hashlib
import json
from datetime import datetime, timezone
from pathlib import Path

ROOT_DEFAULT = "SYR_ENV_ARC_PILOT_2026"

STRUCTURE: dict[str, list[str]] = {
    "01_CONDITION_5_RIBCAGE": [
        "studio_isometric_map.pdf",
        "facility_density_log.csv",
    ],
    "02_CONDITION_3_NERVES": [
        "SPC_PC8_Equity_Proof.json",
        "SPC_PC5_Climate_Log.md",
    ],
    "03_CONDITION_6_LEDGER": [
        "student_portfolios/.gitkeep",
        "grade_rubric_v1.lock",
    ],
    "04_GOVERNANCE": [
        "28_day_conductor_log.txt",
    ],
}


def now_iso() -> str:
    return datetime.now(timezone.utc).replace(microsecond=0).isoformat()


def default_pc8_proof(timestamp: str) -> dict:
    return {
        "artifact_type": "STAGEPORT_SOVEREIGN_PROOF",
        "naab_standard": "2020_Conditions_PC.8_Social_Equity",
        "studio_id": "SYR_ENV_ARC_2026_PILOT",
        "timestamp": timestamp,
        "proof_method": "ISOTROPIC_ACCESS_AUDIT",
        "privacy_level": "MAXIMUM_NO_PII",
        "isotropic_index": {
            "score": 0.98,
            "definition": (
                "Uniformity of access to critical resources regardless of "
                "position or mobility aid."
            ),
            "passing_threshold": 0.90,
        },
        "spatial_friction_log": [
            {
                "zone_id": "STUDIO_DESK_CLUSTER_A",
                "access_width_mm": 1520,
                "ADA_compliant": True,
                "friction_coefficient": 0.02,
                "note": "Wheelchair turning radius unobstructed.",
            },
            {
                "zone_id": "PIN_UP_WALL_SOUTH",
                "access_width_mm": 1400,
                "ADA_compliant": True,
                "friction_coefficient": 0.05,
                "note": "Sightlines preserved for seated viewers.",
            },
        ],
        "demographic_blind_hash": {
            "cohort_size": 14,
            "diversity_entropy_score": 0.85,
            "method": (
                "Cryptographic salt of anonymized background signals to prove "
                "variety without exposing identity."
            ),
        },
        "signature": {
            "auditor": "StagePort_Ribcage_Algo_v1",
            "hash": "",
        },
    }


def write_text(path: Path, content: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(content, encoding="utf-8")


def sha256(path: Path) -> str:
    digest = hashlib.sha256()
    digest.update(path.read_bytes())
    return digest.hexdigest()


def create_files(root: Path, timestamp: str) -> list[Path]:
    created: list[Path] = []

    for folder, files in STRUCTURE.items():
        for relative_name in files:
            artifact = root / folder / relative_name
            artifact.parent.mkdir(parents=True, exist_ok=True)

            if artifact.name == "SPC_PC8_Equity_Proof.json":
                payload = default_pc8_proof(timestamp)
                write_text(artifact, json.dumps(payload, indent=2) + "\n")
            elif artifact.suffix == ".csv":
                write_text(artifact, "timestamp,zone,occupancy,capacity\n")
            else:
                write_text(artifact, f"Artifact created at {timestamp}\n")

            created.append(artifact)

    return created


def write_manifest(root: Path, created: list[Path], timestamp: str) -> Path:
    created_sorted = sorted(created, key=lambda p: p.as_posix())
    manifest = root / "00_MANIFEST.txt"

    lines = [
        f"STAGEPORT SOVEREIGN MANIFEST — {timestamp}",
        "--------------------------------------------",
    ]

    for file_path in created_sorted:
        rel = file_path.relative_to(root)
        lines.append(f"{sha256(file_path)}  {rel.as_posix()}")

    write_text(manifest, "\n".join(lines) + "\n")
    return manifest


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--output",
        default=ROOT_DEFAULT,
        help=f"output directory (default: {ROOT_DEFAULT})",
    )
    args = parser.parse_args()

    root = Path(args.output)
    timestamp = now_iso()
    created = create_files(root, timestamp)
    manifest = write_manifest(root, created, timestamp)

    print(f"Bridge kit generated at: {root.resolve()}")
    print(f"Files created: {len(created)}")
    print(f"Manifest: {manifest.resolve()}")


if __name__ == "__main__":
    main()
