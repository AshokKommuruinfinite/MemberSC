#!/usr/bin/env sh
set -e
cd "$(dirname "$0")"
if ! command -v node >/dev/null 2>&1; then
  echo "Please install Node.js 18 or newer." >&2; exit 1
fi
if [ ! -d node_modules ]; then npm install; fi
npm run dev
