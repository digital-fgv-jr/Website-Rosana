#!/usr/bin/env sh
set -euo pipefail

# Optionally build first if requested
if [ "${BUILD:-}" = "1" ]; then
  echo "[deploy-backend] BUILD=1 -> building backend image..."
  docker compose build backend
fi

echo "[deploy-backend] Deploying backend without touching nginx..."
docker compose up -d --no-deps backend

echo "[deploy-backend] Deployed backend."

