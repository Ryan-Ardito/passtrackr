// enum PayMethod {
//     Cash,
//     Credit(u32),
// }

// struct Pass {
//     holder_id: u32,
//     passtype: PassType,
//     remaining: u32,
//     pay_method: PayMethod,
//     amount_paid: u32,
//     signature: String,
// }

// struct PassHolder {
//     id: u32,
//     first_name: String,
//     last_name: String,
//     town: String,
//     active: bool,
//     notes: String,
// }

// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
use std::time::Duration;

use serde::Serialize;
use tauri::{CustomMenuItem, Menu, MenuItem, Submenu};

#[derive(Debug, Serialize)]
struct QueryError {
    name: String,
    message: String,
}

#[derive(Serialize, Debug, Clone)]
struct PassType {
    name: String,
    code: String,
}

#[derive(Serialize, Clone)]
struct PassData {
    id: u32,
    first_name: String,
    last_name: String,
    town: String,
    remaining: u32,
    passtype: PassType,
    active: bool,
    notes: String,
}

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command(async)]
fn log_visit(delay_millis: u64, will_fail: bool) -> Result<(), QueryError> {
    std::thread::sleep(Duration::from_millis(delay_millis));
    // std::thread::sleep(Duration::from_millis(200));
    // Err(format!("{}", pass_id))
    match will_fail {
        false => Ok(()),
        true => Err(QueryError {
            name: "Log visit".to_string(),
            message: "failed".to_string(),
        }),
    }
}

#[tauri::command(async)]
fn async_sleep(millis: u64) -> Result<(), String> {
    std::thread::sleep(Duration::from_millis(millis));
    Ok(())
}

#[tauri::command(async)]
fn create_pass(
    pass_data: String,
    delay_millis: u64,
    will_fail: bool,
) -> Result<String, QueryError> {
    std::thread::sleep(Duration::from_millis(delay_millis));

    match will_fail {
        false => Ok(pass_data),
        true => Err(QueryError {
            name: "Connection problem".to_string(),
            message: "Unable to connect to database".to_string(),
        }),
    }
}

#[tauri::command(async)]
fn search_passes(
    search: &str,
    delay_millis: u64,
    will_fail: bool,
) -> Result<Vec<PassData>, QueryError> {
    std::thread::sleep(Duration::from_millis(delay_millis));

    let mut passes = Vec::new();
    for i in 0..300 {
        let pass_type = PassType {
            name: format!("Annual"),
            code: format!("annual"),
        };
        let pass_data = PassData {
            id: i + 64,
            first_name: format!("John{i}"),
            last_name: format!("{search}{i}"),
            town: format!("Kokomo{i}"),
            remaining: 10,
            passtype: pass_type,
            active: i % 7 != 0,
            notes: format!("These are editable notes displayed to the user {i}."),
        };

        passes.push(pass_data);
    }

    match will_fail {
        false => Ok(passes),
        true => Err(QueryError {
            name: "Connection problem".to_string(),
            message: "Unable to connect to database".to_string(),
        }),
    }
}

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
            log_visit,
            search_passes,
            async_sleep
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
