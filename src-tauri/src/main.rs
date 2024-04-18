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

// struct PassHoler {
//     id: u32,
//     first_name: String,
//     last_name: String,
//     town: String,
//     active: bool,
//     notes: String,
// }

// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
use std::sync::Mutex;

use serde::Serialize;
use tauri::{CustomMenuItem, Menu, MenuItem, State, Submenu};

struct Holders(Mutex<Vec<HolderData>>);

#[derive(Serialize, Debug, Clone)]
struct PassType {
    name: String,
    code: String,
}

#[derive(Serialize, Clone)]
struct HolderData {
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
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command(async)]
fn fetch_holders(search: &str, holders: State<Holders>) -> Result<Vec<HolderData>, String> {
    // std::thread::sleep(Duration::from_millis(200));

    let mut hldrs = holders.0.lock().unwrap();
    for i in 0..1_000 {
        let pass_type = PassType {
            name: format!("annual"),
            code: format!("Annual"),
        };
        let holder_data = HolderData {
            id: i + 64,
            first_name: format!("{search}{i}"),
            last_name: format!("smith{i}"),
            town: format!("Kokomo{i}"),
            remaining: 10,
            passtype: pass_type,
            active: i % 7 != 0,
            notes: format!("These are editable notes displayed to the user {i}."),
        };

        hldrs.push(holder_data);
    }

    Ok(hldrs.to_vec())
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
        .manage(Holders(Default::default()))
        .menu(menu)
        .on_menu_event(|event| match event.menu_item_id() {
            "dashboard" => event.window().emit("dashboard", "").unwrap(),
            "settings" => event.window().emit("settings", "").unwrap(),
            "about" => event.window().emit("about", "").unwrap(),
            // "quit" => std::process::exit(0),
            _ => (),
        })
        .invoke_handler(tauri::generate_handler![greet, fetch_holders])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
