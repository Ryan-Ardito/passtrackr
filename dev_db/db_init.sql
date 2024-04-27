CREATE TABLE IF NOT EXISTS guests (
    guest_id SERIAL NOT NULL PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100),
    town VARCHAR(100),
    notes TEXT,
    creator VARCHAR(100),
    creation_time TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS passes (
    pass_id SERIAL NOT NULL PRIMARY KEY,
    guest_id INT NOT NULL REFERENCES guests(guest_id),
    passtype VARCHAR(50) NOT NULL,
    remaining_uses INT NOT NULL CHECK (remaining_uses >= 0),
    active BOOLEAN,
    payment_method VARCHAR(50),
    amount_paid_cents INT,
    creator VARCHAR(100),
    creation_time TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS payments (
    payment_id SERIAL NOT NULL PRIMARY KEY,
    guest_id INT NOT NULL REFERENCES guests(guest_id),
    pass_id INT REFERENCES passes(pass_id),
    payment_method VARCHAR(50),
    amount_paid_cents INT,
    creator VARCHAR(100),
    creation_time TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS visits (
    visit_id SERIAL NOT NULL PRIMARY KEY,
    guest_id INT NOT NULL REFERENCES guests(guest_id),
    pass_id INT REFERENCES passes(pass_id),
    creation_time TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

COPY guests (guest_id, first_name, last_name, email, town, notes, creator)
FROM '/app/dummy_guests.csv' DELIMITER ',' CSV;

COPY passes (guest_id, passtype, remaining_uses, active, payment_method, amount_paid_cents, creator)
FROM '/app/dummy_passes.csv' DELIMITER ',' CSV;