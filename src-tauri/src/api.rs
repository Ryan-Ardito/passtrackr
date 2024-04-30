use std::time::Duration;

use serde::{Deserialize, Serialize};
use sqlx::prelude::FromRow;
use tauri::State;

use crate::{
    database::{
        delete_pass_permanent, get_guest_from_id, get_pass_from_id, increase_remaining_uses,
        insert_guest, insert_pass, log_visit_query, search_all_passes, set_pass_active,
        GetGuestData, GetPassData, NewPassData,
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

#[derive(Deserialize, Serialize, Clone, FromRow)]
pub struct ViewPassData {
    pub pass_id: i32,
    pub guest_id: i32,
    pub passtype: PassType,
    pub remaining_uses: i32,
    pub active: bool,
    pub payment_method: String,
    pub amount_paid_cents: i32,
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
    mut pass_data: PassFormData,
) -> Result<i32, ToastError> {
    let PassFormData {
        guest_id,
        first_name,
        last_name,
        town,
        passtype,
        amount_paid,
        signature,
        ..
    } = pass_data.clone();

    // strip whitespace
    pass_data.first_name = first_name.trim().to_string();
    pass_data.last_name = last_name.trim().to_string();
    pass_data.town = town.trim().to_string();
    pass_data.signature = signature.trim().to_string();

    // insert new guest if no guest_id provided
    let guest_id = guest_id.unwrap_or(insert_guest(&state, &pass_data).await?);

    let amount_paid_cents = match &amount_paid {
        Some(num_str) => {
            let amount: f64 = num_str.clone().parse()?;
            Some((amount * 100.0) as i32)
        }
        None => None,
    };

    let remaining_uses = match passtype.name.as_str() {
        "10x Punch" => 10,
        "6x Punch" => 6,
        "Annual" => 22,
        "6 Month" => 11,
        "Free Pass" => 13,
        "3x Facial" => 3,
        "6x Facial" => 6,
        _ => 1
    };

    let data = NewPassData {
        guest_id,
        passtype: passtype.code.clone(),
        remaining_uses,
        active: true,
        payment_method: Some(pass_data.pay_method.code),
        amount_paid_cents,
        creator: pass_data.signature,
    };

    Ok(insert_pass(&state, &data).await?)
}

#[tauri::command(async)]
pub async fn delete_pass(state: State<'_, AppState>, pass_id: i32) -> Result<(), ToastError> {
    let _query_result = delete_pass_permanent(&state, pass_id).await?;
    Ok(())
}

#[tauri::command(async)]
pub async fn get_pass(
    state: State<'_, AppState>,
    pass_id: i32,
) -> Result<ViewPassData, ToastError> {
    let GetPassData {
        pass_id,
        guest_id,
        passtype,
        remaining_uses,
        active,
        payment_method,
        amount_paid_cents,
        creator,
        creation_time,
    } = get_pass_from_id(&state, pass_id).await?;

    Ok(ViewPassData {
        pass_id,
        guest_id,
        passtype: PassType {
            name: passtype.clone(),
            code: passtype.clone(),
        },
        remaining_uses,
        active,
        payment_method,
        amount_paid_cents,
        creator,
        creation_time: creation_time.unix_timestamp(),
    })
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
        creation_time: creation_time.unix_timestamp() * 1000,
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
                creation_time: pass_data.creation_time.unix_timestamp() * 1000,
            }
        })
        .collect();
    Ok(result)
}
