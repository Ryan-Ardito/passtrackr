import os
import random
import time
import datetime
from dataclasses import dataclass, asdict


NUM_GUESTS = 100_000
NUM_PASSES = 250_000


PAYMENT_METHODS: list[str] = [
    "Credit",
    "Cash",
    "Check",
    "Comp",
]

PASSTYPES: list[str] = [
    "Punch",
    "Annual",
    "6 Month",
    "Facial",
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


NOTES = '''"Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book."'''


@dataclass
class Guest:
    guest_id: int
    first_name: str
    last_name: str
    email: str
    town: str
    notes: str
    creator: str

    def values_string(self, delimiter: str) -> str:
        return delimiter.join(str(v) for v in asdict(self).values())


@dataclass
class PunchPass:
    guest_id: int
    passtype: str
    remaining_uses: int
    active: bool
    payment_method: str
    amount_paid_cents: int
    notes: str
    expires_at: int
    creator: str

    def values_string(self, delimiter: str) -> str:
        return delimiter.join(str(v) for v in asdict(self).values())


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
        notes = NOTES
        creator = f"{random.choice(first_names[:24])}"
        guest = Guest(
            guest_id,
            first_name,
            last_name,
            email,
            town,
            notes,
            creator,
        )
        guests.append(guest)

    return guests


def generate_passes(guests: list[Guest], first_names: list[str]) -> list[PunchPass]:
    passes = []
    for i in range(NUM_PASSES):
        passholder = random.choice(guests)

        guest_id = passholder.guest_id
        passtype = random.choice(PASSTYPES)

        remaining_uses = ""
        if passtype == "Punch":
            remaining_uses = random.choice((6, 10))
        if passtype == "Facial":
            remaining_uses = random.choice((3, 6))

        active = True
        payment_method = random.choice(PAYMENT_METHODS)
        amount_paid = 7000
        notes = NOTES

        expires_at = ""
        if passtype in ("Annual", "6 Month"):
            current_datetime = datetime.datetime.now().astimezone()
            random_days = random.randint(-30, 120)
            expires_at = (
                (current_datetime + datetime.timedelta(days=random_days))
                .replace(microsecond=0)
                .isoformat()
            )

        creator = f"{random.choice(first_names[:24])}"
        punch_pass = PunchPass(
            guest_id,
            passtype,
            remaining_uses,
            active,
            payment_method,
            amount_paid,
            notes,
            expires_at,
            creator,
        )
        passes.append(punch_pass)

    return passes


def read_names(filename: str) -> list[str]:
    with open(filename, "r") as file:
        return [name.strip() for name in file.readlines()]


def main():
    workdir = os.path.dirname(os.path.abspath(__file__))

    guests_file = os.path.join(workdir, "dummy_guests.csv")
    passes_file = os.path.join(workdir, "dummy_passes.csv")
    if os.path.exists(guests_file) and os.path.exists(passes_file):
        return

    first_names_one = os.path.join(workdir, "old_first_names.txt")
    first_names_two = os.path.join(workdir, "new_first_names.txt")
    last_names_file = os.path.join(workdir, "last_names.txt")
    old_first_names = read_names(first_names_one)
    new_first_names = read_names(first_names_two)
    last_names = read_names(last_names_file)[:200]

    first_names = old_first_names + new_first_names

    guests = generate_guests(NUM_GUESTS, first_names, last_names)
    write_csv(guests, guests_file)

    passes = generate_passes(guests, first_names)
    write_csv(passes, passes_file)


if __name__ == "__main__":
    main()
