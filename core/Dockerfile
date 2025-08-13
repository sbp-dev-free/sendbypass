FROM python:3.11

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

WORKDIR /app

RUN apt update; apt install -y vim

COPY Pipfile /app
COPY Pipfile.lock /app

RUN pip install pipenv
RUN pip install httpie
RUN pipenv sync --system

COPY . /app/
