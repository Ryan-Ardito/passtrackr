// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::sync::Arc;

use database::QueryError;
use sqlx::PgPool;
use tauri::{async_runtime::Mutex, CustomMenuItem, Menu, MenuItem, Submenu};

pub mod api;
pub mod database;
pub mod queries;

use api::{async_sleep, create_pass, get_guest, log_visit, search_passes};

const PG_CONNECT_STRING: &str = "postgres://postgres:joyful@172.22.0.22/passtracker-dev";

pub struct AppState {
    pg_pool: Arc<Mutex<PgPool>>,
}

fn connect_pool() -> Result<PgPool, QueryError> {
    PgPool::connect_lazy(PG_CONNECT_STRING).map_err(|err| QueryError {
        name: "Database error".to_string(),
        message: err.to_string(),
    })
}

#[tokio::main]
async fn main() {
    let pg_pool = connect_pool().expect("Fatal error!");
    let state = AppState {
        pg_pool: Arc::new(Mutex::new(pg_pool)),
    };

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
        .manage(state)
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
            async_sleep,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
