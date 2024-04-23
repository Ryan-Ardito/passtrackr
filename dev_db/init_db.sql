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