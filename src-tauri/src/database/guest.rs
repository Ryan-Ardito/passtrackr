use serde::{Deserialize, Serialize};
use sqlx::{postgres::PgQueryResult, prelude::*};
use tauri::State;
use time::OffsetDateTime;

use crate::{api::PassFormData, AppState};

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
pub struct EditGuestData {
    pub guest_id: i32,
    pub first_name: String,
    pub last_name: String,
    pub town: String,
    pub email: Option<String>,
    pub notes: Option<String>,
}

pub async fn insert_guest(state: &State<'_, AppState>, data: &PassFormData) -> sqlx::Result<i32> {
    let new_guest = sqlx::query!(
        r#"INSERT
INTO guests (first_name, last_name, town, email, notes, creator)
VALUES ($1, $2, $3, $4, $5, $6)
RETURNING guest_id"#,
        &data.first_name,
        &data.last_name,
        &data.town,
        "",
        "",
        &data.signature,
    )
    .fetch_one(&state.pg_pool)
    .await?;

    Ok(new_guest.guest_id)
}

pub async fn get_guest_from_id(
    state: &State<'_, AppState>,
    guest_id: i32,
) -> sqlx::Result<GetGuestData> {
    sqlx::query_as!(
        GetGuestData,
        r#"SELECT * FROM guests WHERE guest_id = $1"#,
        guest_id,
    )
    .fetch_one(&state.pg_pool)
    .await
}

pub async fn update_guest(
    state: &State<'_, AppState>,
    data: EditGuestData,
) -> sqlx::Result<PgQueryResult> {
    sqlx::query!(
        r#"UPDATE guests
SET first_name = $1,
    last_name = $2,
    town = $3,
    email = $4,
    notes = $5
WHERE guest_id = $6"#,
        &data.first_name,
        &data.last_name,
        &data.town,
        data.email,
        data.notes,
        data.guest_id,
    )
    .execute(&state.pg_pool)
    .await
}
