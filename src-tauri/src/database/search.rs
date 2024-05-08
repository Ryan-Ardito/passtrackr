use serde::{Deserialize, Serialize};
use sqlx::prelude::*;
use tauri::State;
use time::OffsetDateTime;

use crate::AppState;

const SEARCH_RESPONSE_LIMIT: i64 = 500;

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
    pub favorite: bool,
    pub creator: String,
    pub expires_at: Option<OffsetDateTime>,
    pub created_at: OffsetDateTime,
}

pub async fn get_favorite_passes(
    state: &State<'_, AppState>,
) -> sqlx::Result<Vec<PassSearchResponse>> {
    sqlx::query_as!(
        PassSearchResponse,
        r#"SELECT
    p.pass_id,
    p.guest_id,
    g.first_name,
    g.last_name,
    g.town,
    p.remaining_uses,
    p.passtype,
    p.active,
    p.favorite,
    p.creator,
    p.expires_at,
    p.created_at
FROM
    passes AS p
JOIN
    guests AS g ON p.guest_id = g.guest_id
WHERE
    p.favorite = TRUE
ORDER BY
    g.last_name, g.first_name, g.guest_id, p.pass_id"#
    )
    .fetch_all(&state.pg_pool)
    .await
}

pub async fn search_all_passes(
    state: &State<'_, AppState>,
    search_term: &str,
) -> sqlx::Result<Vec<PassSearchResponse>> {
    sqlx::query_as!(
        PassSearchResponse,
        r#"SELECT
    p.pass_id,
    p.guest_id,
    g.first_name,
    g.last_name,
    g.town,
    p.remaining_uses,
    p.passtype,
    p.active,
    p.favorite,
    p.creator,
    p.expires_at,
    p.created_at
FROM
    passes AS p
JOIN
    guests AS g ON p.guest_id = g.guest_id
WHERE
    first_name || ' ' || last_name ILIKE $1
    OR
    g.last_name ILIKE $1
ORDER BY
    g.last_name, g.first_name, g.guest_id, p.pass_id
LIMIT $2"#,
        format!("{search_term}%"),
        SEARCH_RESPONSE_LIMIT,
    )
    .fetch_all(&state.pg_pool)
    .await
}
