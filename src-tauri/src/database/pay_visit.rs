use serde::{Deserialize, Serialize};
use sqlx::{postgres::PgQueryResult, prelude::*, Postgres, Transaction};
use tauri::State;
use time::OffsetDateTime;

use super::queries::{
    GET_PAYMENTS_FROM_GUEST_ID, GET_PAYMENTS_FROM_PASS_ID, GET_VISITS_FROM_GUEST_ID,
    GET_VISITS_FROM_PASS_ID, INSERT_PAYMENT, INSERT_VISIT,
};
use crate::AppState;

#[derive(Deserialize, Serialize, Clone, FromRow)]
pub struct InsertPaymentData {
    pub pass_id: i32,
    pub payment_method: Option<String>,
    pub amount_paid_cents: Option<i32>,
    pub creator: String,
}

#[derive(Deserialize, Serialize, Clone, FromRow)]
pub struct PaymentRow {
    pub payment_id: i32,
    pub pass_id: i32,
    pub payment_method: Option<String>,
    pub amount_paid_cents: Option<i32>,
    pub creator: String,
    pub created_at: OffsetDateTime,
}

#[derive(Deserialize, Serialize, Clone, FromRow)]
pub struct VisitRow {
    pub visit_id: i32,
    pub pass_id: i32,
    pub created_at: OffsetDateTime,
}

pub async fn get_payments_from_guest_id(
    state: &State<'_, AppState>,
    guest_id: i32,
) -> sqlx::Result<Vec<PaymentRow>> {
    sqlx::query_as(GET_PAYMENTS_FROM_GUEST_ID)
        .bind(&guest_id)
        .fetch_all(&state.pg_pool)
        .await
}

pub async fn get_visits_from_guest_id(
    state: &State<'_, AppState>,
    guest_id: i32,
) -> sqlx::Result<Vec<VisitRow>> {
    sqlx::query_as(GET_VISITS_FROM_GUEST_ID)
        .bind(&guest_id)
        .fetch_all(&state.pg_pool)
        .await
}

pub async fn get_payments_from_pass_id(
    state: &State<'_, AppState>,
    pass_id: i32,
) -> sqlx::Result<Vec<PaymentRow>> {
    sqlx::query_as(GET_PAYMENTS_FROM_PASS_ID)
        .bind(&pass_id)
        .fetch_all(&state.pg_pool)
        .await
}

pub async fn get_visits_from_pass_id(
    state: &State<'_, AppState>,
    pass_id: i32,
) -> sqlx::Result<Vec<VisitRow>> {
    sqlx::query_as(GET_VISITS_FROM_PASS_ID)
        .bind(&pass_id)
        .fetch_all(&state.pg_pool)
        .await
}

pub async fn insert_payment(
    transaction: &mut Transaction<'_, Postgres>,
    data: &InsertPaymentData,
) -> sqlx::Result<PgQueryResult> {
    sqlx::query(INSERT_PAYMENT)
        .bind(&data.pass_id)
        .bind(&data.payment_method)
        .bind(&data.amount_paid_cents)
        .bind(&data.creator)
        .execute(&mut **transaction)
        .await
}

pub async fn insert_visit(state: &State<'_, AppState>, pass_id: i32) -> sqlx::Result<()> {
    sqlx::query(INSERT_VISIT)
        .bind(&pass_id)
        .execute(&state.pg_pool)
        .await?;
    Ok(())
}
