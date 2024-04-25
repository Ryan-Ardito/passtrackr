CREATE TABLE IF NOT EXISTS guests (
    guest_id SERIAL PRIMARY KEY,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    email VARCHAR(100),
    town VARCHAR(100),
    notes TEXT,
    creator VARCHAR(100),
    creation_time TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS passes (
    pass_id SERIAL PRIMARY KEY,
    guest_id INT REFERENCES guests(guest_id),
    passtype VARCHAR(50),
    remaining_uses INT CHECK (remaining_uses >= 0),
    active BOOLEAN,
    payment_method VARCHAR(50),
    amount_paid_cents INT,
    creator VARCHAR(100),
    creation_time TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX passes_guest_id_index ON passes (guest_id);
CREATE INDEX guests_guest_id_index ON guests (guest_id);


COPY guests (guest_id, first_name, last_name, email, town, notes, creator)
FROM '/app/dummy_guests.csv' DELIMITER ',' CSV;

COPY passes (guest_id, passtype, remaining_uses, active, payment_method, amount_paid_cents, creator)
FROM '/app/dummy_passes.csv' DELIMITER ',' CSV;