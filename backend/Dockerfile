FROM python:3.13.7-alpine3.22

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

WORKDIR /usr/src/app

COPY requirements.txt ./
RUN pip install --no-cache-dir gunicorn -r requirements.txt

COPY . .

COPY ./scripts/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

RUN python manage.py collectstatic --no-input

EXPOSE 8000

ENTRYPOINT ["/entrypoint.sh"]
