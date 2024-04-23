import json
import random
import uuid
from dataclasses import dataclass, asdict
from typing import Any

payment_methods: list[str] = [
    "credit",
    "cash",
    "check",
    "comp",
]

passtypes: list[str] = [
    "punch",
    "annual",
    "six_month",
    "free_pass",
    "facial",
]

town_suffixes = [
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
        town = f"{random.choice(last_names[:150])}{random.choice(town_suffixes)}"
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
        passtype = random.choice(passtypes)
        remaining_uses = random.randrange(1, 11)
        active = random.randint(0, 10) > 0
        payment_method = random.choice(payment_methods)
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


def save_json(filename: str, data: list[dict[Any, Any]]):
    with open(filename, "w") as file:
        json.dump(data, file, indent=4)


def main():
    with open("old_first_names.txt", "r") as file:
        old_first_names = [name.strip() for name in file.readlines()]

    with open("new_first_names.txt", "r") as file:
        new_first_names = [name.strip() for name in file.readlines()][:100]

    with open("last_names.txt", "r") as file:
        last_names = [name.strip() for name in file.readlines()]

    first_names = old_first_names + new_first_names

    guests = generate_guests(10_000, first_names, last_names)
    passes = generate_passes(guests, first_names, last_names)

    save_json("guests.json", [asdict(d) for d in guests])
    save_json("passes.json", [asdict(d) for d in passes])


if __name__ == "__main__":
    main()
