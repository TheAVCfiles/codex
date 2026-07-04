#!/usr/bin/env python3
"""Generate a tamper-evident Syracuse pilot bundle with SHA-256 manifest entries."""

from __future__ import annotations

import hashlib
import json
from datetime import datetime, timezone
from pathlib import Path

ROOT_DIR = Path("SYR_ENV_ARC_PILOT_2026")

STRUCTURE = {
    "01_CONDITION_5_RIBCAGE": [
        "studio_isometric_map.pdf",
        "facility_density_log.csv",
    ],
    "02_CONDITION_3_NERVES": [
        "SPC_PC8_Equity_Proof.json",
        "SPC_PC5_Climate_Log.md",
    ],
    "03_CONDITION_6_LEDGER": [
        "grade_rubric_v1.lock",
        "student_portfolios/.keep",
    ],
    "04_GOVERNANCE": [
        "28_day_conductor_log.txt",
    ],
}


def build_pc8_proof(studio_id: str, timestamp: str) -> dict:
    return {
        "artifact_type": "STAGEPORT_SOVEREIGN_PROOF",
        "naab_standard": "2020_Conditions_PC.8_Social_Equity",
        "studio_id": studio_id,
        "timestamp": timestamp,
        "proof_method": "ISOTROPIC_ACCESS_AUDIT",
        "privacy_level": "MAXIMUM_NO_PII",
        "isotropic_index": {
            "score": 0.95,
            "definition": "Uniformity of access to critical resources regardless of physical position or mobility aid.",
            "passing_threshold": 0.90,
        },
        "spatial_friction_log": [
            {
                "zone_id": "STUDIO_DESK_CLUSTER_A",
                "access_width_mm": 1520,
                "ada_compliant": True,
                "friction_coefficient": 0.02,
                "note": "Wheelchair turning radius unobstructed.",
            }
        ],
        "demographic_blind_hash": {
            "cohort_size": 14,
            "diversity_entropy_score": 0.85,
            "method": "Salted hash over anonymized cohort descriptors; no direct identity storage.",
        },
        "signature": {
            "auditor": "StagePort_Ribcage_Algo_v1",
            "hash": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
        },
    }


def sha256_checksum(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for chunk in iter(lambda: handle.read(4096), b""):
            digest.update(chunk)
    return digest.hexdigest()


def write_text(path: Path, content: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(content, encoding="utf-8")


def build_bundle(root_dir: Path) -> None:
    timestamp = datetime.now(timezone.utc).isoformat()
    manifest_entries: list[tuple[str, str]] = []

    root_dir.mkdir(parents=True, exist_ok=True)

    for folder, files in STRUCTURE.items():
        for filename in files:
            path = root_dir / folder / filename
            path.parent.mkdir(parents=True, exist_ok=True)

            if filename == "SPC_PC8_Equity_Proof.json":
                payload = build_pc8_proof("SYR_ENV_ARC_2026_PILOT", timestamp)
                path.write_text(json.dumps(payload, indent=2), encoding="utf-8")
            else:
                write_text(path, f"Artifact created at {timestamp}\n")

            rel_path = path.relative_to(root_dir).as_posix()
            manifest_entries.append((sha256_checksum(path), rel_path))

    manifest_path = root_dir / "00_MANIFEST.txt"
    lines = [
        f"STAGEPORT SOVEREIGN MANIFEST - {timestamp}",
        "------------------------------------------------",
        *[f"{checksum}  {rel_path}" for checksum, rel_path in sorted(manifest_entries)],
    ]
    write_text(manifest_path, "\n".join(lines) + "\n")


if __name__ == "__main__":
    build_bundle(ROOT_DIR)
    print(f"Bridge kit created at: ./{ROOT_DIR}")
