#!/bin/sh

# Sair imediatamente se um comando falhar
set -e

# 1. Executar as Migrações do Banco de Dados
echo "Aplicando migrações do banco de dados..."
python manage.py migrate --no-input
# 2. Coletar Arquivos Estáticos
# Embora o build já faça isso, é uma boa prática garantir que esteja atualizado.
echo "Coletando arquivos estáticos..."
python manage.py collectstatic --no-input

# 3. Criar o Superusuário (de forma idempotente)
# Este script Python verifica se o superusuário já existe antes de tentar criá-lo.
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

# 4. Inicia o servidor Gunicorn
# 'exec' é importante pois substitui o processo do script pelo do Gunicorn,
# tornando o Gunicorn o processo principal (PID 1) do contêiner.
echo "Iniciando Gunicorn..."
# Respeita a porta definida pelo provedor (Heroku/Render) ou usa 8000 por padrão
PORT="${PORT:-8000}"
exec gunicorn --bind 0.0.0.0:${PORT} backend.wsgi:application
