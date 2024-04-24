import random
import uuid
from dataclasses import dataclass, asdict
from typing import Any

INIT_DB_SQL_STRING: str = r""" CREATE TABLE IF NOT EXISTS guests (
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

    def header_string(self, delimiter: str) -> str:
        return delimiter.join(str(k) for k in asdict(self).keys())

    def values_string(self, delimiter: str) -> str:
        return delimiter.join(str(v) for v in asdict(self).values())


@dataclass
class PunchPass:
    pass_id: int
    guest_id: int
    passtype: str
    remaining_uses: int
    active: bool
    payment_method: str
    amount_paid_cents: int
    creator: str
    creation_time: int

    def header_string(self, delimiter: str) -> str:
        return delimiter.join(str(k) for k in asdict(self).keys())

    def values_string(self, delimiter: str) -> str:
        return delimiter.join(str(v) for v in asdict(self).values())


def main():
    old_first_names = read_names("old_first_names.txt")
    new_first_names = read_names("new_first_names.txt")
    last_names = read_names("last_names.txt")[:200]

    first_names = old_first_names + new_first_names

    guests = generate_guests(20_000, first_names, last_names)
    passes = generate_passes(guests, first_names)

    write_csv(guests, "dummy_guests.csv")
    write_csv(passes, "dummy_passes.csv")

    # print_db_init_sql(guests, passes)


def write_csv(data: list[Guest | PunchPass], filename):
    with open(filename, "w") as file:
        for item in data:
            file.write(item.values_string(","))
            file.write("\n")


def generate_guests(
    num: int, first_names: list[str], last_names: list[str]
) -> list[Guest]:
    guests = []
    for i in range(num):
        guest_id = i + 100_000
        first_name = random.choice(first_names)
        last_name = random.choice(last_names)
        email = f"{first_name.lower()}.{last_name.lower()}@email.com"
        town = f"{random.choice(last_names[:150])}{random.choice(TOWN_SUFFIXES)}"
        notes = ""
        creator = f"{random.choice(first_names[:24])}"
        creation_time = random.randrange(1613755541, 1713755541)
        guest = Guest(
            guest_id,
            first_name,
            last_name,
            email,
            town,
            notes,
            creator,
            creation_time,
        )
        guests.append(guest)

    return guests


def generate_passes(guests: list[Guest], first_names: list[str]) -> list[PunchPass]:
    passes = []
    for i in range(len(guests) * 2):
        passholder = random.choice(guests)

        pass_id = i + 100_000
        guest_id = passholder.guest_id
        passtype = random.choice(PASSTYPES)
        remaining_uses = random.randrange(1, 11)
        active = random.randint(0, 10) > 0
        payment_method = random.choice(PAYMENT_METHODS)
        amount_paid = 350
        creator = f"{random.choice(first_names[:24])}"
        creation_time = random.randrange(1613755541, 1713755541)
        punch_pass = PunchPass(
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


def print_sql_insert(
    data: list[PunchPass | Guest],
    table: str,
):
    header = f"""INSERT INTO {table} ({data[0].sql_header_string()})
VALUES"""
    print(header)
    for p in data[:-1]:
        values = f"""({p.values_string(", ")}),"""
        print(values)
    p = data[-1]
    footer = f"""({p.values_string(", ")});"""
    print(footer)


def print_db_init_sql(guests: list[Guest], passes: list[PunchPass]):
    print(INIT_DB_SQL_STRING)
    print_sql_insert(guests, "guests")
    print()
    print_sql_insert(passes, "passes")


def read_names(filename: str) -> list[str]:
    with open(filename, "r") as file:
        return [name.strip() for name in file.readlines()]


if __name__ == "__main__":
    main()
