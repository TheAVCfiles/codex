"""DevOpps adapter for export rendering backends.

The default implementation keeps a local file-native fallback.
"""

from pathlib import Path


def export_pdf_placeholder(target: Path, title: str) -> None:
    target.write_text(f"PDF placeholder for: {title}\n", encoding="utf-8")
