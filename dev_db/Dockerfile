FROM postgres:latest

ENV POSTGRES_USER=postgres
ENV POSTGRES_PASSWORD=joyful
ENV POSTGRES_DB=passtracker-dev

COPY dummy_data.py /app/
COPY old_first_names.txt /app/
COPY new_first_names.txt /app/
COPY last_names.txt /app/

WORKDIR /app

RUN apt-get update
RUN apt-get install -y python3
RUN python3 dummy_data.py > /docker-entrypoint-initdb.d/init.sql
