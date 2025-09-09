from pathlib import Path
BASE_DIR = Path(__file__).resolve().parent.parent

## Loading Environment Variables
import os
from dotenv import load_dotenv
import ast
load_dotenv(os.path.join(BASE_DIR, '.env'))
SECRET_KEY = os.environ.get('SECRET_KEY')
DEBUG = ast.literal_eval(os.environ.get('DEBUG')) == True
# PSQL
PSQL_NAME= str(os.environ.get('PSQL_NAME'))
PSQL_USER= str(os.environ.get('PSQL_USER'))
PSQL_PASSWORD= str(os.environ.get('PSQL_PASSWORD'))
PSQL_HOST= str(os.environ.get('PSQL_HOST'))
PSQL_PORT= str(os.environ.get('PSQL_PORT'))
# Mercado pago
MERCADOPAGO_ACCESS_TOKEN=str(os.environ.get('MERCADOPAGO_ACCESS_TOKEN'))
# Frenet
FRENET_API_KEY=str(os.environ.get('FRENET_API_KEY'))
# Cep fisico do ecomerce
MEU_CEP_ORIGEM=str(os.environ.get('MEU_CEP_ORIGEM'))
# Back-end API KEY
API_KEY=str(os.environ.get('API_KEY'))

ALLOWED_HOSTS = []

BASE_URL = '127.0.0.1:8000'


# Application definition

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
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
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
        'NAME': PSQL_NAME,
        'USER': PSQL_USER,
        'PASSWORD': PSQL_PASSWORD,
        'HOST': PSQL_HOST,
        'PORT': PSQL_PORT,
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
