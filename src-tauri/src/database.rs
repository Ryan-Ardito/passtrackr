use serde::{Deserialize, Serialize};
use sqlx::{prelude::FromRow, Result, Row};
use tauri::State;
use time::OffsetDateTime;

use crate::{
    api::{AddVisitsFormData, PassFormData},
    queries::{
        DELETE_PASS_PERMANENT, INCREASE_REMAINING_USES, INSERT_GUEST, INSERT_PASS, LOG_VISIT,
        SEARCH_ALL, SET_PASS_ACTIVE,
    },
    AppState,
};

#[derive(Deserialize, Serialize, Clone, FromRow)]
pub struct NewPassData {
    guest_id: i32,
    passtype: String,
    remaining_uses: i32,
    active: bool,
    payment_method: String,
    amount_paid_cents: i32,
    creator: String,
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

pub async fn insert_new_pass(
    state: &State<'_, AppState>,
    pass_data: PassFormData,
) -> Result<i32> {
    let guest_id = pass_data
        .guest_id
        .unwrap_or(insert_guest(&state, &pass_data).await? as u64);
    let data = NewPassData {
        guest_id: guest_id as i32,
        passtype: pass_data.passtype.code,
        remaining_uses: 10,
        active: true,
        payment_method: pass_data.pay_method.code,
        amount_paid_cents: 350,
        creator: pass_data.signature,
    };

    insert_pass(&state, &data).await
}

pub async fn increase_remaining_uses(
    state: &State<'_, AppState>,
    data: &AddVisitsFormData,
) -> Result<()> {
    let pool = state.pg_pool.as_ref();
    sqlx::query(INCREASE_REMAINING_USES)
        .bind(&data.pass_id)
        .bind(&data.num_visits.code)
        .execute(pool)
        .await?;

    Ok(())
}

pub async fn insert_guest(
    state: &State<'_, AppState>,
    data: &PassFormData,
) -> Result<i32> {
    let pool = state.pg_pool.as_ref();
    let result = sqlx::query(INSERT_GUEST)
        .bind(&data.first_name)
        .bind(&data.last_name)
        .bind(&data.town)
        .bind(&"")
        .bind(&"")
        .bind(&data.signature)
        .fetch_one(pool)
        .await?;

    result.try_get(0)
}

pub async fn insert_pass(
    state: &State<'_, AppState>,
    data: &NewPassData,
) -> Result<i32> {
    let pool = state.pg_pool.as_ref();
    let result = sqlx::query(INSERT_PASS)
        .bind(&data.guest_id)
        .bind(&data.passtype)
        .bind(&data.remaining_uses)
        .bind(&data.active)
        .bind(&data.payment_method)
        .bind(&data.amount_paid_cents)
        .bind(&data.creator)
        .fetch_one(pool)
        .await?;

    result.try_get(0)
}

pub async fn delete_pass_permanent(
    state: &State<'_, AppState>,
    pass_id: i32,
) -> Result<()> {
    let pool = state.pg_pool.as_ref();
    sqlx::query(DELETE_PASS_PERMANENT)
        .bind(&pass_id)
        .execute(pool)
        .await?;
    Ok(())
}

pub async fn log_visit_query(state: &State<'_, AppState>, pass_id: i32) -> Result<()> {
    let pool = state.pg_pool.as_ref();
    sqlx::query(LOG_VISIT).bind(&pass_id).execute(pool).await?;
    Ok(())
}

pub async fn set_pass_active(
    state: &State<'_, AppState>,
    pass_id: i32,
    new_state: bool,
) -> Result<()> {
    let pool = state.pg_pool.as_ref();
    sqlx::query(SET_PASS_ACTIVE)
        .bind(&pass_id)
        .bind(&new_state)
        .execute(pool)
        .await?;
    Ok(())
}

pub async fn search_all_passes(
    state: &State<'_, AppState>,
    search_term: &str,
) -> Result<Vec<PassSearchResponse>> {
    let pool = state.pg_pool.as_ref();
    let passes = sqlx::query_as(SEARCH_ALL)
        .bind(format!("{search_term}%"))
        .fetch_all(pool)
        .await;

    passes
}
