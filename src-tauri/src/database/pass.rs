use serde::{Deserialize, Serialize};
use sqlx::{postgres::PgQueryResult, prelude::*};
use tauri::State;
use time::OffsetDateTime;

use crate::{
    api::{AddTimeFormData, AddVisitsFormData},
    AppState,
};

use super::pay_visit::{insert_payment, InsertPaymentData};

#[derive(Deserialize, Serialize, Clone, FromRow)]
pub struct NewPassData {
    pub guest_id: i32,
    pub passtype: String,
    pub remaining_uses: Option<i32>,
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
    pub favorite: bool,
    pub notes: Option<String>,
    pub creator: String,
    pub expires_at: Option<OffsetDateTime>,
    pub created_at: OffsetDateTime,
}

pub async fn update_pass_favorite(
    state: &State<'_, AppState>,
    new_state: bool,
    pass_id: i32,
) -> sqlx::Result<PgQueryResult> {
    sqlx::query!(
        r#"UPDATE passes
SET favorite = $1
WHERE pass_id = $2"#,
        new_state,
        pass_id,
    )
    .execute(&state.pg_pool)
    .await
}

pub async fn get_pass_from_id(
    state: &State<'_, AppState>,
    pass_id: i32,
) -> sqlx::Result<GetPassData> {
    sqlx::query_as!(
        GetPassData,
        r#"SELECT * FROM passes WHERE pass_id = $1"#,
        pass_id,
    )
    .fetch_one(&state.pg_pool)
    .await
}

pub async fn update_pass_notes(
    state: &State<'_, AppState>,
    notes: Option<String>,
    pass_id: i32,
) -> sqlx::Result<PgQueryResult> {
    sqlx::query!(
        r#"UPDATE passes
SET notes = $2
WHERE pass_id = $1"#,
        pass_id,
        notes,
    )
    .execute(&state.pg_pool)
    .await
}

pub async fn increase_remaining_uses(
    state: &State<'_, AppState>,
    data: &AddVisitsFormData,
    amount_paid_cents: Option<i32>,
) -> sqlx::Result<i32> {
    let mut transaction = state.pg_pool.begin().await?;
    let remaining_uses_res = sqlx::query_as!(
        GetPassData,
        r#"UPDATE passes
SET remaining_uses = remaining_uses + $2
WHERE pass_id = $1
RETURNING *"#,
        data.pass_id,
        data.num_visits.code,
    )
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
    Ok(remaining_uses_res.remaining_uses.unwrap())
}

pub async fn increase_expiration(
    state: &State<'_, AppState>,
    data: &AddTimeFormData,
    amount_paid_cents: Option<i32>,
) -> sqlx::Result<Option<OffsetDateTime>> {
    let mut transaction = state.pg_pool.begin().await?;
    let pass_res = sqlx::query_as!(
        GetPassData,
        r#"UPDATE passes
SET expires_at = CASE 
    WHEN expires_at IS NOT NULL
    THEN GREATEST(expires_at, CURRENT_TIMESTAMP) + ($2 * INTERVAL '1 day')
END
WHERE pass_id = $1
RETURNING *"#,
        data.pass_id,
        data.num_days.code as f64,
    )
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
    Ok(pass_res.expires_at)
}

pub async fn use_pass(state: &State<'_, AppState>, pass_id: i32) -> sqlx::Result<Option<i32>> {
    let mut transaction = state.pg_pool.begin().await?;
    let use_pass_res = sqlx::query_as!(
        GetPassData,
        r#"UPDATE passes
SET remaining_uses = CASE
    WHEN remaining_uses > 0 THEN remaining_uses - 1
END
WHERE pass_id = $1
RETURNING *"#,
        pass_id,
    )
    .fetch_one(&mut *transaction)
    .await?;
    let _insert_visit_res = sqlx::query!(r#"INSERT INTO visits (pass_id) VALUES ($1)"#, pass_id)
        .execute(&mut *transaction)
        .await?;
    transaction.commit().await?;
    Ok(use_pass_res.remaining_uses)
}

pub async fn insert_pass(state: &State<'_, AppState>, data: &NewPassData) -> sqlx::Result<i32> {
    let mut transaction = state.pg_pool.begin().await?;
    let row = sqlx::query_as!(
        GetPassData,
        r#"INSERT
INTO passes (guest_id, passtype, remaining_uses, expires_at, creator)
VALUES ($1, $2, $3, $4, $5)
RETURNING *"#,
        data.guest_id,
        data.passtype,
        data.remaining_uses,
        data.expires_at,
        data.creator,
    )
    .fetch_one(&mut *transaction)
    .await?;

    let new_pass_id = row.pass_id;
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

pub async fn delete_pass_permanent(state: &State<'_, AppState>, pass_id: i32) -> sqlx::Result<()> {
    let mut transaction = state.pg_pool.begin().await?;
    sqlx::query!(r#"DELETE FROM payments WHERE pass_id = $1"#, pass_id,)
        .execute(&mut *transaction)
        .await?;
    sqlx::query!(r#"DELETE FROM visits WHERE pass_id = $1"#, pass_id,)
        .execute(&mut *transaction)
        .await?;
    sqlx::query!(r#"DELETE FROM passes WHERE pass_id = $1"#, pass_id,)
        .execute(&mut *transaction)
        .await?;
    transaction.commit().await
}

pub async fn set_pass_active(
    state: &State<'_, AppState>,
    pass_id: i32,
    new_state: bool,
) -> sqlx::Result<PgQueryResult> {
    sqlx::query!(
        r#"UPDATE passes
SET active = $2
WHERE pass_id = $1"#,
        pass_id,
        new_state,
    )
    .execute(&state.pg_pool)
    .await
}

pub async fn set_pass_guest_id(
    state: &State<'_, AppState>,
    pass_id: i32,
    new_guest_id: i32,
) -> sqlx::Result<PgQueryResult> {
    sqlx::query!(
        r#"UPDATE passes
SET guest_id = $2
WHERE pass_id = $1"#,
        pass_id,
        new_guest_id,
    )
    .execute(&state.pg_pool)
    .await
}
