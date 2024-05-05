CREATE EXTENSION pg_trgm;

CREATE TABLE IF NOT EXISTS guests (
    guest_id INT GENERATED BY DEFAULT AS IDENTITY UNIQUE,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(50),
    town VARCHAR(50),
    notes TEXT,
    creator VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS index_first_last ON guests using gin ((first_name || ' ' || last_name) gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_last_name ON guests USING gin (last_name gin_trgm_ops);

CREATE TABLE IF NOT EXISTS passes (
    pass_id INT GENERATED BY DEFAULT AS IDENTITY UNIQUE,
    guest_id INT NOT NULL REFERENCES guests(guest_id),
    passtype VARCHAR(50) NOT NULL,
    remaining_uses INT NULL CHECK (remaining_uses IS NULL OR remaining_uses >= 0),
    active BOOLEAN,
    payment_method VARCHAR(50),
    amount_paid_cents INT,
    notes TEXT,
    creator VARCHAR(50),
    expires_at TIMESTAMP WITH TIME ZONE DEFAULT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS payments (
    payment_id INT GENERATED BY DEFAULT AS IDENTITY UNIQUE,
    pass_id INT REFERENCES passes(pass_id),
    payment_method VARCHAR(50),
    amount_paid_cents INT,
    creator VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS visits (
    visit_id INT GENERATED BY DEFAULT AS IDENTITY UNIQUE,
    pass_id INT REFERENCES passes(pass_id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

COPY guests (guest_id, first_name, last_name, email, town, notes, creator)
FROM '/app/dummy_guests.csv' DELIMITER ',' CSV;

COPY passes (guest_id, passtype, remaining_uses, active, payment_method, amount_paid_cents, notes, expires_at, creator)
FROM '/app/dummy_passes.csv' DELIMITER ',' CSV;