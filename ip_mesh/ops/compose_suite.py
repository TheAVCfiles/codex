"""Tiny helper that reads suite manifests and runs entrypoints.

This script:
1. Optionally refreshes the mesh by running mesh_build.py
2. Reads suite manifests from ip_mesh/suites/*/manifest.json
3. Validates that required dependencies (includes) exist in the mesh
4. Executes suite entrypoints

Usage:
    python ip_mesh/ops/compose_suite.py [suite_name] [--refresh-mesh]

Examples:
    python ip_mesh/ops/compose_suite.py                    # Run all suites
    python ip_mesh/ops/compose_suite.py koll_finance       # Run matching suites
    python ip_mesh/ops/compose_suite.py --refresh-mesh     # Refresh mesh, then run all
"""

from __future__ import annotations

import json
import os
import subprocess
import sys
from pathlib import Path
from typing import Dict, Iterable, List

ROOT = Path(__file__).resolve().parents[1]
SUITES = ROOT / "suites"
OPS = ROOT / "ops"
MESH_BUILD_SCRIPT = OPS / "mesh_build.py"
MESH_JSON = OPS / "mesh.json"


def check_dependencies() -> bool:
    """Verify that all required dependencies exist."""
    missing = []
    
    # Check for mesh_build.py
    if not MESH_BUILD_SCRIPT.exists():
        missing.append(str(MESH_BUILD_SCRIPT))
    
    if missing:
        print("ERROR: Missing required dependencies:", file=sys.stderr)
        for dep in missing:
            print(f"  - {dep}", file=sys.stderr)
        return False
    
    return True


def refresh_mesh() -> int:
    """Run mesh_build.py to refresh the mesh.json file."""
    if not MESH_BUILD_SCRIPT.exists():
        print(f"ERROR: mesh_build.py not found at {MESH_BUILD_SCRIPT}", file=sys.stderr)
        return 1
    
    print(f"Refreshing mesh by running {MESH_BUILD_SCRIPT}...")
    try:
        result = subprocess.run(
            [sys.executable, str(MESH_BUILD_SCRIPT)],
            check=False,
            capture_output=False
        )
        if result.returncode != 0:
            print("ERROR: mesh build failed", file=sys.stderr)
            return result.returncode
        print("Mesh refreshed successfully")
        return 0
    except Exception as e:
        print(f"ERROR: Failed to run mesh_build.py: {e}", file=sys.stderr)
        return 1


def validate_suite_dependencies(manifest: Dict[str, object], suite_name: str) -> bool:
    """Validate that all suite dependencies exist in the mesh."""
    if not MESH_JSON.exists():
        print(f"WARN: mesh.json not found at {MESH_JSON}, skipping validation", file=sys.stderr)
        return True
    
    try:
        mesh_data = json.loads(MESH_JSON.read_text(encoding="utf-8"))
        nodes = set(mesh_data.get("nodes", {}).keys())
        
        includes = manifest.get("includes", [])
        if not includes:
            return True
        
        missing = [inc for inc in includes if inc not in nodes]
        if missing:
            print(f"WARN: Suite '{suite_name}' has missing dependencies in mesh:", file=sys.stderr)
            for dep in missing:
                print(f"  - {dep}", file=sys.stderr)
            return False
        
        return True
    except Exception as e:
        print(f"WARN: Failed to validate dependencies: {e}", file=sys.stderr)
        return True


def load_manifest(path: Path) -> Dict[str, object]:
    return json.loads(path.read_text(encoding="utf-8"))


def iter_suite_manifests() -> Iterable[Path]:
    return sorted(SUITES.glob("*/manifest.json"))


def run_entrypoint(entry: Dict[str, str]) -> int:
    if "cli" in entry:
        print(">", entry["cli"])
        return subprocess.call(entry["cli"].split())
    raise ValueError("Unsupported entrypoint schema")


def compose(suite_filter: str | None = None, refresh: bool = False) -> List[int]:
    """Run suite entrypoints, optionally filtering by name.
    
    Args:
        suite_filter: Optional string to filter suite names
        refresh: If True, refresh the mesh before running suites
    
    Returns:
        List of return codes from entrypoint executions
    """
    # Check dependencies
    if not check_dependencies():
        return [1]
    
    # Optionally refresh mesh
    if refresh:
        rc = refresh_mesh()
        if rc != 0:
            return [rc]
    
    results: List[int] = []
    for manifest_path in iter_suite_manifests():
        manifest = load_manifest(manifest_path)
        name = manifest.get("name", manifest_path.parent.name)
        if suite_filter and suite_filter not in name:
            continue
        
        print(f"\nLaunching suite: {name}")
        
        # Validate dependencies
        validate_suite_dependencies(manifest, name)
        
        # Run entrypoints
        for entry in manifest.get("entrypoints", []):
            results.append(run_entrypoint(entry))
    
    return results


if __name__ == "__main__":
    # Parse arguments
    suite_filter = None
    refresh = False
    
    for arg in sys.argv[1:]:
        if arg == "--refresh-mesh":
            refresh = True
        elif not arg.startswith("-"):
            suite_filter = arg
    
    sys.exit(max(compose(suite_filter, refresh) or [0]))
