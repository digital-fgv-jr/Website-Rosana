#!/usr/bin/env sh
set -euo pipefail

if ! command -v heroku >/dev/null 2>&1; then
  echo "Heroku CLI não encontrado. Instale em: https://devcenter.heroku.com/articles/heroku-cli" >&2
  exit 1
fi

: "${HEROKU_FRONTEND_APP:?Defina HEROKU_FRONTEND_APP com o nome do app do frontend}"

echo "[heroku] Login no Container Registry..."
heroku container:login

echo "[heroku] Push da imagem do frontend (Nginx)..."
heroku container:push web -a "$HEROKU_FRONTEND_APP" -f frontend/Dockerfile

echo "[heroku] Release da imagem..."
heroku container:release web -a "$HEROKU_FRONTEND_APP"

echo "[heroku] Feito. App: https://$HEROKU_FRONTEND_APP.herokuapp.com"

