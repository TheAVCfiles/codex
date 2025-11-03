import json
import hashlib
import os
import glob

ROOT = os.path.dirname(os.path.dirname(__file__))


def hash_file(path: str) -> str:
    h = hashlib.sha256()
    with open(path, "rb") as f:
        for chunk in iter(lambda: f.read(65536), b""):
            h.update(chunk)
    return h.hexdigest()[:16]


def load_manifest(path: str) -> dict:
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)


def find_manifests() -> list[str]:
    return glob.glob(os.path.join(ROOT, "**", "manifest.json"), recursive=True)


def build_mesh() -> dict:
    nodes: dict[str, dict] = {}
    edges: list[dict[str, str]] = []
    for mf in find_manifests():
        m = load_manifest(mf)
        name = m["name"]
        node_id = f"{m['type']}:{name}"
        nodes[node_id] = {
            "type": m["type"],
            "name": name,
            "version": m.get("version", "0.0.0"),
            "path": os.path.relpath(os.path.dirname(mf), ROOT),
            "hash": hash_file(mf),
            "metadata": {
                k: v
                for k, v in m.items()
                if k not in ["name", "type", "version"]
            },
        }
        for dep in m.get("depends_on", []) + m.get("includes", []):
            edges.append({"from": node_id, "to": dep})
    return {"nodes": nodes, "edges": edges}


if __name__ == "__main__":
    mesh = build_mesh()
    out = os.path.join(ROOT, "ops", "mesh.json")
    with open(out, "w", encoding="utf-8") as f:
        json.dump(mesh, f, indent=2)
    print(f"mesh → {out}  nodes={len(mesh['nodes'])} edges={len(mesh['edges'])}")
