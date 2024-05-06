use serde::{Deserialize, Serialize};
use sqlx::{postgres::PgQueryResult, prelude::*};
use tauri::State;
use time::OffsetDateTime;

use crate::{
    api::{AddTimeFormData, AddVisitsFormData},
    AppState,
};

use super::{
    pay_visit::{insert_payment, InsertPaymentData},
    queries::{
        DELETE_PASS_PERMANENT, DELETE_PAYMENTS_PASS_ID, DELETE_VISITS_PASS_ID, EDIT_PASS_NOTES,
        GET_PASS, INCREASE_EXPIRATION_TIME, INCREASE_REMAINING_USES, INSERT_PASS, INSERT_VISIT,
        LOG_VISIT, SET_PASS_ACTIVE, SET_PASS_OWNER,
    },
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
    pub notes: Option<String>,
    pub creator: String,
    pub expires_at: Option<OffsetDateTime>,
    pub created_at: OffsetDateTime,
}

pub async fn get_pass_from_id(
    state: &State<'_, AppState>,
    pass_id: i32,
) -> sqlx::Result<GetPassData> {
    sqlx::query_as(GET_PASS)
        .bind(pass_id)
        .fetch_one(&state.pg_pool)
        .await
}

pub async fn update_pass_notes(
    state: &State<'_, AppState>,
    notes: Option<String>,
    pass_id: i32,
) -> sqlx::Result<PgQueryResult> {
    sqlx::query(EDIT_PASS_NOTES)
        .bind(pass_id)
        .bind(&notes)
        .execute(&state.pg_pool)
        .await
}

pub async fn increase_remaining_uses(
    state: &State<'_, AppState>,
    data: &AddVisitsFormData,
    amount_paid_cents: Option<i32>,
) -> sqlx::Result<i32> {
    let mut transaction = state.pg_pool.begin().await?;
    let remaining_uses_res = sqlx::query(INCREASE_REMAINING_USES)
        .bind(data.pass_id)
        .bind(data.num_visits.code)
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
) -> sqlx::Result<OffsetDateTime> {
    let mut transaction = state.pg_pool.begin().await?;
    let new_expiration = sqlx::query(INCREASE_EXPIRATION_TIME)
        .bind(data.pass_id)
        .bind(data.num_days.code)
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

pub async fn use_pass(state: &State<'_, AppState>, pass_id: i32) -> sqlx::Result<i32> {
    let mut transaction = state.pg_pool.begin().await?;
    let use_pass_res = sqlx::query(LOG_VISIT)
        .bind(pass_id)
        .fetch_one(&mut *transaction)
        .await?;
    let _insert_visit_res = sqlx::query(INSERT_VISIT)
        .bind(pass_id)
        .execute(&mut *transaction)
        .await?;
    transaction.commit().await?;
    let remaining_uses = use_pass_res.try_get(0)?;
    Ok(remaining_uses)
}

pub async fn insert_pass(state: &State<'_, AppState>, data: &NewPassData) -> sqlx::Result<i32> {
    let mut transaction = state.pg_pool.begin().await?;
    let row = sqlx::query(INSERT_PASS)
        .bind(data.guest_id)
        .bind(&data.passtype)
        .bind(data.remaining_uses)
        .bind(data.active)
        .bind(&data.payment_method)
        .bind(data.amount_paid_cents)
        .bind(data.expires_at)
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

pub async fn delete_pass_permanent(state: &State<'_, AppState>, pass_id: i32) -> sqlx::Result<u64> {
    let mut transaction = state.pg_pool.begin().await?;
    let queries = [
        DELETE_PAYMENTS_PASS_ID,
        DELETE_VISITS_PASS_ID,
        DELETE_PASS_PERMANENT,
    ];
    let mut rows_deleted = 0;
    for query in queries {
        let res = sqlx::query(query)
            .bind(pass_id)
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
) -> sqlx::Result<PgQueryResult> {
    sqlx::query(SET_PASS_ACTIVE)
        .bind(pass_id)
        .bind(new_state)
        .execute(&state.pg_pool)
        .await
}

pub async fn set_pass_guest_id(
    state: &State<'_, AppState>,
    pass_id: i32,
    new_guest_id: i32,
) -> sqlx::Result<PgQueryResult> {
    sqlx::query(SET_PASS_OWNER)
        .bind(pass_id)
        .bind(new_guest_id)
        .execute(&state.pg_pool)
        .await
}
