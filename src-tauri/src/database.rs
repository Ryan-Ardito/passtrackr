use serde::{Deserialize, Serialize};
use sqlx::{postgres::PgQueryResult, prelude::FromRow, Result, Row};
use tauri::State;
use time::OffsetDateTime;

use crate::{
    api::{AddVisitsFormData, PassFormData},
    queries::{
        DELETE_PASS_PERMANENT, GET_GUEST, GET_PASS, INCREASE_REMAINING_USES, INSERT_GUEST,
        INSERT_PASS, INSERT_PAYMENT, INSERT_VISIT, LOG_VISIT, SEARCH_ALL, SET_PASS_ACTIVE,
    },
    AppState,
};

#[derive(Deserialize, Serialize, Clone, FromRow)]
pub struct NewPassData {
    pub guest_id: i32,
    pub passtype: String,
    pub remaining_uses: i32,
    pub active: bool,
    pub payment_method: Option<String>,
    pub amount_paid_cents: Option<i32>,
    pub creator: String,
}

#[derive(Deserialize, Serialize, Clone)]
pub struct NewGuestData {
    first_name: String,
    last_name: String,
    town: String,
    email: String,
    notes: String,
    creator: String,
}

#[derive(Deserialize, Serialize, Clone, FromRow)]
pub struct GetPassData {
    pub pass_id: i32,
    pub guest_id: i32,
    pub passtype: String,
    pub remaining_uses: i32,
    pub active: bool,
    pub payment_method: String,
    pub amount_paid_cents: i32,
    pub creator: String,
    pub creation_time: OffsetDateTime,
}

#[derive(Deserialize, Serialize, Clone, FromRow)]
pub struct InsertPaymentData {
    pub pass_id: i32,
    pub payment_method: String,
    pub amount_paid_cents: i32,
    pub creator: String,
}

#[derive(Deserialize, Serialize, Clone, FromRow)]
pub struct GetGuestData {
    pub guest_id: i32,
    pub first_name: String,
    pub last_name: String,
    pub town: String,
    pub email: String,
    pub notes: String,
    pub creator: String,
    pub creation_time: OffsetDateTime,
}

#[derive(Deserialize, Serialize, Clone, FromRow)]
pub struct PassSearchResponse {
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

pub async fn increase_remaining_uses(
    state: &State<'_, AppState>,
    data: &AddVisitsFormData,
) -> Result<PgQueryResult> {
    sqlx::query(INCREASE_REMAINING_USES)
        .bind(&data.pass_id)
        .bind(&data.num_visits.code)
        .execute(&state.pg_pool)
        .await
}

pub async fn insert_guest(state: &State<'_, AppState>, data: &PassFormData) -> Result<i32> {
    let new_guest = sqlx::query(INSERT_GUEST)
        .bind(&data.first_name)
        .bind(&data.last_name)
        .bind(&data.town)
        .bind(&"")
        .bind(&"")
        .bind(&data.signature)
        .fetch_one(&state.pg_pool)
        .await?;

    let new_guest_id = new_guest.try_get(0);
    new_guest_id
}

pub async fn insert_visit(state: &State<'_, AppState>, pass_id: i32) -> Result<PgQueryResult> {
    sqlx::query(INSERT_VISIT)
        .bind(&pass_id)
        .execute(&state.pg_pool)
        .await
}

pub async fn insert_payment(
    state: &State<'_, AppState>,
    data: &InsertPaymentData,
) -> Result<PgQueryResult> {
    sqlx::query(INSERT_PAYMENT)
        .bind(&data.pass_id)
        .bind(&data.payment_method)
        .bind(&data.amount_paid_cents)
        .bind(&data.creator)
        .execute(&state.pg_pool)
        .await
}

pub async fn get_guest_from_id(state: &State<'_, AppState>, guest_id: i32) -> Result<GetGuestData> {
    sqlx::query_as(GET_GUEST)
        .bind(guest_id)
        .fetch_one(&state.pg_pool)
        .await
}

pub async fn get_pass_from_id(state: &State<'_, AppState>, pass_id: i32) -> Result<GetPassData> {
    sqlx::query_as(GET_PASS)
        .bind(pass_id)
        .fetch_one(&state.pg_pool)
        .await
}

pub async fn insert_pass(state: &State<'_, AppState>, data: &NewPassData) -> Result<i32> {
    let row = sqlx::query(INSERT_PASS)
        .bind(&data.guest_id)
        .bind(&data.passtype)
        .bind(&data.remaining_uses)
        .bind(&data.active)
        .bind(&data.payment_method)
        .bind(&data.amount_paid_cents)
        .bind(&data.creator)
        .fetch_one(&state.pg_pool)
        .await?;

    let new_pass_id = row.try_get(0);
    new_pass_id
}

pub async fn delete_pass_permanent(
    state: &State<'_, AppState>,
    pass_id: i32,
) -> Result<PgQueryResult> {
    sqlx::query(DELETE_PASS_PERMANENT)
        .bind(&pass_id)
        .execute(&state.pg_pool)
        .await
}

pub async fn log_visit_query(state: &State<'_, AppState>, pass_id: i32) -> Result<PgQueryResult> {
    sqlx::query(LOG_VISIT)
        .bind(&pass_id)
        .execute(&state.pg_pool)
        .await
}

pub async fn set_pass_active(
    state: &State<'_, AppState>,
    pass_id: i32,
    new_state: bool,
) -> Result<PgQueryResult> {
    sqlx::query(SET_PASS_ACTIVE)
        .bind(&pass_id)
        .bind(&new_state)
        .execute(&state.pg_pool)
        .await
}

pub async fn search_all_passes(
    state: &State<'_, AppState>,
    search_term: &str,
) -> Result<Vec<PassSearchResponse>> {
    sqlx::query_as(SEARCH_ALL)
        .bind(format!("{search_term}%"))
        .fetch_all(&state.pg_pool)
        .await
}
