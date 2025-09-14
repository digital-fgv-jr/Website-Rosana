#!/usr/bin/env sh
set -euo pipefail

if ! command -v heroku >/dev/null 2>&1; then
  echo "Heroku CLI não encontrado. Instale em: https://devcenter.heroku.com/articles/heroku-cli" >&2
  exit 1
fi

: "${HEROKU_BACKEND_APP:?Defina HEROKU_BACKEND_APP com o nome do app do backend}"

echo "[heroku] Login no Container Registry..."
heroku container:login

echo "[heroku] Push da imagem do backend..."
heroku container:push web -a "$HEROKU_BACKEND_APP" -f backend/Dockerfile

echo "[heroku] Release da imagem..."
heroku container:release web -a "$HEROKU_BACKEND_APP"

echo "[heroku] Feito. App: https://$HEROKU_BACKEND_APP.herokuapp.com"

