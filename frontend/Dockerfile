FROM node:24.7-alpine AS builder

WORKDIR /app

ARG VITE_API_URL
ARG VITE_API_KEY
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_API_KEY=$VITE_API_KEY

COPY package*.json ./
# Descomentar a linha abaixo para produção
#RUN npm ci --omit=dev
RUN npm ci

COPY . .

RUN npm run build

FROM nginx:1.29.1-alpine

# Copia os artefatos estáticos do build
COPY --from=builder /app/dist /usr/share/nginx/html

RUN mkdir -p /etc/nginx/templates
COPY nginx-heroku.conf.template /etc/nginx/templates/heroku.conf.template
COPY nginx-local.conf.template /etc/nginx/templates/local.conf.template

# Entrypoint: aplica envsubst no template para usar $PORT, caindo para 80 se não definido
COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

EXPOSE 80

ENTRYPOINT ["/docker-entrypoint.sh"]
