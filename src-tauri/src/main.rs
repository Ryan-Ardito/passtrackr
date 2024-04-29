// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::{fs::File, io::BufReader, time::Duration};

use serde::{Deserialize, Serialize};
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

// const USERNAME: &str = "postgres";
// const PASSWORD: &str = "joyful";
// const DB_HOST: &str = "172.22.0.22";
// const DB_NAME: &str = "passtracker-dev";

// const USERNAME: &str = "postgres";
// const PASSWORD: &str = "joyful_journey";
// const DB_HOST: &str = "35.247.29.177";
// const DB_NAME: &str = "passtracker";

pub struct AppState {
    pg_pool: PgPool,
}

#[derive(Debug, Deserialize, Serialize)]
struct DatabaseConfig {
    username: String,
    password: String,
    host_ip: String,
    db_name: String,
    port: u16,
}

fn connection_options(file_path: &str) -> PgConnectOptions {
    let file = File::open(file_path).expect("Could not open config.json!");
    let reader = BufReader::new(file);
    let config: DatabaseConfig =
        serde_json::from_reader(reader).expect("Failed to parse config.json");
    PgConnectOptions::new()
        .username(&config.username)
        .password(&config.password)
        .host(&config.host_ip)
        .database(&config.db_name)
        .port(config.port)
}

fn create_pool(conn_opts: PgConnectOptions) -> PgPool {
    PgPoolOptions::new()
        .max_connections(6)
        .acquire_timeout(Duration::from_secs(10))
        .connect_lazy_with(conn_opts)
}

#[tokio::main]
async fn main() {
    let conn_opts = connection_options("resources/config.json");
    let pg_pool = create_pool(conn_opts);
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
