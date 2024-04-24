// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::{CustomMenuItem, Menu, MenuItem, Submenu};

pub mod api;
pub mod database;

use api::{async_sleep, create_pass, get_guest, log_visit, search_passes};

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
