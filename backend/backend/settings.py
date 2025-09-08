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

ALLOWED_HOSTS = []


# Application definition

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',

    'core.apps.CoreConfig',
    'rest_framework',
]

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


# Database
# https://docs.djangoproject.com/en/5.2/ref/settings/#databases

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


# Password validation
# https://docs.djangoproject.com/en/5.2/ref/settings/#auth-password-validators

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


# Internationalization
# https://docs.djangoproject.com/en/5.2/topics/i18n/

LANGUAGE_CODE = 'pt-br'

TIME_ZONE = 'America/Sao_Paulo'

USE_I18N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/5.2/howto/static-files/

STATIC_URL = 'static/'
MEDIA_URL = 'media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')

# Default primary key field type
# https://docs.djangoproject.com/en/5.2/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'
