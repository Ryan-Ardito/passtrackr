import json
import psycopg2
from dataclasses import dataclass

from dummy_data import Guest, Pass


# Function to read JSON file
def read_json(file_path):
    with open(file_path, "r") as f:
        data = json.load(f)
    return data


# Function to connect to PostgreSQL
def connect_to_postgres(dbname, user, password, host, port):
    try:
        conn = psycopg2.connect(
            dbname=dbname, user=user, password=password, host=host, port=port
        )
        print("Connected to PostgreSQL successfully!")
        return conn
    except psycopg2.Error as e:
        print("Unable to connect to the database:", e)


# Function to create tables in PostgreSQL
def create_tables(conn):
    try:
        cursor = conn.cursor()
        cursor.execute(
            """
            CREATE TABLE IF NOT EXISTS guests (
                guest_id SERIAL PRIMARY KEY,
                first_name VARCHAR(50),
                last_name VARCHAR(50),
                email VARCHAR(100),
                town VARCHAR(100),
                notes TEXT,
                creator VARCHAR(100),
                creation_time INT
            )
        """
        )
        cursor.execute(
            """
            CREATE TABLE IF NOT EXISTS passes (
                pass_id SERIAL PRIMARY KEY,
                guest_id INT REFERENCES guests(guest_id),
                passtype VARCHAR(50),
                remaining_uses INT,
                active BOOLEAN,
                payment_method VARCHAR(50),
                amount_paid_cents INT,
                creator VARCHAR(100),
                creation_time INT
            )
        """
        )
        conn.commit()
        print("Tables created successfully!")
    except psycopg2.Error as e:
        conn.rollback()
        print("Error creating tables:", e)


# Function to insert data into PostgreSQL
def insert_data(conn, data):
    try:
        cursor = conn.cursor()

        for guest_data in data["guests"]:
            guest = Guest(**guest_data)
            cursor.execute(
                """
                INSERT INTO guests 
                (guest_id, first_name, last_name, email, town, notes, creator, creation_time) 
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s)""",
                (
                    guest.guest_id,
                    guest.first_name,
                    guest.last_name,
                    guest.email,
                    guest.town,
                    guest.notes,
                    guest.creator,
                    guest.creation_time,
                ),
            )

        for pass_data in data["passes"]:
            pass_entry = Pass(**pass_data)
            cursor.execute(
                """
                INSERT INTO passes 
                (pass_id, guest_id, passtype, remaining_uses, active, payment_method, amount_paid_cents, creator, creation_time) 
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)""",
                (
                    pass_entry.pass_id,
                    pass_entry.guest_id,
                    pass_entry.passtype,
                    pass_entry.remaining_uses,
                    pass_entry.active,
                    pass_entry.payment_method,
                    pass_entry.amount_paid_cents,
                    pass_entry.creator,
                    pass_entry.creation_time,
                ),
            )

        conn.commit()
        print("Data inserted successfully!")
    except psycopg2.Error as e:
        conn.rollback()
        print("Error inserting data:", e)


# Main function
def main():
    # Database connection parameters
    dbname = "passtracker"
    user = "postgres"
    password = "joyful"
    host = "172.17.0.2"
    port = "5432"

    # Read data from JSON file
    guests = read_json("guests.json")
    passes = read_json("passes.json")
    data = {"guests": guests, "passes": passes}

    # Connect to PostgreSQL
    conn = connect_to_postgres(dbname, user, password, host, port)

    # Create tables in PostgreSQL
    if conn:
        create_tables(conn)

        # Insert data into PostgreSQL
        insert_data(conn, data)

        conn.close()


if __name__ == "__main__":
    main()
