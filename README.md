# Website-Rosana

Projeto de trainee (Digital Development 25.2) para o website e API da joalheria da cliente Rosana. Stack: Django REST + React/Vite, Docker + Nginx + Postgres.

## Executar com Docker

1. Crie um arquivo `.env` na raiz com as variáveis abaixo (exemplo na próxima seção).
2. Build e subida dos serviços:

   - `docker compose up --build`

Backend expõe a API no container `backend` (porta 8000 interna) e o Nginx publica o frontend na porta `82` local (`http://localhost:82`).

## Variáveis de ambiente (exemplo)

```
# Django
SECRET_KEY=troque-esta-chave
DEBUG=True
ALLOWED_HOSTS=127.0.0.1,localhost
ADMIN_DOMAIN=admin.localhost
API_DOMAIN=api.localhost
FRONTEND_DOMAIN=localhost:5173
FRONTEND_BASE_URL=http://localhost:5173

# API Key (somente backend). Não exponha no frontend
API_KEY=defina_um_valor_seguro

# Banco de dados
POSTGRES_DB=rosana
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_HOST=db_postgres
POSTGRES_PORT=5432

# Integrações
MERCADOPAGO_ACCESS_TOKEN=seu_token_mp
FRENET_API_KEY=seu_token_frenet
FRENET_API_URL=https://api.frenet.com.br/shipping/quote

# Frontend build args (usados apenas em build)
VITE_API_URL=http://api.localhost
VITE_API_KEY=nao-usar-em-producao

# Admin
DJANGO_SUPERUSER_USERNAME=admin
DJANGO_SUPERUSER_EMAIL=admin@example.com
DJANGO_SUPERUSER_PASSWORD=admin
```

Observação: não exponha segredos no bundle do frontend. `VITE_API_KEY` serve apenas para desenvolvimento local (se necessário). Em produção, prefira autenticação feita no backend.

## Notas de arquitetura

- Webhooks (Mercado Pago e Frenet) não exigem API Key do cliente. É recomendado adicionar verificação de assinatura/HMAC.
- Migrações são aplicadas em runtime, mas não são recriadas automaticamente. Versione as migrações normalmente em `backend/core/migrations/`.
- Para processamento de imagens e integrações externas sob carga, considere mover tarefas para workers (Celery/RQ).

## Desenvolvimento (hot reload)

Pré‑requisitos
- Docker e Docker Compose instalados.
- Arquivo `.env` na raiz com as variáveis (veja exemplo acima). Para dev, use:
  - `VITE_API_URL=http://localhost:8000`
  - `VITE_API_KEY=dev-only` (não use segredos reais)

Como iniciar
- Suba os serviços de desenvolvimento (o override já habilita hot reload):
  - `docker compose up`
  - Opcionalmente, para evitar subir o Nginx de produção: `docker compose up backend db_postgres frontend-dev`

Serviços e URLs
- Frontend (Vite + HMR): `http://localhost:5173`
- Backend (Django autoreload): `http://localhost:8000`
- Admin (Django): `http://localhost:8000/admin`

Detalhes
- O arquivo `docker-compose.override.yml` troca o backend para `runserver` (com autoreload) e adiciona o serviço `frontend-dev` (Vite com HMR).
- Em macOS/Windows, `CHOKIDAR_USEPOLLING=true` já está ligado no `frontend-dev` para detectar mudanças via Docker Desktop.
- CORS/CSRF já permitem `http://localhost:5173`. Se trocar host/porta, ajuste `FRONTEND_DOMAIN`, `CORS_ALLOWED_ORIGINS` e `CSRF_TRUSTED_ORIGINS` conforme necessário.
- Variáveis que começam com `VITE_` ficam públicas no bundle. Use apenas valores de desenvolvimento.

### Acesso via "compilerhub" (porta 82)

Se quiser acessar usando os hostnames configurados no Nginx local (porta 82):

- Adicione ao `/etc/hosts`:
  - `127.0.0.1 compilerhub.store`
  - `127.0.0.1 api.compilerhub.store`
  - `127.0.0.1 admin.compilerhub.store`

- Ajuste o `.env` (antes do build do frontend):
  - `VITE_API_URL=http://api.compilerhub.store:82`
  - `FRONTEND_DOMAIN=compilerhub.store:82`
  - `API_DOMAIN=api.compilerhub.store`
  - `ADMIN_DOMAIN=admin.compilerhub.store`
  - Inclua em `ALLOWED_HOSTS`: `compilerhub.store,api.compilerhub.store,admin.compilerhub.store`

- Rebuild do frontend para incorporar as variáveis `VITE_*`:
  - `docker compose up --build` (ou `docker compose build nginx`)

- URLs:
  - Frontend: `http://compilerhub.store:82`
  - API: `http://api.compilerhub.store:82`
  - Admin: `http://admin.compilerhub.store:82`

Observação: a API retorna paths relativos para imagens (`/media/...`) e o frontend monta a URL final usando `VITE_API_URL`. Por isso é essencial definir `VITE_API_URL` com o host/porta corretos (incluindo `:82`).
