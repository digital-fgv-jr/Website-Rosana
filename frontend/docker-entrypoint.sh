#!/usr/bin/env sh
set -euo pipefail

# --- 1. Seleção do Template ---
# Define 'local' como o alvo padrão se DEPLOY_TARGET não for especificado
export DEPLOY_TARGET=${DEPLOY_TARGET:-local}
TEMPLATE_FILE="" # Inicializa a variável

echo "[nginx] Deploy target is set to: ${DEPLOY_TARGET}"

if [ "${DEPLOY_TARGET}" = "heroku" ]; then
    TEMPLATE_FILE="/etc/nginx/templates/heroku.conf.template"
elif [ "${DEPLOY_TARGET}" = "local" ]; then
    TEMPLATE_FILE="/etc/nginx/templates/local.conf.template"
else
    echo "[nginx] Error: Invalid DEPLOY_TARGET '${DEPLOY_TARGET}'. Must be 'heroku' or 'local'."
    exit 1
fi

echo "[nginx] Using template file: ${TEMPLATE_FILE}"

# --- 2. Substituição das Variáveis ---
# Define valores padrão para as outras variáveis
export NGINX_PORT=${NGINX_PORT:-80}
export FRONTEND_DOMAIN=${FRONTEND_DOMAIN:-localhost}
export ADMIN_DOMAIN=${ADMIN_DOMAIN:-admin.localhost}
export API_DOMAIN=${API_DOMAIN:-api.localhost}

# Lista de variáveis a serem substituídas no template
VARS_TO_SUBSTITUTE='$NGINX_PORT $FRONTEND_DOMAIN $ADMIN_DOMAIN $API_DOMAIN'

echo "[nginx] Rendering config with NGINX_PORT=${NGINX_PORT}..."

# Renderiza o template ESCOLHIDO, substituindo as variáveis
envsubst "${VARS_TO_SUBSTITUTE}" < "${TEMPLATE_FILE}" > /etc/nginx/conf.d/default.conf

# --- 3. Inicialização do Nginx ---
echo "[nginx] Starting Nginx..."
exec nginx -g 'daemon off;'