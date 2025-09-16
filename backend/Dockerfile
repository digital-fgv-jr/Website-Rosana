FROM python:3.13.7-alpine3.22

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

WORKDIR /usr/src/app

# Dependências do sistema (Pillow, etc.)
RUN apk add --no-cache \
    build-base \
    libjpeg-turbo-dev \
    zlib-dev \
    freetype-dev \
    lcms2-dev \
    openjpeg-dev \
    tiff-dev \
    postgresql-libs

COPY requirements.prod.txt ./requirements.txt
RUN pip install --no-cache-dir gunicorn -r requirements.txt

COPY . .

COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

EXPOSE 8000

ENTRYPOINT ["/docker-entrypoint.sh"]
