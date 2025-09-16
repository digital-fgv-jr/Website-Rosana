#!/usr/bin/env sh
set -euo pipefail

# Build only the frontend (nginx) image
echo "[build-frontend] Building nginx (frontend) image..."
docker compose build nginx

echo "[build-frontend] Done."

