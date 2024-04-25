use std::{collections::HashMap, time::Duration};

use serde::{Deserialize, Serialize};
use sqlx::{prelude::FromRow, PgPool};
use tauri::State;

use crate::{
    database::{insert_new_pass, log_visit_query, search_all_passes, QueryError},
    AppState,
};

const PG_CONNECT_STRING: &str = "postgres://postgres:joyful@172.22.0.22/passtracker-dev";

#[derive(Deserialize, Serialize, Debug, Clone)]
pub struct PassType {
    pub name: String,
    pub code: String,
}

#[derive(Deserialize, Serialize, Debug, Clone)]
pub struct PayMethod {
    pub name: String,
    pub code: String,
}

#[derive(Deserialize, Serialize, Clone, FromRow)]
pub struct SearchPassData {
    pub pass_id: u64,
    pub guest_id: u64,
    pub first_name: String,
    pub last_name: String,
    pub town: String,
    pub remaining_uses: u64,
    pub passtype: PassType,
    pub active: bool,
    pub creator: String,
    pub creation_time: u64,
}

#[derive(Serialize, Deserialize, Clone)]
pub struct PassFormData {
    pub guest_id: Option<u64>,
    pub first_name: String,
    pub last_name: String,
    pub town: String,
    pub passtype: PassType,
    pub pay_method: PayMethod,
    pub last_four: Option<String>,
    pub amount_paid: Option<String>,
    pub signature: String,
}

#[tauri::command(async)]
pub async fn log_visit(state: State<'_, AppState>, pass: SearchPassData) -> Result<(), QueryError> {
    if pass.remaining_uses < 1 {
        return Err(QueryError {
            name: "Log visit".to_string(),
            message: "No punches left".to_string(),
        });
    }
    let pass_id = pass.pass_id as i32;
    let res = log_visit_query(&state, pass_id)
        .await
        .map_err(|err| QueryError {
            name: "Database error".to_string(),
            message: err.to_string(),
        });

    res
}

#[tauri::command(async)]
pub fn async_sleep(millis: u64) -> Result<(), String> {
    std::thread::sleep(Duration::from_millis(millis));
    Ok(())
}

#[tauri::command(async)]
pub async fn create_pass(state: State<'_, AppState>, pass_data: PassFormData) -> Result<i32, QueryError> {
    let res = insert_new_pass(&state, pass_data)
        .await
        .map_err(|err| QueryError {
            name: "Database error".to_string(),
            message: err.to_string(),
        });

    res
}

#[tauri::command(async)]
pub fn get_guest(guest_id: u64, delay_millis: u64, will_fail: bool) -> Result<String, QueryError> {
    std::thread::sleep(Duration::from_millis(delay_millis));

    match will_fail {
        false => Ok(format!("{guest_id}")),
        true => Err(QueryError {
            name: "Create pass".to_string(),
            message: "failed".to_string(),
        }),
    }
}

#[tauri::command(async)]
pub async fn search_passes(
    state: State<'_, AppState>,
    search: &str,
) -> Result<Vec<SearchPassData>, QueryError> {
    // do this on the front end?
    let mut passtype_map = HashMap::new();
    passtype_map.insert("punch".to_string(), "Punch".to_string());
    passtype_map.insert("annual".to_string(), "Annual".to_string());
    passtype_map.insert("six_month".to_string(), "6 Month".to_string());
    passtype_map.insert("free_pass".to_string(), "Free Pass".to_string());
    passtype_map.insert("facial".to_string(), "Facial".to_string());

    let res = search_all_passes(&state, search)
        .await
        .map_err(|err| QueryError {
            name: "Database error".to_string(),
            message: err.to_string(),
        });
    res.map(|passes| {
        passes
            .into_iter()
            .map(|pass_data| {
                let passtype_code = pass_data.passtype;
                SearchPassData {
                    pass_id: pass_data.pass_id as u64,
                    guest_id: pass_data.guest_id as u64,
                    first_name: pass_data.first_name,
                    last_name: pass_data.last_name,
                    town: pass_data.town,
                    remaining_uses: pass_data.remaining_uses as u64,
                    passtype: PassType {
                        name: passtype_map.get(&passtype_code).unwrap().clone(),
                        code: passtype_code,
                    },
                    active: pass_data.active,
                    creator: pass_data.creator,
                    creation_time: pass_data.creation_time.unix_timestamp() as u64,
                }
            })
            .collect()
    })
}
