#!/usr/bin/env sh
set -euo pipefail

# Build only the backend image
echo "[build-backend] Building backend image..."
docker compose build backend

echo "[build-backend] Done."

