// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::time::Duration;

use sqlx::{
    postgres::{PgConnectOptions, PgPoolOptions},
    PgPool,
};

pub mod api;
pub mod database;
pub mod queries;

use api::{
    add_visits, async_sleep, create_pass, delete_pass, get_guest, log_visit, search_passes,
    toggle_pass_active,
};

// const PG_CONNECT_STRING: &str = "postgres://postgres:joyful@172.22.0.22/passtracker-dev";
// const PG_CONNECT_STRING: &str = "postgres://postgres:joyful_journey@35.247.29.177/passtracker";

const USERNAME: &str = "postgres";
const PASSWORD: &str = "joyful";
const DB_HOST: &str = "172.22.0.22";
const DB_NAME: &str = "passtracker-dev";

// const USERNAME: &str = "postgres";
// const PASSWORD: &str = "joyful_journey";
// const DB_HOST: &str = "35.247.29.177";
// const DB_NAME: &str = "passtracker";

pub struct AppState {
    pg_pool: PgPool,
}

fn connect_pool() -> PgPool {
    let conn_opts = PgConnectOptions::new()
        .username(USERNAME)
        .password(PASSWORD)
        .host(DB_HOST)
        .database(DB_NAME)
        .port(5432);

    PgPoolOptions::new()
        .max_connections(6)
        .acquire_timeout(Duration::from_secs(10))
        .connect_lazy_with(conn_opts)
}

#[tokio::main]
async fn main() {
    let pg_pool = connect_pool();
    let state = AppState { pg_pool };

    tauri::Builder::default()
        .manage(state)
        .invoke_handler(tauri::generate_handler![
            create_pass,
            toggle_pass_active,
            delete_pass,
            get_guest,
            log_visit,
            add_visits,
            search_passes,
            async_sleep,
        ])
        .run(tauri::generate_context!())
        .expect("Fatal error!");
}
