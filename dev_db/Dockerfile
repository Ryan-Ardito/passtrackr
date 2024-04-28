FROM postgres:latest

ENV POSTGRES_USER=postgres
ENV POSTGRES_PASSWORD=joyful
ENV POSTGRES_DB=passtracker-dev

COPY dev_db_init.sql /docker-entrypoint-initdb.d/dev_db_init.sql
