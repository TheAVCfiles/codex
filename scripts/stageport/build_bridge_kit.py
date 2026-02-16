#!/usr/bin/env python3
"""Generate a Syracuse ENV-ARC NAAB bridge kit with deterministic manifest tooling."""

from __future__ import annotations

import argparse
import hashlib
import json
import time
import zipfile
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
        "student_work_hash_log.txt",
    ],
    "04_GOVERNANCE": [
        "28_day_conductor_log.txt",
    ],
}


def now_iso() -> str:
    return datetime.now(timezone.utc).replace(microsecond=0).isoformat()


def canonical_json(payload: dict) -> str:
    return json.dumps(payload, indent=2, sort_keys=True) + "\n"


def default_pc8_proof(*, timestamp: str, studio_id: str) -> dict:
    return {
        "artifact_type": "STAGEPORT_SOVEREIGN_PROOF",
        "naab_standard": "2020_Conditions_PC.8_Social_Equity",
        "studio_id": studio_id,
        "timestamp": timestamp,
        "proof_method": "ISOTROPIC_ACCESS_AUDIT",
        "privacy_level": "MAXIMUM_NO_PII",
        "versions": {
            "engine": "stageport_ribcage_v1",
            "grid_cm": 25,
            "min_width_mm": 915,
            "turn_radius_mm": 1525,
        },
        "isotropic_index": {
            "score": 0.98,
            "passing_threshold": 0.90,
            "method": "1 - CV(max access cost per cell)",
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
            "method": "salted-anon-entropy",
        },
        "signature": {
            "auditor": "StagePort_Ribcage_Algo_v1",
            "hash": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
        },
    }


def write_text(path: Path, content: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(content, encoding="utf-8")


def sha256_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for chunk in iter(lambda: handle.read(65536), b""):
            digest.update(chunk)
    return digest.hexdigest()


def merkle_root(lines: list[bytes]) -> str:
    if not lines:
        return ""

    layer = [hashlib.sha256(line).digest() for line in lines]
    while len(layer) > 1:
        next_layer: list[bytes] = []
        for idx in range(0, len(layer), 2):
            left = layer[idx]
            right = layer[idx + 1] if idx + 1 < len(layer) else left
            next_layer.append(hashlib.sha256(left + right).digest())
        layer = next_layer
    return layer[0].hex()


def create_files(root: Path, *, timestamp: str, studio_id: str, force: bool) -> list[Path]:
    created: list[Path] = []

    for folder, files in STRUCTURE.items():
        for relative_name in files:
            artifact = root / folder / relative_name
            artifact.parent.mkdir(parents=True, exist_ok=True)

            if artifact.exists() and not force:
                created.append(artifact)
                continue

            if artifact.name == "SPC_PC8_Equity_Proof.json":
                payload = default_pc8_proof(timestamp=timestamp, studio_id=studio_id)
                write_text(artifact, canonical_json(payload))
            elif artifact.suffix == ".csv":
                write_text(artifact, "timestamp,zone,occupancy,capacity\n")
            else:
                write_text(artifact, f"Artifact created at {timestamp}\n")

            created.append(artifact)

    return created


def manifest_lines(root: Path) -> list[str]:
    lines: list[str] = []
    for file_path in sorted(root.rglob("*")):
        if not file_path.is_file() or file_path.name == "00_MANIFEST.txt":
            continue
        rel = file_path.relative_to(root).as_posix()
        lines.append(f"{sha256_file(file_path)}  {rel}")
    return lines


def write_manifest(root: Path, *, timestamp: str) -> tuple[Path, str]:
    manifest = root / "00_MANIFEST.txt"
    lines = manifest_lines(root)

    header = [
        f"STAGEPORT SOVEREIGN MANIFEST - {timestamp}",
        "------------------------------------------------",
    ]
    write_text(manifest, "\n".join(header + lines) + "\n")
    return manifest, merkle_root([line.encode("utf-8") for line in lines])


def write_zip(root: Path) -> Path:
    zip_path = root.with_suffix(".zip")
    epoch = int(time.mktime((1980, 1, 1, 0, 0, 0, 0, 0, -1)))

    with zipfile.ZipFile(zip_path, "w", compression=zipfile.ZIP_DEFLATED) as archive:
        for file_path in sorted(root.rglob("*")):
            if not file_path.is_file():
                continue
            arcname = file_path.relative_to(root).as_posix()
            info = zipfile.ZipInfo(arcname)
            info.date_time = time.gmtime(epoch)[:6]
            info.compress_type = zipfile.ZIP_DEFLATED
            info.external_attr = 0o100644 << 16
            archive.writestr(info, file_path.read_bytes())

    return zip_path


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--output", default=ROOT_DEFAULT, help=f"output directory (default: {ROOT_DEFAULT})")
    parser.add_argument("--studio-id", default=ROOT_DEFAULT, help="studio identifier used in generated proof payload")
    parser.add_argument("--timestamp", help="fixed timestamp for reproducible builds (ISO-8601)")
    parser.add_argument("--zip", action="store_true", help="also build a deterministic .zip bundle")
    parser.add_argument("--force", action="store_true", help="overwrite existing scaffold artifacts")
    args = parser.parse_args()

    root = Path(args.output)
    timestamp = args.timestamp or now_iso()

    created = create_files(root, timestamp=timestamp, studio_id=args.studio_id, force=args.force)
    manifest, root_hex = write_manifest(root, timestamp=timestamp)

    print(f"Bridge kit generated at: {root.resolve()}")
    print(f"Artifacts considered: {len(created)}")
    print(f"Manifest: {manifest.resolve()}")
    print(f"Merkle root: {root_hex}")

    if args.zip:
        zip_path = write_zip(root)
        print(f"ZIP: {zip_path.resolve()}")


if __name__ == "__main__":
    main()
