// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
use std::{collections::HashMap, time::Duration};

use database::{log_visit_query, search_all_passes};
use serde::{Deserialize, Serialize};
use sqlx::{prelude::FromRow, PgPool};
use tauri::{CustomMenuItem, Menu, MenuItem, Submenu};

pub mod database;

const PG_CONNECT_STRING: &str = "postgres://postgres:joyful@172.17.0.2/passtracker-dev";

#[derive(Debug, Serialize, Clone)]
struct QueryError {
    name: String,
    message: String,
}

#[derive(Deserialize, Serialize, Debug, Clone)]
struct PassType {
    name: String,
    code: String,
}

#[derive(Deserialize, Serialize, Debug, Clone)]
struct PayMethod {
    name: String,
    code: String,
}

#[derive(Deserialize, Serialize, Clone)]
pub struct GuestData {
    guest_id: u64,
    first_name: String,
    last_name: String,
    town: String,
    email: String,
    notes: String,
    creator: String,
    creation_time: u64,
}

#[derive(Deserialize, Serialize, Clone, FromRow)]
pub struct Pass {
    pass_id: u64,
    guest_id: u64,
    passtype: String,
    remaining_uses: u64,
    active: bool,
    payment_method: String,
    amount_paid_cents: u64,
    creator: String,
    creation_time: i64,
}

#[derive(Deserialize, Serialize, Clone, FromRow)]
pub struct SearchPassRes {
    pass_id: i32,
    guest_id: i32,
    first_name: String,
    last_name: String,
    town: String,
    remaining_uses: i32,
    passtype: String,
    active: bool,
    creator: String,
    creation_time: i32,
}

#[derive(Deserialize, Serialize, Clone, FromRow)]
pub struct SearchPassData {
    pass_id: u64,
    guest_id: u64,
    first_name: String,
    last_name: String,
    town: String,
    remaining_uses: u64,
    passtype: PassType,
    active: bool,
    creator: String,
    creation_time: u64,
}

#[derive(Serialize, Deserialize, Clone)]
struct NewPassData {
    guest_id: Option<u64>,
    first_name: String,
    last_name: String,
    town: String,
    passtype: PassType,
    pay_method: PayMethod,
    last_four: Option<String>,
    amount_paid: Option<String>,
    signature: String,
}
#[tauri::command(async)]
async fn log_visit(
    pass: SearchPassData,
    delay_millis: u64,
    will_fail: bool,
) -> Result<(), QueryError> {
    if pass.remaining_uses < 1 {
        return Err(QueryError {
            name: "Log visit".to_string(),
            message: "No punches left".to_string(),
        });
    }
    let pass_id = pass.pass_id as i32;
    let pool = PgPool::connect(PG_CONNECT_STRING)
        .await
        .map_err(|err| QueryError {
            name: "Database error".to_string(),
            message: err.to_string(),
        })?;
    let res = log_visit_query(&pool, pass_id)
        .await
        .map_err(|err| QueryError {
            name: "Database error".to_string(),
            message: err.to_string(),
        });

    res
}

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
// #[tauri::command(async)]
// async fn log_visit(pass: SearchPassData, delay_millis: u64, will_fail: bool) -> Result<(), QueryError> {
//     if !pass.active {
//         panic!();
//     }
//     std::thread::sleep(Duration::from_millis(delay_millis));
//     match will_fail {
//         false => Ok(()),
//         true => Err(QueryError {
//             name: "Log visit".to_string(),
//             message: "failed".to_string(),
//         }),
//     }
// }

#[tauri::command(async)]
fn async_sleep(millis: u64) -> Result<(), String> {
    std::thread::sleep(Duration::from_millis(millis));
    Ok(())
}

#[tauri::command(async)]
fn create_pass(
    pass_data: NewPassData,
    delay_millis: u64,
    will_fail: bool,
) -> Result<String, QueryError> {
    std::thread::sleep(Duration::from_millis(delay_millis));

    match will_fail {
        false => Ok(pass_data.last_name),
        true => Err(QueryError {
            name: "Create pass".to_string(),
            message: "failed".to_string(),
        }),
    }
}

#[tauri::command(async)]
fn get_guest(guest_id: u64, delay_millis: u64, will_fail: bool) -> Result<String, QueryError> {
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
async fn search_passes(
    search: &str,
    delay_millis: u64,
    will_fail: bool,
) -> Result<Vec<SearchPassData>, QueryError> {
    let mut passtype_map = HashMap::new();
    passtype_map.insert("punch".to_string(), "Punch".to_string());
    passtype_map.insert("annual".to_string(), "Annual".to_string());
    passtype_map.insert("six_month".to_string(), "6 Month".to_string());
    passtype_map.insert("free_pass".to_string(), "Free Pass".to_string());
    passtype_map.insert("facial".to_string(), "Facial".to_string());

    let pool = PgPool::connect(PG_CONNECT_STRING)
        .await
        .map_err(|err| QueryError {
            name: "Database error".to_string(),
            message: err.to_string(),
        })?;
    let res = search_all_passes(&pool, search)
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
                    creation_time: pass_data.creation_time as u64,
                }
            })
            .collect()
    })
}

// #[tauri::command(async)]
// fn search_passes(
//     search: &str,
//     delay_millis: u64,
//     will_fail: bool,
// ) -> Result<Vec<SearchPassData>, QueryError> {
//     std::thread::sleep(Duration::from_millis(delay_millis));

//     let mut passes = Vec::new();
//     for i in 0..1_000 {
//         let pass_type = PassType {
//             name: format!("Annual"),
//             code: format!("annual"),
//         };
//         let pass_data = SearchPassData {
//             id: i + 64,
//             guest_id: i + 64,
//             first_name: format!("John{i}"),
//             last_name: format!("{search}{i}"),
//             town: format!("Kokomo{i}"),
//             remaining: 10 - i % 7,
//             passtype: pass_type,
//             active: i % 7 != 0,
//             creator: format!("dog"),
//             creation_time: 10,
//         };

//         passes.push(pass_data);
//     }

//     match will_fail {
//         false => Ok(passes),
//         true => Err(QueryError {
//             name: "Connection problem".to_string(),
//             message: "Unable to connect to database".to_string(),
//         }),
//     }
// }

fn main() {
    let dashboard = CustomMenuItem::new("dashboard".to_string(), "Dashboard");
    let settings = CustomMenuItem::new("settings".to_string(), "Settings...");
    // let close = CustomMenuItem::new("quit".to_string(), "Quit");
    let about = CustomMenuItem::new("about".to_string(), "About...");
    let submenu = Submenu::new(
        "File",
        Menu::new()
            .add_item(dashboard)
            .add_item(settings)
            .add_native_item(MenuItem::Separator)
            .add_item(about),
    );
    let menu = Menu::new()
        .add_native_item(MenuItem::Copy)
        .add_submenu(submenu);

    tauri::Builder::default()
        .menu(menu)
        .on_menu_event(|event| match event.menu_item_id() {
            "dashboard" => event.window().emit("dashboard", "").unwrap(),
            "settings" => event.window().emit("settings", "").unwrap(),
            "about" => event.window().emit("about", "").unwrap(),
            // "quit" => std::process::exit(0),
            _ => (),
        })
        .invoke_handler(tauri::generate_handler![
            create_pass,
            get_guest,
            log_visit,
            search_passes,
            async_sleep
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
