#!/usr/bin/env bash
# Builds the Islandr.io browser client and assembles a static site in dist/ for Vercel.
# Vercel serves dist/ as the frontend; /api/* is proxied to the Railway API (see vercel.json).
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

echo "==> Installing client dependencies"
cd client
# --include=dev: Vercel may set NODE_ENV=production, but we need tsc/browserify/uglify (devDeps).
npm install --include=dev
echo "==> Building client bundle (tsc -> browserify -> uglify)"
npm run build
cd "$ROOT"

echo "==> Assembling dist/"
rm -rf dist
mkdir -p dist

# HTML entry pages
cp client/index.html client/loadout.html client/deathMarker.html dist/

# Compiled/minified JS bundle + stylesheets (client/scripts/css)
cp -r client/scripts dist/scripts

# Game image/audio assets
cp -r client/assets dist/assets

# Static public files (favicon.ico, menu.wav, changelog.txt, ...) live at the site root
cp -r client/public/. dist/

# Shared game data (weapons, healings, languages, colors) served under /data
cp -r data dist/data

# Inject the production game-server host into the "Server Address" input, if provided.
# GAME_SERVER_URL is a Vercel build env var, e.g. "islandr-game.up.railway.app" (no protocol/port).
if [ -n "${GAME_SERVER_URL:-}" ]; then
	echo "==> Injecting GAME_SERVER_URL=$GAME_SERVER_URL into dist/index.html"
	sed -i "s#value=\"127.0.0.1:8080\"#value=\"$GAME_SERVER_URL\"#" dist/index.html
else
	echo "==> GAME_SERVER_URL not set; leaving default 127.0.0.1:8080 (set it in Vercel for production)"
fi

echo "==> dist/ ready:"
ls -la dist
