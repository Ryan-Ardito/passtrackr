FROM postgres:latest

ENV POSTGRES_USER=postgres
ENV POSTGRES_PASSWORD=joyful
ENV POSTGRES_DB=passtracker-dev

COPY db_init.sql /docker-entrypoint-initdb.d/db_init.sql
