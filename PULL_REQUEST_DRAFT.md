Title: Backend hardening, env config, and Docker production readiness

Summary
- Harden Docker image for production and Pillow/system deps.
- Make settings more robust to env inputs and CSRF origins.
- Fix Frenet integration config handling and error messages.
- Relax webhook auth (AllowAny) pending signature validation.
- Simplify entrypoint to stop recreating migrations at runtime.
- Add pinned production requirements list.
- Expand README with run and env instructions.

Why these changes
- backend/Dockerfile
  - Add Alpine build and image libraries (jpeg, zlib, freetype, tiff, etc.) so Pillow and related packages build and run reliably in production.
  - Switch to `requirements.prod.txt` to ensure pinned, deterministic builds for production (separate from any dev-only requirements).
  - Remove `collectstatic` from build stage to avoid coupling image build with runtime environment variables and storage; static collection now happens at startup via entrypoint.

- backend/backend/settings.py
  - Robust DEBUG parsing: avoid `== True` pattern which is fragile with string envs; fall back to False on invalid input to be safer in production.
  - Introduce `FRONTEND_DOMAIN` and include `http://` for CSRF trusted origins in development while keeping `https://` for production.
  - Group and document API keys; add compatibility for legacy `FRENET_TOKEN` while preferring `FRENET_API_KEY`.
  - Add `FRENET_API_URL` to avoid hardcoding endpoints and allow environment-based configuration.

- backend/core/serializers.py
  - Read Frenet credentials from either `FRENET_API_KEY` or `FRENET_TOKEN` and require `FRENET_API_URL` explicitly. This prevents silent failures when envs are missing and produces clearer validation errors for misconfiguration.
  - Use the computed `api_url_frenet` instead of referencing settings directly to align with the validation logic.

- backend/core/views.py
  - Set `AllowAny` for Mercado Pago and Frenet webhook endpoints. Webhooks typically cannot include a client API key; the correct approach is request signature validation (to be added). This change restores webhook reachability while acknowledging the need for HMAC/signature verification later.

- backend/scripts/entrypoint.sh
  - Remove deletion and recreation of Django migrations at container startup. Recreating migrations at runtime is unsafe and can corrupt schema history; migrations should be versioned and applied deterministically. Keep `migrate` and `collectstatic` at startup.

- backend/requirements.prod.txt
  - Add a locked set of production dependencies (Django, DRF, Pillow, psycopg2-binary, requests, gunicorn, etc.) to ensure reproducible builds and avoid surprise upgrades.

- README.md
  - Expand instructions with Docker usage, environment variables, and architecture notes. Clarify that secrets must not be shipped to the frontend and that webhooks should validate signatures instead of requiring client API keys.

Notes and next steps
- Consider adding webhook signature verification for MP and Frenet.
- Ensure `CSRF_TRUSTED_ORIGINS` matches deployed domains (http/https as appropriate).
- If using S3 or another backend for static files, move `collectstatic` to the deploy phase with appropriate credentials.
