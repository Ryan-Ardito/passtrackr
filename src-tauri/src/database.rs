use serde::{Deserialize, Serialize};
use sqlx::{prelude::FromRow, PgPool, Result, Row};
use time::OffsetDateTime;

#[derive(Deserialize, Serialize, Clone, FromRow)]
pub struct Pass {
    pass_id: Option<i32>,
    guest_id: i32,
    passtype: String,
    remaining_uses: i32,
    active: bool,
    payment_method: String,
    amount_paid_cents: i32,
    creator: String,
}

#[derive(Serialize, Deserialize, Clone)]
pub struct NewPassData {
    guest_id: Option<u64>,
    first_name: String,
    last_name: String,
    town: String,
    passtype: PassType,
    pay_method: PayMethod,
    last_four: Option<String>,
    amount_paid: Option<String>,
    signature: String,
}

#[derive(Deserialize, Serialize, Clone, FromRow)]
pub struct SearchPassData {
    pub pass_id: u64,
    pub guest_id: u64,
    pub first_name: String,
    pub last_name: String,
    pub town: String,
    pub remaining_uses: u64,
    pub passtype: PassType,
    pub active: bool,
    pub creator: String,
    pub creation_time: u64,
}

#[derive(Deserialize, Serialize, Clone, FromRow)]
pub struct SearchPassRes {
    pub pass_id: i32,
    pub guest_id: i32,
    pub first_name: String,
    pub last_name: String,
    pub town: String,
    pub remaining_uses: i32,
    pub passtype: String,
    pub active: bool,
    pub creator: String,
    pub creation_time: OffsetDateTime,
}

#[derive(Deserialize, Serialize, Debug, Clone)]
pub struct PassType {
    pub name: String,
    pub code: String,
}

#[derive(Deserialize, Serialize, Debug, Clone)]
pub struct PayMethod {
    pub name: String,
    pub code: String,
}

#[derive(Deserialize, Serialize, Clone)]
pub struct GuestData {
    guest_id: i32,
    first_name: String,
    last_name: String,
    town: String,
    email: String,
    notes: String,
    creator: String,
    creation_time: i32,
}

#[derive(Debug, Serialize, Clone)]
pub struct QueryError {
    pub name: String,
    pub message: String,
}

pub async fn insert_new_pass(pool: &PgPool, pass_data: NewPassData) -> Result<i32> {
    let guest_id = pass_data
        .guest_id
        .unwrap_or(insert_guest(pool, &pass_data).await.unwrap() as u64);
    let data = Pass {
        pass_id: None,
        guest_id: guest_id as i32,
        passtype: pass_data.passtype.code,
        remaining_uses: 10,
        active: true,
        payment_method: pass_data.pay_method.code,
        amount_paid_cents: 350,
        creator: pass_data.signature,
    };

    Ok(insert_pass(pool, &data).await.unwrap())
}

pub async fn insert_guest(pool: &PgPool, data: &NewPassData) -> Result<i32> {
    let query = r#"
        INSERT INTO guests (first_name, last_name, town, email, notes, creator)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING guest_id
    "#;

    let result = sqlx::query(query)
        .bind(&data.first_name)
        .bind(&data.last_name)
        .bind(&data.town)
        .bind(&"")
        .bind(&"")
        .bind(&data.signature)
        .fetch_one(pool)
        .await?;

    Ok(result.get(0))
}

pub async fn insert_pass(pool: &PgPool, data: &Pass) -> Result<i32> {
    let query = r#"
        INSERT INTO passes (guest_id, passtype, remaining_uses, active, payment_method, amount_paid_cents, creator)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING pass_id
    "#;

    let result = sqlx::query(query)
        .bind(&data.guest_id)
        .bind(&data.passtype)
        .bind(&data.remaining_uses)
        .bind(&data.active)
        .bind(&data.payment_method)
        .bind(&data.amount_paid_cents)
        .bind(&data.creator)
        .fetch_one(pool)
        .await?;

    Ok(result.get(0))
}

pub async fn log_visit_query(pool: &PgPool, pass_id: i32) -> Result<()> {
    let use_pass_query = format!(
        "
        UPDATE passes
        SET remaining_uses = CASE
                WHEN remaining_uses > 0 THEN remaining_uses - 1
                ELSE 0
            END
        WHERE pass_id = {pass_id};

        "
    );
    sqlx::query(&use_pass_query).execute(pool).await?;
    Ok(())
}

pub async fn search_all_passes(pool: &PgPool, search_term: &str) -> Result<Vec<SearchPassRes>> {
    let search_query = "
        SELECT 
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
            LOWER(CONCAT(g.first_name, ' ', g.last_name)) LIKE LOWER($1)
            OR
            LOWER(g.last_name) LIKE LOWER($1)
        ORDER BY 
            g.last_name, g.first_name, g.guest_id, p.pass_id;
    ";

    let passes = sqlx::query_as(search_query)
        .bind(format!("{search_term}%"))
        .fetch_all(pool)
        .await?;

    Ok(passes)
}
