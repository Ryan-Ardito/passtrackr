FROM postgres:latest

ENV POSTGRES_USER=postgres
ENV POSTGRES_PASSWORD=joyful
ENV POSTGRES_DB=passtracker-dev

COPY init_db.sql /docker-entrypoint-initdb.d/

WORKDIR /app

EXPOSE 5432
