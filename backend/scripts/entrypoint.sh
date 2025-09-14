#!/bin/sh

# Sair imediatamente se um comando falhar
set -e

echo "Aplicando migrações do banco de dados..."
python manage.py migrate --no-input

echo "Coletando arquivos estáticos..."
python manage.py collectstatic --no-input

echo "Criando superusuário, se necessário..."
python manage.py shell <<EOF
from django.contrib.auth import get_user_model

User = get_user_model()

if not User.objects.filter(username='${DJANGO_SUPERUSER_USERNAME}').exists():
    User.objects.create_superuser(
        '${DJANGO_SUPERUSER_USERNAME}',
        '${DJANGO_SUPERUSER_EMAIL}',
        '${DJANGO_SUPERUSER_PASSWORD}'
    )
    print("Superusuário criado.")
else:
    print("Superusuário já existe.")
EOF

echo "Iniciando Gunicorn..."
exec gunicorn --bind 0.0.0.0:8000 backend.wsgi:application