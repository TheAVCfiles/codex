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
    manifests = [(mf, load_manifest(mf)) for mf in find_manifests()]

    nodes: dict[str, dict] = {}
    nodes_by_name: dict[str, set[str]] = {}
    for mf, manifest in manifests:
        name = manifest["name"]
        node_id = f"{manifest['type']}:{name}"
        nodes[node_id] = {
            "type": manifest["type"],
            "name": name,
            "version": manifest.get("version", "0.0.0"),
            "path": os.path.relpath(os.path.dirname(mf), ROOT),
            "hash": hash_file(mf),
            "metadata": {
                k: v
                for k, v in manifest.items()
                if k not in ["name", "type", "version"]
            },
        }
        nodes_by_name.setdefault(name, set()).add(node_id)

    def resolve_dependency(dep: str) -> str:
        if ":" in dep:
            if dep not in nodes:
                raise KeyError(f"Unknown dependency id '{dep}'")
            return dep

        candidates = nodes_by_name.get(dep)
        if not candidates:
            raise KeyError(f"Unknown dependency name '{dep}'")
        if len(candidates) > 1:
            raise ValueError(
                f"Ambiguous dependency '{dep}' matches multiple nodes: {sorted(candidates)}"
            )
        return next(iter(candidates))

    edges: list[dict[str, str]] = []
    for _, manifest in manifests:
        node_id = f"{manifest['type']}:{manifest['name']}"
        for dep in manifest.get("depends_on", []) + manifest.get("includes", []):
            edges.append({"from": node_id, "to": resolve_dependency(dep)})

    return {"nodes": nodes, "edges": edges}


if __name__ == "__main__":
    mesh = build_mesh()
    out = os.path.join(ROOT, "ops", "mesh.json")
    with open(out, "w", encoding="utf-8") as f:
        json.dump(mesh, f, indent=2)
    print(f"mesh → {out}  nodes={len(mesh['nodes'])} edges={len(mesh['edges'])}")
