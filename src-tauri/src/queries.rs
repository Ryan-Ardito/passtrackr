pub const GET_GUEST: &str = r#"SELECT * FROM guests WHERE guest_id = $1"#;

pub const GET_PASS: &str = r#"SELECT * FROM passes WHERE pass_id = $1"#;

pub const GET_PAYMENTS_FROM_GUEST_ID: &str = r#" SELECT payments.*
FROM payments
JOIN passes ON passes.pass_id = payments.pass_id
JOIN guests ON guests.guest_id = passes.guest_id
WHERE guests.guest_id = $1;"#;

pub const GET_VISITS_FROM_GUEST_ID: &str = r#" SELECT visits.*
FROM visits
JOIN passes ON passes.pass_id = visits.pass_id
JOIN guests ON guests.guest_id = passes.guest_id
WHERE guests.guest_id = $1;"#;

pub const GET_PAYMENTS_FROM_PASS_ID: &str = r#"SELECT * FROM payments WHERE pass_id = $1"#;

pub const GET_VISITS_FROM_PASS_ID: &str = r#"SELECT * FROM visits WHERE pass_id = $1"#;

pub const EDIT_GUEST: &str = r#"UPDATE guests
SET first_name = $1,
    last_name = $2,
    town = $3,
    email = $4,
    notes = $5
WHERE guest_id = $6"#;

pub const INSERT_GUEST: &str = r#"INSERT
INTO guests (first_name, last_name, town, email, notes, creator)
VALUES ($1, $2, $3, $4, $5, $6)
RETURNING guest_id"#;

pub const INSERT_PASS: &str = r#"INSERT
INTO passes (guest_id, passtype, remaining_uses, active, payment_method, amount_paid_cents, creator)
VALUES ($1, $2, $3, $4, $5, $6, $7)
RETURNING pass_id"#;

pub const INSERT_PAYMENT: &str = r#"INSERT
INTO payments (pass_id, payment_method, amount_paid_cents, creator)
VALUES ($1, $2, $3, $4)"#;

pub const INSERT_VISIT: &str = r#"INSERT INTO visits (pass_id) VALUES ($1)"#;

pub const LOG_VISIT: &str = r#"UPDATE passes
SET remaining_uses = CASE
    WHEN remaining_uses > 0 THEN remaining_uses - 1
    ELSE 0
END
WHERE pass_id = $1
RETURNING remaining_uses;"#;

pub const SET_PASS_ACTIVE: &str = r#"UPDATE passes
SET active = $2
WHERE pass_id = $1;"#;

pub const DELETE_PAYMENTS_PASS_ID: &str = r#"DELETE FROM payments WHERE pass_id = $1;"#;

pub const DELETE_VISITS_PASS_ID: &str = r#"DELETE FROM visits WHERE pass_id = $1;"#;

pub const DELETE_PASS_PERMANENT: &str = r#"DELETE FROM passes WHERE pass_id = $1;"#;

pub const INCREASE_REMAINING_USES: &str = r#"UPDATE passes
SET remaining_uses = remaining_uses + $2
WHERE pass_id = $1
RETURNING remaining_uses;"#;

pub const SEARCH_ALL: &str = r#"SELECT 
    p.pass_id,
    p.guest_id,
    g.first_name,
    g.last_name,
    g.town,
    p.remaining_uses,
    p.passtype,
    p.active,
    p.creator,
    p.creation_time
FROM 
    passes AS p
JOIN 
    guests AS g ON p.guest_id = g.guest_id
WHERE 
    first_name || ' ' || last_name ILIKE $1
    OR
    g.last_name ILIKE $1
ORDER BY 
    g.last_name, g.first_name, g.guest_id, p.pass_id;"#;
