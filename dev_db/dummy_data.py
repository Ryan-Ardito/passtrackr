import random
import uuid
from dataclasses import dataclass
from typing import Any

INIT_DB_SQL_STRING: str = r"""
CREATE TABLE IF NOT EXISTS guests (
    guest_id SERIAL PRIMARY KEY,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    email VARCHAR(100),
    town VARCHAR(100),
    notes TEXT,
    creator VARCHAR(100),
    creation_time INT
);

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
);
"""

PAYMENT_METHODS: list[str] = [
    "credit",
    "cash",
    "check",
    "comp",
]

PASSTYPES: list[str] = [
    "punch",
    "annual",
    "six_month",
    "free_pass",
    "facial",
]

TOWN_SUFFIXES = [
    "town",
    "ville",
    "boro",
    "field",
    "dale",
    "burg",
    " City",
    " Springs",
    " Hill",
    " Ridge",
    " Creek",
    " Acres",
]


@dataclass
class Guest:
    guest_id: int
    first_name: str
    last_name: str
    email: str
    town: str
    notes: str
    creator: str
    creation_time: int


@dataclass
class Pass:
    pass_id: int
    guest_id: int
    passtype: str
    remaining_uses: int
    active: bool
    payment_method: str
    amount_paid_cents: int
    creator: str
    creation_time: int


def generate_guests(
    num: int, first_names: list[str], last_names: list[str]
) -> list[Guest]:
    guests = []
    for i in range(10_000):
        first_name = random.choice(first_names)
        last_name = random.choice(last_names)
        email = f"{first_name.lower()}.{last_name.lower()}@email.com"
        town = f"{random.choice(last_names[:150])}{random.choice(TOWN_SUFFIXES)}"
        notes = ""
        creator = f"{random.choice(first_names[:24])}"
        creation_time = random.randrange(1613755541, 1713755541)
        guest = Guest(
            i, first_name, last_name, email, town, notes, creator, creation_time
        )
        guests.append(guest)

    return guests


def generate_passes(
    guests: list[Guest], first_names: list[str], last_names: list[str]
) -> list[Pass]:
    passes = []
    for i in range(len(guests) * 2):
        passholder = random.choice(guests)

        pass_id = i
        guest_id = passholder.guest_id
        passtype = random.choice(PASSTYPES)
        remaining_uses = random.randrange(1, 11)
        active = random.randint(0, 10) > 0
        payment_method = random.choice(PAYMENT_METHODS)
        amount_paid = 350
        creator = f"{random.choice(first_names[:24])}"
        creation_time = random.randrange(1613755541, 1713755541)
        punch_pass = Pass(
            pass_id,
            guest_id,
            passtype,
            remaining_uses,
            active,
            payment_method,
            amount_paid,
            creator,
            creation_time,
        )
        passes.append(punch_pass)

    return passes


def output_sql_insert_guest(guests: list[Guest]):
    header = """INSERT INTO guests (guest_id, first_name, last_name, email, town, notes, creator, creation_time)
VALUES"""
    print(header)
    for guest in guests[:-1]:
        values = f"""({guest.guest_id}, '{guest.first_name}', '{guest.last_name}', '{guest.email}', '{guest.town}', '{guest.notes}', '{guest.creator}', {guest.creation_time}),"""
        print(values)
    guest = guests[-1]
    footer = f"""({guest.guest_id}, '{guest.first_name}', '{guest.last_name}', '{guest.email}', '{guest.town}', '{guest.notes}', '{guest.creator}', {guest.creation_time});"""
    print(footer)


def output_sql_insert_pass(passes: list[Pass]):
    header = """INSERT INTO passes (pass_id, guest_id, passtype, remaining_uses, active, payment_method, amount_paid_cents, creator, creation_time)
VALUES""" 
    print(header)
    for p in passes[:-1]:
        values = f"""({p.pass_id}, {p.guest_id}, '{p.passtype}', {p.remaining_uses}, {p.active}, '{p.payment_method}', {p.amount_paid_cents}, '{p.creator}', {p.creation_time}),"""
        print(values)
    p = passes[-1]
    footer = f"""({p.pass_id}, {p.guest_id}, '{p.passtype}', {p.remaining_uses}, {p.active}, '{p.payment_method}', {p.amount_paid_cents}, '{p.creator}', {p.creation_time});"""
    print(footer)


def main():
    with open("old_first_names.txt", "r") as file:
        old_first_names = [name.strip() for name in file.readlines()]

    with open("new_first_names.txt", "r") as file:
        new_first_names = [name.strip() for name in file.readlines()][:250]

    with open("last_names.txt", "r") as file:
        last_names = [name.strip() for name in file.readlines()]

    first_names = old_first_names + new_first_names

    guests = generate_guests(10_000, first_names, last_names)
    passes = generate_passes(guests, first_names, last_names)

    print(INIT_DB_SQL_STRING)
    output_sql_insert_guest(guests)
    print()
    output_sql_insert_pass(passes)


if __name__ == "__main__":
    main()
