#!/usr/bin/env sh
set -euo pipefail

# Optionally build first if requested
if [ "${BUILD:-}" = "1" ]; then
  echo "[deploy-frontend] BUILD=1 -> building nginx (frontend) image..."
  docker compose build nginx
fi

echo "[deploy-frontend] Deploying frontend (nginx) without touching backend..."
docker compose up -d --no-deps nginx

echo "[deploy-frontend] Deployed nginx."

