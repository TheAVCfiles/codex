#!/usr/bin/env python3
"""Create and scaffold a GitHub repository for StagePort-style automation.

Usage:
  export GITHUB_TOKEN=ghp_...
  python scripts/github_bootstrap_repo.py \
    --owner TheAVCfiles \
    --repo stageport-system \
    --private
"""

from __future__ import annotations

import argparse
import json
import os
import subprocess
import sys
import tempfile
from pathlib import Path
from typing import Dict
from urllib.error import HTTPError
from urllib.request import Request, urlopen

API_ROOT = "https://api.github.com"

README_CONTENT = """# stageport-system

GitHub-native StagePort pipeline scaffold with Actions-based build + Pages deployment.
"""

PAGES_WORKFLOW = """name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: write

jobs:
  build-deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Set up Python
        uses: actions/setup-python@v5
        with:
          python-version: '3.11'

      - name: Run build scripts
        run: |
          python3 scripts/musings_score.py
          python3 scripts/build_demos.py
          python3 scripts/build_deal_rooms.py
          python3 scripts/build_witness.py

      - name: Deploy static site
        uses: peaceiris/actions-gh-pages@v4
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./site
"""

GITIGNORE = """# Python
__pycache__/
*.pyc
.venv/

# Build artifacts
site/

# OS/editor
.DS_Store
.vscode/
"""


def _api_request(token: str, method: str, path: str, payload: dict | None = None) -> Dict:
    data = None
    if payload is not None:
        data = json.dumps(payload).encode("utf-8")

    req = Request(
        f"{API_ROOT}{path}",
        method=method,
        data=data,
        headers={
            "Authorization": f"Bearer {token}",
            "Accept": "application/vnd.github+json",
            "X-GitHub-Api-Version": "2022-11-28",
            "Content-Type": "application/json",
            "User-Agent": "stageport-bootstrap-script",
        },
    )

    try:
        with urlopen(req) as res:
            raw = res.read().decode("utf-8")
            return json.loads(raw) if raw else {}
    except HTTPError as e:
        body = e.read().decode("utf-8", errors="replace")
        raise RuntimeError(f"GitHub API {method} {path} failed: {e.code} {body}") from e


def create_repo(token: str, name: str, private: bool, description: str) -> Dict:
    return _api_request(
        token,
        "POST",
        "/user/repos",
        {
            "name": name,
            "private": private,
            "description": description,
            "auto_init": False,
        },
    )


def commit_via_git(owner: str, repo: str, default_branch: str) -> None:
    with tempfile.TemporaryDirectory() as tmp:
        root = Path(tmp) / repo
        root.mkdir(parents=True, exist_ok=True)

        (root / ".github" / "workflows").mkdir(parents=True, exist_ok=True)
        (root / "scripts").mkdir(parents=True, exist_ok=True)
        (root / "docs").mkdir(parents=True, exist_ok=True)
        (root / "data").mkdir(parents=True, exist_ok=True)
        (root / "site").mkdir(parents=True, exist_ok=True)

        (root / "README.md").write_text(README_CONTENT, encoding="utf-8")
        (root / ".gitignore").write_text(GITIGNORE, encoding="utf-8")
        (root / ".github" / "workflows" / "pages.yml").write_text(PAGES_WORKFLOW, encoding="utf-8")

        placeholder = "#!/usr/bin/env python3\nprint('TODO: implement build step')\n"
        for name in ["musings_score.py", "build_demos.py", "build_deal_rooms.py", "build_witness.py"]:
            path = root / "scripts" / name
            path.write_text(placeholder, encoding="utf-8")

        subprocess.run(["git", "init", "-b", default_branch], cwd=root, check=True)
        subprocess.run(["git", "add", "."], cwd=root, check=True)
        subprocess.run(["git", "commit", "-m", "Initial scaffold creation"], cwd=root, check=True)
        subprocess.run(
            ["git", "remote", "add", "origin", f"git@github.com:{owner}/{repo}.git"],
            cwd=root,
            check=True,
        )
        subprocess.run(["git", "push", "-u", "origin", default_branch], cwd=root, check=True)


def enable_pages(token: str, owner: str, repo: str, branch: str = "gh-pages") -> Dict:
    return _api_request(
        token,
        "POST",
        f"/repos/{owner}/{repo}/pages",
        {
            "source": {
                "branch": branch,
                "path": "/",
            }
        },
    )


def main() -> int:
    parser = argparse.ArgumentParser(description="Create + scaffold a StagePort GitHub repository.")
    parser.add_argument("--owner", required=True, help="GitHub owner/user (e.g. TheAVCfiles)")
    parser.add_argument("--repo", required=True, help="Repository name")
    parser.add_argument("--description", default="GitHub-native StagePort pipeline repo scaffolding")
    parser.add_argument("--private", action="store_true", help="Create a private repository")
    parser.add_argument("--default-branch", default="main")
    parser.add_argument(
        "--enable-pages",
        action="store_true",
        help="Attempt to enable GitHub Pages (after first gh-pages deploy)",
    )
    args = parser.parse_args()

    token = os.getenv("GITHUB_TOKEN")
    if not token:
        print("GITHUB_TOKEN is required.", file=sys.stderr)
        return 2

    repo = create_repo(token, args.repo, args.private, args.description)
    print(f"Repository created: {repo.get('html_url')}")

    commit_via_git(args.owner, args.repo, args.default_branch)
    print("Scaffold committed and pushed.")

    if args.enable_pages:
        response = enable_pages(token, args.owner, args.repo)
        print(f"Pages API response: {response}")

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
