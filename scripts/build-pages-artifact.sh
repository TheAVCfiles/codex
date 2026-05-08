#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
DIST_DIR="$ROOT_DIR/.pages-dist"
TMP_WEB_BUILT=0

rm -rf "$DIST_DIR"
mkdir -p "$DIST_DIR"

copy_if_exists() {
  local src="$1"
  local dest="$2"
  if [ -e "$src" ]; then
    mkdir -p "$(dirname "$dest")"
    cp -R "$src" "$dest"
  fi
}

if [ -f "$ROOT_DIR/web/package.json" ]; then
  pushd "$ROOT_DIR/web" >/dev/null

  if [ -f package-lock.json ]; then
    npm ci
  else
    npm install
  fi

  if npm run build; then
    if [ -d "$ROOT_DIR/web/dist" ]; then
      cp -R "$ROOT_DIR/web/dist/." "$DIST_DIR/"
      TMP_WEB_BUILT=1
    fi
  fi

  popd >/dev/null
fi

if [ "$TMP_WEB_BUILT" -eq 0 ] || [ ! -f "$DIST_DIR/index.html" ]; then
  cat > "$DIST_DIR/index.html" <<'HTML'
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Codex Static Preservation</title>
  </head>
  <body>
    <h1>Codex Static Preservation Surface</h1>
    <p>This GitHub Pages artifact is a resilient static fallback for docs and governance surfaces.</p>
    <ul>
      <li><a href="README.md">README</a></li>
      <li><a href="docs/">docs/</a></li>
      <li><a href="project/">project/</a></li>
      <li><a href="llms.txt">llms.txt</a></li>
      <li><a href="ai-rights.txt">ai-rights.txt</a></li>
    </ul>
  </body>
</html>
HTML
fi

copy_if_exists "$ROOT_DIR/docs" "$DIST_DIR/docs"
copy_if_exists "$ROOT_DIR/project" "$DIST_DIR/project"
copy_if_exists "$ROOT_DIR/public" "$DIST_DIR/public"
copy_if_exists "$ROOT_DIR/README.md" "$DIST_DIR/README.md"
copy_if_exists "$ROOT_DIR/llms.txt" "$DIST_DIR/llms.txt"
copy_if_exists "$ROOT_DIR/ai-rights.txt" "$DIST_DIR/ai-rights.txt"
copy_if_exists "$ROOT_DIR/robots.txt" "$DIST_DIR/robots.txt"
copy_if_exists "$ROOT_DIR/sitemap.xml" "$DIST_DIR/sitemap.xml"

touch "$DIST_DIR/.nojekyll"

echo "Built Pages artifact at $DIST_DIR"
