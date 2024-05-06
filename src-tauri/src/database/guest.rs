use serde::{Deserialize, Serialize};
use sqlx::{postgres::PgQueryResult, prelude::*};
use tauri::State;
use time::OffsetDateTime;

use crate::{api::PassFormData, AppState};

use super::queries::{EDIT_GUEST, GET_GUEST, INSERT_GUEST};

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

pub async fn get_guest_from_id(state: &State<'_, AppState>, guest_id: i32) -> sqlx::Result<GetGuestData> {
    sqlx::query_as(GET_GUEST)
        .bind(guest_id)
        .fetch_one(&state.pg_pool)
        .await
}

pub async fn update_guest(
    state: &State<'_, AppState>,
    data: EditGuestData,
) -> sqlx::Result<PgQueryResult> {
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
