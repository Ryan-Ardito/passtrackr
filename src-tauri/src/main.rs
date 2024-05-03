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
    add_visits, async_sleep, create_pass, delete_pass, edit_guest, get_config_error, get_guest,
    get_payments, get_visits, log_visit, search_passes, toggle_pass_active, ToastError,
};
// use tauri::Manager;

const CONFIG_FILEPATH: &str = "resources/config.json";

const DEFAULT_USERNAME: &str = "postgres";
const DEFAULT_PASSWORD: &str = "postgres";
const DEFAULT_HOST_IP: &str = "127.0.0.1";
const DEFAULT_DB_NAME: &str = "postgres";
const DEFAULT_PORT: u16 = 5432;

// const USERNAME: &str = "postgres";
// const PASSWORD: &str = "joyful_journey";
// const DB_HOST: &str = "35.247.29.177";
// const DB_NAME: &str = "passtracker";

pub struct AppState {
    pg_pool: PgPool,
    config_error: bool,
}

#[derive(Debug, Deserialize, Serialize)]
struct DatabaseConfig {
    username: String,
    password: String,
    host_ip: String,
    db_name: String,
    port: u16,
}

fn default_connection_options() -> PgConnectOptions {
    PgConnectOptions::new()
        .username(DEFAULT_USERNAME)
        .password(DEFAULT_PASSWORD)
        .host(DEFAULT_HOST_IP)
        .database(DEFAULT_DB_NAME)
        .port(DEFAULT_PORT)
}

fn connection_options(file_path: &str) -> Result<PgConnectOptions, ToastError> {
    let file = File::open(file_path)?;
    let reader = BufReader::new(file);
    let config: DatabaseConfig = serde_json::from_reader(reader)?;

    Ok(PgConnectOptions::new()
        .username(&config.username)
        .password(&config.password)
        .host(&config.host_ip)
        .database(&config.db_name)
        .port(config.port))
}

fn create_pool(conn_opts: PgConnectOptions) -> PgPool {
    PgPoolOptions::new()
        .max_connections(6)
        .acquire_timeout(Duration::from_secs(10))
        .connect_lazy_with(conn_opts)
}

#[tokio::main]
async fn main() {
    let (conn_opts, config_error) = match connection_options(CONFIG_FILEPATH) {
        Ok(opts) => (opts, false),
        Err(_) => (default_connection_options(), true),
    };
    let pg_pool = create_pool(conn_opts);
    let state = AppState {
        pg_pool,
        config_error,
    };

    tauri::Builder::default()
        .manage(state)
        .invoke_handler(tauri::generate_handler![
            get_config_error,
            get_visits,
            get_payments,
            create_pass,
            toggle_pass_active,
            delete_pass,
            get_guest,
            edit_guest,
            log_visit,
            add_visits,
            search_passes,
            async_sleep,
        ])
        .run(tauri::generate_context!())
        .expect("Fatal error!");
}
