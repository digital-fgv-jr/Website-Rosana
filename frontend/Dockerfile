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

COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

