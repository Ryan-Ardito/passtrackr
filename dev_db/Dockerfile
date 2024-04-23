FROM postgres:latest

ENV POSTGRES_USER=postgres
ENV POSTGRES_PASSWORD=joyful
ENV POSTGRES_DB=passtracker-dev

COPY fill_postgres.py /app/
COPY guests.json /app/
COPY passes.json /app/
COPY requirements.txt /app/

WORKDIR /app

RUN apt-get update && \
    apt-get install -y python3 python3-pip && \
    pip3 install --no-cache-dir -r requirements.txt

EXPOSE 5432

CMD ["python3", "fill_postgres.py"]
