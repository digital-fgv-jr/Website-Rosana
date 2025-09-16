from pathlib import Path
BASE_DIR = Path(__file__).resolve().parent.parent

## Loading Environment Variables
import os
import ast

"""Configurações principais do Django e variáveis de ambiente."""
# Django
SECRET_KEY = os.getenv('SECRET_KEY')
# Evita "== True" frágil; aceita strings comuns ("1", "true", "True")
try:
    DEBUG = ast.literal_eval(os.getenv('DEBUG', 'False')) is True
except Exception:
    DEBUG = False

ALLOWED_HOSTS = os.getenv('ALLOWED_HOSTS', '127.0.0.1,localhost').split(',')
ADMIN_DOMAIN = os.getenv('ADMIN_DOMAIN', 'admin.localhost')
API_DOMAIN = os.getenv('API_DOMAIN', 'api.localhost')
FRONTEND_DOMAIN = os.getenv('FRONTEND_DOMAIN', 'localhost:5173')

SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')

CSRF_COOKIE_SECURE = True
SESSION_COOKIE_SECURE = True
# Em dev, permitir http do frontend; em prod, manter https
CSRF_TRUSTED_ORIGINS = [
    f"https://{ADMIN_DOMAIN}",
    f"https://{FRONTEND_DOMAIN}",
    f"http://{FRONTEND_DOMAIN}",
]

"""Chaves de API/Integrações"""
API_KEY = os.getenv('API_KEY')
MERCADOPAGO_ACCESS_TOKEN = os.getenv('MERCADOPAGO_ACCESS_TOKEN')
MELHOR_ENVIO_NAME = os.getenv('MELHOR_ENVIO_NAME')
MELHOR_ENVIO_CLIENT_ID = os.getenv('MELHOR_ENVIO_CLIENT_ID')
MELHOR_ENVIO_TOKEN = os.getenv('MELHOR_ENVIO_TOKEN')
MELHOR_ENVIO_EMAIL = os.getenv('MELHOR_ENVIO_EMAIL')
MELHOR_ENVIO_BASE_URL = os.getenv('MELHOR_ENVIO_BASE_URL')

# PSQL
POSTGRES_DB = os.getenv('POSTGRES_DB')
POSTGRES_USER = os.getenv('POSTGRES_USER')
POSTGRES_PASSWORD = os.getenv('POSTGRES_PASSWORD')
POSTGRES_HOST = os.getenv('POSTGRES_HOST')
POSTGRES_PORT = os.getenv('POSTGRES_PORT')

FRONTEND_BASE_URL = os.getenv('FRONTEND_BASE_URL', 'http://localhost:5173')


## Application definition

INSTALLED_APPS = [
    'jazzmin',
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',

    'core',
    'rest_framework',
    'corsheaders',
]

REST_FRAMEWORK = {
    'DEFAULT_PERMISSION_CLASSES': [
        'core.permissions.HasAPIKey',
    ]
}

JAZZMIN_SETTINGS = {
    "site_title": "Rô Jewellery Admin",
    "site_header": "Rô Jewellery Admin",
    "site_brand": "Rô Jewellery Admin",
    "site_logo": "core/img/logo.png",
    "welcome_sign": "Bem-vindo à Minha Loja",
    'login_logo': "core/img/logo_nobg.png",
    "custom_css": "core/css/admin_extra.css",
}

JAZZMIN_UI_TWEAKS = {
    "theme": "flatly",
}

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'core.middleware.SubdomainURLConfMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

def _origins_for(domain: str):
    if not domain:
        return []
    return [f"http://{domain}", f"https://{domain}"]

# Em desenvolvimento, libere tudo para evitar atrito com CORS
CORS_ALLOW_ALL_ORIGINS = DEBUG is True

# Em produção, restrinja explicitamente usando os domínios configurados
if not CORS_ALLOW_ALL_ORIGINS:
    # Inclui o FRONTEND_DOMAIN (pode ter porta, ex.: compilerhub.store:82)
    _allowed = set()
    for d in [FRONTEND_DOMAIN, API_DOMAIN, 'localhost:5173', '127.0.0.1:5173']:
        for o in _origins_for(d):
            _allowed.add(o)
    CORS_ALLOWED_ORIGINS = sorted(_allowed)
else:
    CORS_ALLOWED_ORIGINS = []

CORS_ALLOWED_HEADERS = [
    'accept',
    'accept-encoding',
    'authorization',
    'content-type',
    'x-api-key',
    'x-csrftoken',
    'x-requested-with',
]

ROOT_URLCONF = 'backend.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'backend.wsgi.application'


DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': POSTGRES_DB,
        'USER': POSTGRES_USER,
        'PASSWORD': POSTGRES_PASSWORD,
        'HOST': POSTGRES_HOST,
        'PORT': POSTGRES_PORT,
    }
}


AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


LANGUAGE_CODE = 'pt-br'

TIME_ZONE = 'America/Sao_Paulo'

USE_I18N = True

USE_TZ = True


STATIC_URL = 'static/'
STATIC_ROOT = os.path.join(BASE_DIR, 'static')
MEDIA_URL = 'media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')

# Default primary key field type
# https://docs.djangoproject.com/en/5.2/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'