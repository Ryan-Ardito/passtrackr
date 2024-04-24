FROM python:3.9

WORKDIR /app

COPY dummy_data.py /app/
COPY old_first_names.txt /app/
COPY new_first_names.txt /app/
COPY last_names.txt /app/

CMD ["python", "dummy_data.py"]