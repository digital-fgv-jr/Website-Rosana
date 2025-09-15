#!/usr/bin/env sh
set -euo pipefail

# Gera config do Nginx com a PORT indicada pelo provedor (fallback: 80)
echo "[nginx] rendering config with PORT=${PORT:-80}"
envsubst '\n$PORT' < /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf

exec nginx -g 'daemon off;'

