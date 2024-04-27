use std::time::Duration;

use serde::{Deserialize, Serialize};
use sqlx::prelude::FromRow;
use tauri::State;

use crate::{
    database::{
        delete_pass_permanent, get_guest_from_id, increase_remaining_uses, insert_new_pass,
        log_visit_query, search_all_passes, set_pass_active, GetGuestData,
    },
    AppState,
};

#[derive(Debug, Serialize, Clone)]
pub struct ToastError {
    pub name: String,
    pub message: String,
}

impl ToastError {
    pub fn new(name: &str, message: &str) -> Self {
        Self {
            name: name.to_string(),
            message: message.to_string(),
        }
    }
}

impl<E> From<E> for ToastError
where
    E: std::error::Error,
{
    fn from(value: E) -> Self {
        let name = "Error".to_string();
        let message = value.to_string();
        Self { name, message }
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
    pub pass_id: i32,
    pub guest_id: i32,
    pub first_name: String,
    pub last_name: String,
    pub town: String,
    pub remaining_uses: i32,
    pub passtype: PassType,
    pub active: bool,
    pub creator: String,
    pub creation_time: i64,
}

#[derive(Serialize, Deserialize, Clone)]
pub struct PassFormData {
    pub guest_id: Option<i32>,
    pub first_name: String,
    pub last_name: String,
    pub town: String,
    pub passtype: PassType,
    pub pay_method: PayMethod,
    pub last_four: Option<String>,
    pub amount_paid: Option<f64>,
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

#[derive(Deserialize, Serialize, Clone, FromRow)]
pub struct ViewGuestData {
    guest_id: i32,
    first_name: String,
    last_name: String,
    town: String,
    email: String,
    notes: String,
    creator: String,
    creation_time: i64,
}

#[tauri::command(async)]
pub async fn log_visit(state: State<'_, AppState>, pass: SearchPassData) -> Result<(), ToastError> {
    if pass.remaining_uses < 1 {
        return Err(ToastError::new("Log visit", "No uses left"));
    }
    let pass_id = pass.pass_id;
    let _query_result = log_visit_query(&state, pass_id).await?;
    Ok(())
}

#[tauri::command(async)]
pub async fn toggle_pass_active(
    state: State<'_, AppState>,
    pass_data: SearchPassData,
) -> Result<(), ToastError> {
    let pass_id = pass_data.pass_id;
    let new_active = !pass_data.active;
    let _query_result = set_pass_active(&state, pass_id, new_active).await?;
    Ok(())
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
) -> Result<(), ToastError> {
    let _query_result = increase_remaining_uses(&state, &add_visits_data).await?;
    Ok(())
}

#[tauri::command(async)]
pub async fn create_pass(
    state: State<'_, AppState>,
    pass_data: PassFormData,
) -> Result<i32, ToastError> {
    Ok(insert_new_pass(&state, pass_data).await?)
}

#[tauri::command(async)]
pub async fn delete_pass(state: State<'_, AppState>, pass_id: i32) -> Result<(), ToastError> {
    let _query_result = delete_pass_permanent(&state, pass_id).await?;
    Ok(())
}

#[tauri::command(async)]
pub async fn get_guest(
    state: State<'_, AppState>,
    guest_id: i32,
) -> Result<ViewGuestData, ToastError> {
    let GetGuestData {
        guest_id,
        first_name,
        last_name,
        town,
        email,
        notes,
        creator,
        creation_time,
    } = get_guest_from_id(&state, guest_id).await?;

    Ok(ViewGuestData {
        guest_id,
        first_name,
        last_name,
        town,
        email,
        notes,
        creator,
        creation_time: creation_time.unix_timestamp(),
    })
}

#[tauri::command(async)]
pub async fn search_passes(
    state: State<'_, AppState>,
    search: &str,
) -> Result<Vec<SearchPassData>, ToastError> {
    let passes = search_all_passes(&state, search).await?;
    let result = passes
        .into_iter()
        .map(|pass_data| {
            let passtype_code = pass_data.passtype;
            SearchPassData {
                pass_id: pass_data.pass_id,
                guest_id: pass_data.guest_id,
                first_name: pass_data.first_name,
                last_name: pass_data.last_name,
                town: pass_data.town,
                remaining_uses: pass_data.remaining_uses,
                passtype: PassType {
                    name: passtype_code.clone(),
                    code: passtype_code.clone(),
                },
                active: pass_data.active,
                creator: pass_data.creator,
                creation_time: pass_data.creation_time.unix_timestamp(),
            }
        })
        .collect();
    Ok(result)
}
