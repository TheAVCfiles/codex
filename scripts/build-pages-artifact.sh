#!/usr/bin/env bash
set -euo pipefail

DIST_DIR=".pages-dist"

rm -rf "$DIST_DIR"
mkdir -p "$DIST_DIR"

WEB_BUILT=false

if [ -f "web/package.json" ]; then
  echo "[pages] detected web/package.json"

  pushd web >/dev/null

  if [ -f "package-lock.json" ]; then
    npm ci
  else
    npm install
  fi

  if npm run build; then
    if [ -d "dist" ]; then
      cp -R dist/* "../$DIST_DIR/"
      WEB_BUILT=true
    fi
  fi

  popd >/dev/null
fi

if [ "$WEB_BUILT" = false ]; then
  echo "[pages] using static fallback artifact"

  cat > "$DIST_DIR/index.html" <<'EOF'
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>StagePort Static Preservation Surface</title>
</head>
<body>
  <h1>StagePort Static Preservation Surface</h1>
  <p>Fallback GitHub Pages deployment.</p>
  <ul>
    <li><a href="./README.md">README</a></li>
    <li><a href="./docs/">docs/</a></li>
    <li><a href="./project/">project/</a></li>
  </ul>
</body>
</html>
EOF
fi

for path in docs project public; do
  if [ -d "$path" ]; then
    cp -R "$path" "$DIST_DIR/"
  fi
done

for file in README.md llms.txt ai-rights.txt robots.txt sitemap.xml; do
  if [ -f "$file" ]; then
    cp "$file" "$DIST_DIR/"
  fi
done

touch "$DIST_DIR/.nojekyll"

echo "[pages] artifact prepared in $DIST_DIR"
