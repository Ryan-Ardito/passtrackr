// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::{sync::Arc, time::Duration};

use sqlx::{
    postgres::{PgConnectOptions, PgPoolOptions},
    PgPool,
};
use tauri::{async_runtime::Mutex, CustomMenuItem, Menu, MenuItem, Submenu};

pub mod api;
pub mod database;
pub mod queries;

use api::{add_visits, async_sleep, create_pass, get_guest, log_visit, search_passes};

// const PG_CONNECT_STRING: &str = "postgres://postgres:joyful@172.22.0.22/passtracker-dev";
// const PG_CONNECT_STRING: &str = "postgres://postgres:joyful_journey@35.247.29.177/passtracker";

const USERNAME: &str = "postgres";
const PASSWORD: &str = "joyful";
const DB_HOST: &str = "172.22.0.22";
const DB_NAME: &str = "passtracker-dev";

pub struct AppState {
    pg_pool: Arc<Mutex<PgPool>>,
}

fn connect_pool() -> PgPool {
    let conn_opts = PgConnectOptions::new()
        .username(USERNAME)
        .password(PASSWORD)
        .host(DB_HOST)
        .database(DB_NAME);

    PgPoolOptions::new()
        .min_connections(1)
        .max_connections(16)
        .acquire_timeout(Duration::from_secs(10))
        .connect_lazy_with(conn_opts)
}

#[tokio::main]
async fn main() {
    let pg_pool = connect_pool();
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
            add_visits,
            search_passes,
            async_sleep,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
