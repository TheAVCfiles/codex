import os
import sys
import json
import glob
import subprocess

ROOT = os.path.dirname(os.path.dirname(__file__))
OPS = os.path.join(ROOT, "ops")

def run(cmd: str) -> int:
    print(">", cmd)
    return subprocess.call(cmd, shell=True)

def load_manifest(path: str) -> dict:
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)

def find_suite_manifest(suite_name: str) -> str:
    pattern = os.path.join(ROOT, "suites", suite_name, "manifest.json")
    if os.path.exists(pattern):
        return pattern
    # fuzzy match
    candidates = glob.glob(os.path.join(ROOT, "suites", "*", "manifest.json"))
    for candidate in candidates:
        if suite_name in candidate:
            return candidate
    raise FileNotFoundError(f"No manifest for suite '{suite_name}'")

def compose_and_run(suite_name: str) -> int:
    # 1) refresh mesh
    rc = run(f"{sys.executable} {os.path.join(OPS, 'mesh_build.py')}")
    if rc != 0:
        print("ERROR: mesh build failed")
        return rc
    # 2) read suite manifest
    manifest_path = find_suite_manifest(suite_name)
    manifest = load_manifest(manifest_path)
    # 3) optionally validate 'includes' exist (nodes are in mesh.json)
    mesh_path = os.path.join(OPS, "mesh.json")
    if os.path.exists(mesh_path):
        with open(mesh_path, "r", encoding="utf-8") as f:
            mesh = json.load(f)
        nodes = set(mesh.get("nodes", {}).keys())
        missing = [inc for inc in manifest.get("includes", []) if inc not in nodes]
        if missing:
            print("WARN: missing modules in mesh:", missing)
    # 4) run entrypoints
    for entrypoint in manifest.get("entrypoints", []):
        cli_cmd = entrypoint.get("cli")
        if cli_cmd:
            rc = run(cli_cmd)
            if rc != 0:
                print("ERROR: entrypoint failed:", cli_cmd)
                return rc
    print("Suite complete:", suite_name)
    return 0

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: compose_suite.py <suite_name>  (e.g., koll_finance_ritual)")
        sys.exit(1)
    sys.exit(compose_and_run(sys.argv[1]))
