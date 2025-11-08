import json
import hashlib
import os
import glob
import datetime

ROOT = os.path.dirname(os.path.dirname(__file__))


def hash_file(path):
    h = hashlib.sha256()
    with open(path, 'rb') as f:
        for chunk in iter(lambda: f.read(65536), b''):
            h.update(chunk)
    return h.hexdigest()[:16]


def load_manifest(path):
    with open(path, 'r', encoding='utf-8') as f:
        return json.load(f)


def find_manifests():
    return glob.glob(os.path.join(ROOT, "**", "manifest.json"), recursive=True)


def build_mesh():
    nodes, edges = {}, []
    build_timestamp = datetime.datetime.now(datetime.UTC).isoformat()
    
    for mf in find_manifests():
        m = load_manifest(mf)
        node_id = f"{m['type']}:{m['name']}"
        node_path = os.path.dirname(mf)
        
        # Check if node directory exists and is accessible
        path_exists = os.path.exists(node_path) and os.path.isdir(node_path)
        
        nodes[node_id] = {
            "type": m["type"],
            "name": m["name"],
            "version": m.get("version", "0.0.0"),
            "path": os.path.relpath(node_path, ROOT),
            "hash": hash_file(mf),
            "metadata": {k: v for k, v in m.items() if k not in ["name", "type", "version"]},
            "status": {
                "path_exists": path_exists,
                "last_scanned": build_timestamp,
                "manifest_valid": True
            }
        }
        for dep in m.get("depends_on", []) + m.get("includes", []):
            edges.append({"from": node_id, "to": dep})
    
    return {
        "nodes": nodes,
        "edges": edges,
        "meta": {
            "built_at": build_timestamp,
            "total_nodes": len(nodes),
            "total_edges": len(edges)
        }
    }


if __name__ == "__main__":
    mesh = build_mesh()
    out = os.path.join(ROOT, "ops", "mesh.json")
    with open(out, "w", encoding='utf-8') as f:
        json.dump(mesh, f, indent=2)
    print(f"mesh → {out}  nodes={len(mesh['nodes'])} edges={len(mesh['edges'])}")
