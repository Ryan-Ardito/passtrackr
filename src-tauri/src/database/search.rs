use serde::{Deserialize, Serialize};
use sqlx::prelude::*;
use tauri::State;
use time::OffsetDateTime;

use crate::AppState;

use super::queries::SEARCH_ALL;

const SEARCH_RESPONSE_LIMIT: i32 = 500;

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

pub async fn search_all_passes(
    state: &State<'_, AppState>,
    search_term: &str,
) -> sqlx::Result<Vec<PassSearchResponse>> {
    sqlx::query_as(SEARCH_ALL)
        .bind(format!("{search_term}%"))
        .bind(SEARCH_RESPONSE_LIMIT)
        .fetch_all(&state.pg_pool)
        .await
}
