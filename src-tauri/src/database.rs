use serde::{Deserialize, Serialize};
use sqlx::{postgres::PgQueryResult, prelude::FromRow, Postgres, Result, Row, Transaction};
use tauri::State;
use time::OffsetDateTime;

use crate::{
    api::{AddTimeFormData, AddVisitsFormData, PassFormData},
    queries::{
        DELETE_PASS_PERMANENT, DELETE_PAYMENTS_PASS_ID, DELETE_VISITS_PASS_ID, EDIT_GUEST,
        GET_GUEST, GET_PASS, GET_PAYMENTS_FROM_GUEST_ID, GET_PAYMENTS_FROM_PASS_ID,
        GET_VISITS_FROM_GUEST_ID, GET_VISITS_FROM_PASS_ID, INCREASE_EXPIRATION_TIME,
        INCREASE_REMAINING_USES, INSERT_GUEST, INSERT_PASS, INSERT_PAYMENT, INSERT_VISIT,
        LOG_VISIT, SEARCH_ALL, SET_PASS_ACTIVE, SET_PASS_OWNER,
    },
    AppState,
};

#[derive(Deserialize, Serialize, Clone, FromRow)]
pub struct NewPassData {
    pub guest_id: i32,
    pub passtype: String,
    pub remaining_uses: Option<i32>,
    pub active: bool,
    pub payment_method: Option<String>,
    pub amount_paid_cents: Option<i32>,
    pub expires_at: Option<OffsetDateTime>,
    pub creator: String,
}

#[derive(Deserialize, Serialize, Clone, FromRow)]
pub struct GetPassData {
    pub pass_id: i32,
    pub guest_id: i32,
    pub passtype: String,
    pub remaining_uses: Option<i32>,
    pub active: bool,
    pub payment_method: Option<String>,
    pub amount_paid_cents: Option<i32>,
    pub creator: String,
    pub expires_at: Option<OffsetDateTime>,
    pub created_at: OffsetDateTime,
}

#[derive(Deserialize, Serialize, Clone, FromRow)]
pub struct InsertPaymentData {
    pub pass_id: i32,
    pub payment_method: Option<String>,
    pub amount_paid_cents: Option<i32>,
    pub creator: String,
}

#[derive(Deserialize, Serialize, Clone, FromRow)]
pub struct GetGuestData {
    pub guest_id: i32,
    pub first_name: String,
    pub last_name: String,
    pub town: String,
    pub email: Option<String>,
    pub notes: Option<String>,
    pub creator: String,
    pub created_at: OffsetDateTime,
}

#[derive(Deserialize, Serialize, Clone, FromRow)]
pub struct PassSearchResponse {
    pub pass_id: i32,
    pub guest_id: i32,
    pub first_name: String,
    pub last_name: String,
    pub town: String,
    pub remaining_uses: Option<i32>,
    pub passtype: String,
    pub active: bool,
    pub creator: String,
    pub expires_at: Option<OffsetDateTime>,
    pub created_at: OffsetDateTime,
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

#[derive(Deserialize, Serialize, Clone, FromRow)]
pub struct EditGuestData {
    pub guest_id: i32,
    pub first_name: String,
    pub last_name: String,
    pub town: String,
    pub email: Option<String>,
    pub notes: Option<String>,
}

pub async fn update_guest(
    state: &State<'_, AppState>,
    data: EditGuestData,
) -> Result<PgQueryResult> {
    sqlx::query(EDIT_GUEST)
        .bind(&data.first_name)
        .bind(&data.last_name)
        .bind(&data.town)
        .bind(&data.email)
        .bind(&data.notes)
        .bind(&data.guest_id)
        .execute(&state.pg_pool)
        .await
}

pub async fn get_payments_from_guest_id(
    state: &State<'_, AppState>,
    guest_id: i32,
) -> Result<Vec<PaymentRow>> {
    sqlx::query_as(GET_PAYMENTS_FROM_GUEST_ID)
        .bind(&guest_id)
        .fetch_all(&state.pg_pool)
        .await
}

pub async fn get_visits_from_guest_id(
    state: &State<'_, AppState>,
    guest_id: i32,
) -> Result<Vec<VisitRow>> {
    sqlx::query_as(GET_VISITS_FROM_GUEST_ID)
        .bind(&guest_id)
        .fetch_all(&state.pg_pool)
        .await
}

pub async fn get_payments_from_pass_id(
    state: &State<'_, AppState>,
    pass_id: i32,
) -> Result<Vec<PaymentRow>> {
    sqlx::query_as(GET_PAYMENTS_FROM_PASS_ID)
        .bind(&pass_id)
        .fetch_all(&state.pg_pool)
        .await
}

pub async fn get_visits_from_pass_id(
    state: &State<'_, AppState>,
    pass_id: i32,
) -> Result<Vec<VisitRow>> {
    sqlx::query_as(GET_VISITS_FROM_PASS_ID)
        .bind(&pass_id)
        .fetch_all(&state.pg_pool)
        .await
}

pub async fn increase_remaining_uses(
    state: &State<'_, AppState>,
    data: &AddVisitsFormData,
    amount_paid_cents: Option<i32>,
) -> Result<i32> {
    let mut transaction = state.pg_pool.begin().await?;
    let remaining_uses_res = sqlx::query(INCREASE_REMAINING_USES)
        .bind(&data.pass_id)
        .bind(&data.num_visits.code)
        .fetch_one(&mut *transaction)
        .await?;
    let pay_data = InsertPaymentData {
        pass_id: data.pass_id,
        payment_method: data.pay_method.clone().map(|method| method.code),
        amount_paid_cents,
        creator: data.signature.clone(),
    };
    let _payment_res = insert_payment(&mut transaction, &pay_data).await?;
    transaction.commit().await?;
    remaining_uses_res.try_get(0)
}

pub async fn increase_expiration(
    state: &State<'_, AppState>,
    data: &AddTimeFormData,
    amount_paid_cents: Option<i32>,
) -> Result<OffsetDateTime> {
    let mut transaction = state.pg_pool.begin().await?;
    let new_expiration = sqlx::query(INCREASE_EXPIRATION_TIME)
        .bind(&data.pass_id)
        .bind(&data.num_days.code)
        .fetch_one(&mut *transaction)
        .await?;
    let pay_data = InsertPaymentData {
        pass_id: data.pass_id,
        payment_method: data.pay_method.clone().map(|method| method.code),
        amount_paid_cents,
        creator: data.signature.clone(),
    };
    let _payment_res = insert_payment(&mut transaction, &pay_data).await?;
    transaction.commit().await?;
    new_expiration.try_get(0)
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

pub async fn use_pass(state: &State<'_, AppState>, pass_id: i32) -> Result<i32> {
    let mut transaction = state.pg_pool.begin().await?;
    let use_pass_res = sqlx::query(LOG_VISIT)
        .bind(&pass_id)
        .fetch_one(&mut *transaction)
        .await?;
    let _insert_visit_res = sqlx::query(INSERT_VISIT)
        .bind(&pass_id)
        .execute(&mut *transaction)
        .await?;
    transaction.commit().await?;
    let remaining_uses = use_pass_res.try_get(0)?;
    Ok(remaining_uses)
}

pub async fn insert_visit(state: &State<'_, AppState>, pass_id: i32) -> Result<()> {
    sqlx::query(INSERT_VISIT)
        .bind(&pass_id)
        .execute(&state.pg_pool)
        .await?;
    Ok(())
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
    let mut transaction = state.pg_pool.begin().await?;
    let row = sqlx::query(INSERT_PASS)
        .bind(&data.guest_id)
        .bind(&data.passtype)
        .bind(&data.remaining_uses)
        .bind(&data.active)
        .bind(&data.payment_method)
        .bind(&data.amount_paid_cents)
        .bind(&data.expires_at)
        .bind(&data.creator)
        .fetch_one(&mut *transaction)
        .await?;

    let new_pass_id = row.try_get(0)?;
    let pay_data = InsertPaymentData {
        pass_id: new_pass_id,
        payment_method: data.payment_method.clone(),
        amount_paid_cents: data.amount_paid_cents,
        creator: data.creator.clone(),
    };
    let _payment_res = insert_payment(&mut transaction, &pay_data).await?;
    transaction.commit().await?;

    Ok(new_pass_id)
}

pub async fn insert_payment(
    transaction: &mut Transaction<'_, Postgres>,
    data: &InsertPaymentData,
) -> Result<PgQueryResult> {
    sqlx::query(INSERT_PAYMENT)
        .bind(&data.pass_id)
        .bind(&data.payment_method)
        .bind(&data.amount_paid_cents)
        .bind(&data.creator)
        .execute(&mut **transaction)
        .await
}

pub async fn delete_pass_permanent(state: &State<'_, AppState>, pass_id: i32) -> Result<u64> {
    let mut transaction = state.pg_pool.begin().await?;
    let queries = [
        DELETE_PAYMENTS_PASS_ID,
        DELETE_VISITS_PASS_ID,
        DELETE_PASS_PERMANENT,
    ];
    let mut rows_deleted = 0;
    for query in queries {
        let res = sqlx::query(query)
            .bind(&pass_id)
            .execute(&mut *transaction)
            .await?;
        rows_deleted += res.rows_affected();
    }
    transaction.commit().await?;
    Ok(rows_deleted)
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

pub async fn set_pass_guest_id(
    state: &State<'_, AppState>,
    pass_id: i32,
    new_guest_id: i32,
) -> Result<PgQueryResult> {
    sqlx::query(SET_PASS_OWNER)
        .bind(&pass_id)
        .bind(&new_guest_id)
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
