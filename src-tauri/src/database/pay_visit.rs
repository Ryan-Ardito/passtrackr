use serde::{Deserialize, Serialize};
use sqlx::{postgres::PgQueryResult, Postgres, Transaction};
use tauri::State;
use time::OffsetDateTime;

use crate::AppState;

#[derive(Deserialize, Serialize, Clone)]
pub struct InsertPaymentData {
    pub pass_id: i32,
    pub payment_method: Option<String>,
    pub amount_paid_cents: Option<i32>,
    pub creator: String,
}

#[derive(Deserialize, Serialize, Clone)]
pub struct PaymentRow {
    pub payment_id: i32,
    pub pass_id: i32,
    pub payment_method: Option<String>,
    pub amount_paid_cents: Option<i32>,
    pub creator: String,
    pub created_at: OffsetDateTime,
}

#[derive(Deserialize, Serialize, Clone)]
pub struct VisitRow {
    pub visit_id: i32,
    pub pass_id: i32,
    pub created_at: OffsetDateTime,
}

pub async fn get_payments_from_guest_id(
    state: &State<'_, AppState>,
    guest_id: i32,
) -> sqlx::Result<Vec<PaymentRow>> {
    sqlx::query_as!(
        PaymentRow,
        r#" SELECT payments.*
FROM payments
JOIN passes ON passes.pass_id = payments.pass_id
JOIN guests ON guests.guest_id = passes.guest_id
WHERE guests.guest_id = $1
ORDER BY payments.created_at DESC"#,
        guest_id,
    )
    .fetch_all(&state.pg_pool)
    .await
}

pub async fn get_visits_from_guest_id(
    state: &State<'_, AppState>,
    guest_id: i32,
) -> sqlx::Result<Vec<VisitRow>> {
    sqlx::query_as!(
        VisitRow,
        r#" SELECT visits.*
FROM visits
JOIN passes ON passes.pass_id = visits.pass_id
JOIN guests ON guests.guest_id = passes.guest_id
WHERE guests.guest_id = $1
ORDER BY visits.created_at DESC"#,
        guest_id,
    )
    .fetch_all(&state.pg_pool)
    .await
}

pub async fn get_payments_from_pass_id(
    state: &State<'_, AppState>,
    pass_id: i32,
) -> sqlx::Result<Vec<PaymentRow>> {
    sqlx::query_as!(
        PaymentRow,
        r#"SELECT * FROM payments WHERE pass_id = $1 ORDER BY created_at DESC"#,
        pass_id,
    )
    .fetch_all(&state.pg_pool)
    .await
}

pub async fn get_visits_from_pass_id(
    state: &State<'_, AppState>,
    pass_id: i32,
) -> sqlx::Result<Vec<VisitRow>> {
    sqlx::query_as!(
        VisitRow,
        r#"SELECT * FROM visits WHERE pass_id = $1 ORDER BY created_at DESC"#,
        pass_id,
    )
    .fetch_all(&state.pg_pool)
    .await
}

pub async fn insert_payment(
    transaction: &mut Transaction<'_, Postgres>,
    data: &InsertPaymentData,
) -> sqlx::Result<PgQueryResult> {
    sqlx::query!(
        r#"INSERT
INTO payments (pass_id, payment_method, amount_paid_cents, creator)
VALUES ($1, $2, $3, $4)"#,
        data.pass_id,
        data.payment_method,
        data.amount_paid_cents,
        &data.creator,
    )
    .execute(&mut **transaction)
    .await
}

pub async fn insert_visit(state: &State<'_, AppState>, pass_id: i32) -> sqlx::Result<()> {
    sqlx::query!(r#"INSERT INTO visits (pass_id) VALUES ($1)"#, pass_id,)
        .execute(&state.pg_pool)
        .await?;
    Ok(())
}
