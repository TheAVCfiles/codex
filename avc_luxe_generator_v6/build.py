#!/usr/bin/env python3
"""Build sealed local-first client packages for AVC Luxe V6."""

from __future__ import annotations

import json
import pathlib
import shutil
import sys
import zipfile

ROOT = pathlib.Path(__file__).resolve().parent
TEMPLATES = ROOT / "templates"
OUTPUT = ROOT / "output"

THEMES = {
    "obsidian": {
        "bg": "#050507",
        "panel": "#0f1014",
        "text": "#f5f3f7",
        "muted": "#8a8791",
        "accent": "#d6c3a3",
    },
    "violet": {
        "bg": "#07060f",
        "panel": "#13111d",
        "text": "#f1eefe",
        "muted": "#8b85a8",
        "accent": "#c9b3ff",
    },
    "graphite": {
        "bg": "#0a0b0d",
        "panel": "#111418",
        "text": "#f3f4f6",
        "muted": "#8b949e",
        "accent": "#c7b38d",
    },
}

ARCHETYPES = {
    "founder_safe": {
        "session_idle": "Session unavailable",
        "session_active": "Session secured. Local runtime active. No data transmitted.",
        "atlas_tone": "Contained signal system. Movement is instruction. Execution is proof.",
    },
    "institutional": {
        "session_idle": "Access restricted",
        "session_active": "Contained runtime verified. No live data transmission.",
        "atlas_tone": "Control precedes scale. Structure precedes exposure. Access is constraint.",
    },
    "creative_luxe": {
        "session_idle": "Signal withheld",
        "session_active": "Local runtime active. No data transmitted.",
        "atlas_tone": "The object is real. The system is legible. Access unlocks the next layer.",
    },
}


def replace_tokens(raw: str, mapping: dict[str, str]) -> str:
    for key, value in mapping.items():
        raw = raw.replace(f"{{{{{key}}}}}", str(value))
    return raw


def load_config(path: pathlib.Path) -> dict:
    cfg = json.loads(path.read_text(encoding="utf-8"))
    cfg.setdefault("client_slug", slugify(cfg["client_name"]))
    cfg.setdefault("theme", "obsidian")
    cfg.setdefault("archetype", "founder_safe")
    cfg.setdefault("tagline", "Private operating environment")
    cfg.setdefault("operator_name", "AVC Systems Studio")
    cfg.setdefault("proof_line", "Phase I proves behavior. Phase II activates infrastructure.")
    cfg.setdefault("activation_line", "Access requires activation.")
    cfg.setdefault("modules", {"session": True, "interface": True, "atlas": True, "proof": True, "next": True})
    return cfg


def slugify(value: str) -> str:
    return "".join(ch.lower() if ch.isalnum() else "_" for ch in value).strip("_")


def write(path: pathlib.Path, content: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(content, encoding="utf-8")


def maybe_write(enabled: bool, path: pathlib.Path, content: str) -> None:
    if enabled:
        write(path, content)


def build(config_path: pathlib.Path) -> pathlib.Path:
    cfg = load_config(config_path)
    theme = THEMES[cfg["theme"]]
    archetype = ARCHETYPES[cfg["archetype"]]

    package_name = f"{cfg['client_slug']}_private"
    out = OUTPUT / package_name
    if out.exists():
        shutil.rmtree(out)
    out.mkdir(parents=True, exist_ok=True)

    accent = cfg.get("primary_color") or theme["accent"]
    bg = cfg.get("background") or theme["bg"]

    mapping = {
        "CLIENT_NAME": cfg["client_name"],
        "CLIENT_SLUG": cfg["client_slug"],
        "TAGLINE": cfg["tagline"],
        "OPERATOR_NAME": cfg["operator_name"],
        "SESSION_IDLE": archetype["session_idle"],
        "SESSION_ACTIVE": archetype["session_active"],
        "ATLAS_TONE": archetype["atlas_tone"],
        "PROOF_LINE": cfg["proof_line"],
        "ACTIVATION_LINE": cfg["activation_line"],
        "THEME_BG": bg,
        "THEME_PANEL": theme["panel"],
        "THEME_TEXT": theme["text"],
        "THEME_MUTED": theme["muted"],
        "THEME_ACCENT": accent,
    }

    write(out / "system.json", json.dumps(cfg, indent=2) + "\n")

    write(out / "00_OPEN_ME.html", replace_tokens((TEMPLATES / "00_OPEN_ME.html").read_text(encoding="utf-8"), mapping))
    maybe_write(cfg["modules"].get("session", True), out / "01_SESSION" / "index.html", replace_tokens((TEMPLATES / "01_SESSION_index.html").read_text(encoding="utf-8"), mapping))
    maybe_write(cfg["modules"].get("session", True), out / "01_SESSION" / "demo.html", replace_tokens((TEMPLATES / "01_SESSION_demo.html").read_text(encoding="utf-8"), mapping))
    maybe_write(cfg["modules"].get("interface", True), out / "02_INTERFACE" / "dashboard.html", replace_tokens((TEMPLATES / "02_INTERFACE_dashboard.html").read_text(encoding="utf-8"), mapping))
    maybe_write(cfg["modules"].get("interface", True), out / "02_INTERFACE" / "modules.json", json.dumps({"modules": ["session", "interface", "atlas", "proof", "next"]}, indent=2) + "\n")
    maybe_write(cfg["modules"].get("atlas", True), out / "03_ATLAS" / "manifesto.html", replace_tokens((TEMPLATES / "03_ATLAS_manifesto.html").read_text(encoding="utf-8"), mapping))
    maybe_write(cfg["modules"].get("atlas", True), out / "03_ATLAS" / "tone.txt", replace_tokens("{{ATLAS_TONE}}\n", mapping))
    maybe_write(cfg["modules"].get("proof", True), out / "04_PROOF" / "system_brief.txt", replace_tokens((TEMPLATES / "04_PROOF_system_brief.txt").read_text(encoding="utf-8"), mapping))
    maybe_write(cfg["modules"].get("proof", True), out / "04_PROOF" / "black_card_content.txt", replace_tokens("Phase I Complete\nSystem Exists\nBehavior Verified\n", mapping))
    maybe_write(cfg["modules"].get("next", True), out / "05_NEXT" / "unlock.html", replace_tokens((TEMPLATES / "05_NEXT_unlock.html").read_text(encoding="utf-8"), mapping))
    write(out / "config" / "theme.css", replace_tokens((TEMPLATES / "config_theme.css").read_text(encoding="utf-8"), mapping))

    zip_path = OUTPUT / f"{package_name}_environment.zip"
    if zip_path.exists():
        zip_path.unlink()
    with zipfile.ZipFile(zip_path, "w", zipfile.ZIP_DEFLATED) as archive:
        for file in out.rglob("*"):
            if file.is_file():
                archive.write(file, file.relative_to(out))

    return zip_path


def main() -> int:
    if len(sys.argv) != 2:
        print("Usage: python3 build.py <path-to-client-json>")
        return 1

    zip_path = build(pathlib.Path(sys.argv[1]).resolve())
    print(zip_path)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
