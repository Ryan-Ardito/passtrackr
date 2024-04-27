use std::{collections::HashMap, time::Duration};

use serde::{Deserialize, Serialize};
use sqlx::prelude::FromRow;
use tauri::State;

use crate::{
    database::{
        delete_pass_permanent, increase_remaining_uses, insert_new_pass, log_visit_query,
        search_all_passes, set_pass_active, QueryError,
    },
    AppState,
};

// A custom error type that represents all possible in our command
#[derive(Debug, thiserror::Error)]
pub enum ThizError {
    #[error("Database error: {0}")]
    Database(#[from] sqlx::Error),
    #[error("Database error: {0}")]
    Generic(#[from] QueryError),
}

// we must also implement serde::Serialize
impl serde::Serialize for ThizError {
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
    where
        S: serde::ser::Serializer,
    {
        serializer.serialize_str(self.to_string().as_ref())
    }
}

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

#[derive(Deserialize, Serialize, Debug, Clone)]
pub struct NumVisits {
    pub name: String,
    pub code: i32,
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

#[derive(Serialize, Deserialize, Clone)]
pub struct AddVisitsFormData {
    pub pass_id: i32,
    pub num_visits: NumVisits,
    pub pay_method: PayMethod,
    pub last_four: Option<String>,
    pub amount_paid: Option<String>,
    pub signature: String,
}

#[tauri::command(async)]
pub async fn log_visit(state: State<'_, AppState>, pass: SearchPassData) -> Result<(), ThizError> {
    if pass.remaining_uses < 1 {
        return Err(ThizError::Generic(QueryError::new(
            "couldn't connect to db",
        )));
    }
    let pass_id = pass.pass_id as i32;
    Ok(log_visit_query(&state, pass_id).await?)
}

#[tauri::command(async)]
pub async fn toggle_pass_active(
    state: State<'_, AppState>,
    pass_data: SearchPassData,
) -> Result<(), ThizError> {
    let pass_id = pass_data.pass_id as i32;
    let new_active = !pass_data.active;
    Ok(set_pass_active(&state, pass_id, new_active).await?)
}

#[tauri::command(async)]
pub fn async_sleep(millis: u64) -> Result<(), String> {
    std::thread::sleep(Duration::from_millis(millis));
    Ok(())
}

#[tauri::command(async)]
pub async fn add_visits(
    state: State<'_, AppState>,
    add_visits_data: AddVisitsFormData,
) -> Result<(), ThizError> {
    Ok(increase_remaining_uses(&state, &add_visits_data).await?)
}

#[tauri::command(async)]
pub async fn create_pass(
    state: State<'_, AppState>,
    pass_data: PassFormData,
) -> Result<i32, ThizError> {
    Ok(insert_new_pass(&state, pass_data).await?)
}

#[tauri::command(async)]
pub async fn delete_pass(state: State<'_, AppState>, pass_id: i32) -> Result<(), ThizError> {
    Ok(delete_pass_permanent(&state, pass_id).await?)
}

#[tauri::command(async)]
pub fn get_guest(guest_id: u64, delay_millis: u64, will_fail: bool) -> Result<String, ThizError> {
    std::thread::sleep(Duration::from_millis(delay_millis));

    match will_fail {
        false => Ok(format!("{guest_id}")),
        true => Err(ThizError::Generic(QueryError::new(
            "couldn't connect to db",
        ))),
    }
}

#[tauri::command(async)]
pub async fn search_passes(
    state: State<'_, AppState>,
    search: &str,
) -> Result<Vec<SearchPassData>, ThizError> {
    // do this on the front end?
    let mut passtype_map = HashMap::new();
    passtype_map.insert("punch".to_string(), "Punch".to_string());
    passtype_map.insert("annual".to_string(), "Annual".to_string());
    passtype_map.insert("six_month".to_string(), "6 Month".to_string());
    passtype_map.insert("free_pass".to_string(), "Free Pass".to_string());
    passtype_map.insert("facial".to_string(), "Facial".to_string());

    let passes = search_all_passes(&state, search).await?;
    let result = passes
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
        .collect();
    Ok(result)
}
