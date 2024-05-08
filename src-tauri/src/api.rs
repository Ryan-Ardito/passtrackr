use serde::{Deserialize, Serialize};
use sqlx::prelude::FromRow;
use tauri::State;
use time::{Duration, OffsetDateTime};

use crate::{
    database::{
        guest::{get_guest_from_id, insert_guest, update_guest, EditGuestData, GetGuestData},
        pass::{
            delete_pass_permanent, get_pass_from_id, increase_expiration, increase_remaining_uses,
            insert_pass, set_pass_active, set_pass_guest_id, update_pass_favorite,
            update_pass_notes, use_pass, GetPassData, NewPassData,
        },
        pay_visit::{
            get_payments_from_guest_id, get_payments_from_pass_id, get_visits_from_guest_id,
            get_visits_from_pass_id, insert_visit, PaymentRow, VisitRow,
        },
        search::{get_favorite_passes, search_all_passes},
    },
    AppState,
};

const ONE_YEAR_IN_DAYS: i64 = 365;
const SIX_MONTHS_IN_DAYS: i64 = 183;

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
pub struct PassAmountType {
    pub name: String,
    pub code: NewPassType,
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

#[derive(Deserialize, Serialize, Debug, Clone)]
pub struct NumDays {
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
    pub remaining_uses: Option<i32>,
    pub passtype: PassType,
    pub active: bool,
    pub favorite: bool,
    pub creator: String,
    pub expires_at: Option<i64>,
    pub created_at: i64,
}

#[derive(Deserialize, Serialize, Clone, FromRow)]
pub struct ViewPassData {
    pub pass_id: i32,
    pub guest_id: i32,
    pub passtype: PassType,
    pub remaining_uses: Option<i32>,
    pub active: bool,
    pub favorite: bool,
    pub notes: Option<String>,
    pub creator: String,
    pub expires_at: Option<i64>,
    pub created_at: i64,
}

#[derive(Serialize, Deserialize, Clone)]
pub struct PassFormData {
    pub guest_id: Option<i32>,
    pub first_name: String,
    pub last_name: String,
    pub town: String,
    pub passtype: PassAmountType,
    pub pay_method: Option<PayMethod>,
    pub last_four: Option<String>,
    pub amount_paid: Option<String>,
    pub signature: String,
}

#[derive(Serialize, Deserialize, Clone)]
pub struct AddVisitsFormData {
    pub pass_id: i32,
    pub num_visits: NumVisits,
    pub pay_method: Option<PayMethod>,
    pub last_four: Option<String>,
    pub amount_paid: Option<String>,
    pub signature: String,
}

#[derive(Serialize, Deserialize, Clone)]
pub struct AddTimeFormData {
    pub pass_id: i32,
    pub num_days: NumDays,
    pub pay_method: Option<PayMethod>,
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
    email: Option<String>,
    notes: Option<String>,
    creator: String,
    created_at: i64,
}

#[derive(Debug, Clone, Copy, Serialize, Deserialize)]
pub enum NewPassType {
    TenPunch,
    SixPunch,
    Annual,
    SixMonth,
    FreePass,
    ThreeFacial,
    SixFacial,
}

impl NewPassType {
    pub fn pass_type_code(&self) -> &str {
        match self {
            Self::TenPunch => "Punch",
            Self::SixPunch => "Punch",
            Self::Annual => "Annual",
            Self::SixMonth => "6 Month",
            Self::FreePass => "Free",
            Self::ThreeFacial => "Facial",
            Self::SixFacial => "Facial",
        }
    }
}

#[derive(Deserialize, Serialize, Clone, FromRow)]
pub struct Visit {
    visit_id: i32,
    pass_id: i32,
    created_at: i64,
}

#[derive(Deserialize, Serialize, Clone, FromRow)]
pub struct Payment {
    payment_id: i32,
    pass_id: i32,
    payment_method: Option<String>,
    amount_paid: Option<f64>,
    creator: String,
    created_at: i64,
}

#[tauri::command(async)]
pub async fn log_visit(
    state: State<'_, AppState>,
    pass: SearchPassData,
) -> Result<Option<i32>, ToastError> {
    if pass.remaining_uses.is_some_and(|num| num < 1) {
        return Err(ToastError::new("Log visit", "No uses left"));
    }
    let pass_id = pass.pass_id;
    let remaining_uses = match pass.passtype.code.as_str() {
        // rewrite this as a parsed enum
        "Annual" | "Free" | "6 Month" => {
            insert_visit(&state, pass_id).await?;
            pass.remaining_uses
        }
        "Punch" | "Facial" => use_pass(&state, pass_id).await?,
        _ => return Err(ToastError::new("Log visit", "Invalid pass type")),
    };
    Ok(remaining_uses)
}

#[tauri::command(async)]
pub async fn set_pass_favorite(
    state: State<'_, AppState>,
    favorite: bool,
    pass_id: i32,
) -> Result<(), ToastError> {
    let _query_result = update_pass_favorite(&state, favorite, pass_id).await?;
    Ok(())
}

#[tauri::command(async)]
pub async fn set_pass_owner(
    state: State<'_, AppState>,
    pass_id: i32,
    new_guest_id: i32,
) -> Result<(), ToastError> {
    let _query_result = set_pass_guest_id(&state, pass_id, new_guest_id).await?;
    Ok(())
}

#[tauri::command(async)]
pub async fn edit_guest(
    state: State<'_, AppState>,
    guest_data: EditGuestData,
) -> Result<(), ToastError> {
    let _query_result = update_guest(&state, guest_data).await?;
    Ok(())
}

#[tauri::command(async)]
pub async fn edit_pass_notes(
    state: State<'_, AppState>,
    notes: Option<String>,
    pass_id: i32,
) -> Result<(), ToastError> {
    let _query_result = update_pass_notes(&state, notes, pass_id).await?;
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
    std::thread::sleep(std::time::Duration::from_millis(millis));
    Ok(())
}

#[tauri::command(async)]
pub async fn add_visits(
    state: State<'_, AppState>,
    add_visits_data: AddVisitsFormData,
) -> Result<i32, ToastError> {
    let amount_paid_cents = add_visits_data
        .clone()
        .amount_paid
        .map(|num_str| num_str.clone().parse::<f64>())
        .and_then(|amount_opt| amount_opt.ok().map(|amount| (amount * 100.0) as i32));
    let remaining_uses =
        increase_remaining_uses(&state, &add_visits_data, amount_paid_cents).await?;
    Ok(remaining_uses)
}

#[tauri::command(async)]
pub async fn add_time(
    state: State<'_, AppState>,
    add_time_data: AddTimeFormData,
) -> Result<Option<i64>, ToastError> {
    let amount_paid_cents = add_time_data
        .clone()
        .amount_paid
        .map(|num_str| num_str.clone().parse::<f64>())
        .and_then(|amount_opt| amount_opt.ok().map(|amount| (amount * 100.0) as i32));
    let new_expiration_time =
        increase_expiration(&state, &add_time_data, amount_paid_cents).await?;
    Ok(new_expiration_time.map(|utime| utime.unix_timestamp() * 1000))
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
        signature,
        ..
    } = pass_data.clone();

    // strip whitespace
    pass_data.first_name = first_name.trim().to_string();
    pass_data.last_name = last_name.trim().to_string();
    pass_data.town = town.trim().to_string();
    pass_data.signature = signature.trim().to_string();

    // insert new guest if no guest_id provided
    let guest_id = match guest_id {
        Some(id) => id,
        None => insert_guest(&state, &pass_data).await?,
    };

    let amount_paid_cents = pass_data
        .amount_paid
        .clone()
        .map(|num_str| num_str.clone().parse::<f64>())
        .and_then(|amount_opt| amount_opt.ok().map(|amount| (amount * 100.0) as i32));

    let (remaining_uses, num_days_valid) = match passtype.code {
        NewPassType::TenPunch => (Some(10), None),
        NewPassType::SixPunch => (Some(6), None),
        NewPassType::Annual => (None, Some(ONE_YEAR_IN_DAYS)),
        NewPassType::SixMonth => (None, Some(SIX_MONTHS_IN_DAYS)),
        NewPassType::FreePass => (None, None),
        NewPassType::ThreeFacial => (Some(3), None),
        NewPassType::SixFacial => (Some(6), None),
    };

    let expires_at =
        num_days_valid.and_then(|days| OffsetDateTime::now_utc().checked_add(Duration::days(days)));

    let data = NewPassData {
        guest_id,
        passtype: pass_data.passtype.code.pass_type_code().to_string(),
        remaining_uses,
        payment_method: pass_data.pay_method.map(|method| method.code),
        amount_paid_cents,
        expires_at,
        creator: pass_data.signature,
    };

    Ok(insert_pass(&state, &data).await?)
}

#[tauri::command]
pub fn was_config_error(state: State<'_, AppState>) -> bool {
    state.config_error
}

#[tauri::command(async)]
pub async fn delete_pass(state: State<'_, AppState>, pass_id: i32) -> Result<(), ToastError> {
    Ok(delete_pass_permanent(&state, pass_id).await?)
}

#[tauri::command(async)]
pub async fn get_payments(
    state: State<'_, AppState>,
    guest_id: i32,
) -> Result<Vec<Payment>, ToastError> {
    Ok(get_payments_from_guest_id(&state, guest_id)
        .await?
        .iter()
        .map(|payment| {
            let PaymentRow {
                payment_id,
                pass_id,
                payment_method,
                amount_paid_cents,
                creator,
                created_at,
            } = payment.clone();

            let amount_paid = amount_paid_cents.and_then(|amount| {
                amount
                    .try_into()
                    .map(|amount_float: f64| amount_float / 100.0)
                    .ok()
            });

            let created_at = created_at.unix_timestamp() * 1000;

            Payment {
                payment_id,
                pass_id,
                payment_method,
                amount_paid,
                creator,
                created_at,
            }
        })
        .collect())
}

#[tauri::command(async)]
pub async fn get_visits_from_pass(
    state: State<'_, AppState>,
    pass_id: i32,
) -> Result<Vec<Visit>, ToastError> {
    Ok(get_visits_from_pass_id(&state, pass_id)
        .await?
        .iter()
        .map(|visit| {
            let VisitRow {
                visit_id,
                pass_id,
                created_at,
            } = visit.clone();
            Visit {
                visit_id,
                pass_id,
                created_at: created_at.unix_timestamp() * 1000,
            }
        })
        .collect())
}

#[tauri::command(async)]
pub async fn get_payments_from_pass(
    state: State<'_, AppState>,
    pass_id: i32,
) -> Result<Vec<Payment>, ToastError> {
    Ok(get_payments_from_pass_id(&state, pass_id)
        .await?
        .iter()
        .map(|payment| {
            let PaymentRow {
                payment_id,
                pass_id,
                payment_method,
                amount_paid_cents,
                creator,
                created_at,
            } = payment.clone();

            let amount_paid = amount_paid_cents.and_then(|amount| {
                amount
                    .try_into()
                    .map(|amount_float: f64| amount_float / 100.0)
                    .ok()
            });

            let created_at = created_at.unix_timestamp() * 1000;

            Payment {
                payment_id,
                pass_id,
                payment_method,
                amount_paid,
                creator,
                created_at,
            }
        })
        .collect())
}

#[tauri::command(async)]
pub async fn get_visits(
    state: State<'_, AppState>,
    guest_id: i32,
) -> Result<Vec<Visit>, ToastError> {
    Ok(get_visits_from_guest_id(&state, guest_id)
        .await?
        .iter()
        .map(|visit| {
            let VisitRow {
                visit_id,
                pass_id,
                created_at,
            } = visit.clone();
            Visit {
                visit_id,
                pass_id,
                created_at: created_at.unix_timestamp() * 1000,
            }
        })
        .collect())
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
        favorite,
        notes,
        creator,
        expires_at,
        created_at,
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
        favorite,
        notes,
        creator,
        expires_at: expires_at.map(|utime| utime.unix_timestamp() * 1000),
        created_at: created_at.unix_timestamp() * 1000,
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
        created_at,
    } = get_guest_from_id(&state, guest_id).await?;

    Ok(ViewGuestData {
        guest_id,
        first_name,
        last_name,
        town,
        email,
        notes,
        creator,
        created_at: created_at.unix_timestamp() * 1000,
    })
}

#[tauri::command(async)]
pub async fn search_passes(
    state: State<'_, AppState>,
    search: &str,
) -> Result<Vec<SearchPassData>, ToastError> {
    let passes = search_all_passes(&state, search.trim()).await?;
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
                favorite: pass_data.favorite,
                creator: pass_data.creator,
                expires_at: pass_data
                    .expires_at
                    .map(|unix_time| unix_time.unix_timestamp() * 1000),
                created_at: pass_data.created_at.unix_timestamp() * 1000,
            }
        })
        .collect();
    Ok(result)
}

#[tauri::command(async)]
pub async fn favorite_passes(
    state: State<'_, AppState>,
) -> Result<Vec<SearchPassData>, ToastError> {
    let passes = get_favorite_passes(&state).await?;
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
                favorite: pass_data.favorite,
                creator: pass_data.creator,
                expires_at: pass_data
                    .expires_at
                    .map(|unix_time| unix_time.unix_timestamp() * 1000),
                created_at: pass_data.created_at.unix_timestamp() * 1000,
            }
        })
        .collect();
    Ok(result)
}
