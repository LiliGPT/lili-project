mod routes;

use std::{sync::Mutex, thread};

use actix_web::{middleware, web, App, HttpServer};
use tauri::AppHandle;

struct TauriAppState {
    app: Mutex<AppHandle>,
}

pub fn setup(handle: AppHandle) {
    let boxed_handle = Box::new(handle);
    thread::spawn(move || {
        start_server(*boxed_handle).unwrap();
    });
}

#[actix_web::main]
async fn start_server(app: AppHandle) -> std::io::Result<()> {
    let tauri_app = web::Data::new(TauriAppState {
        app: Mutex::new(app),
    });

    HttpServer::new(move || {
        App::new()
            .app_data(tauri_app.clone())
            .wrap(middleware::Logger::default())
            .service(routes::create_mission::handler)
    })
    .bind(("127.0.0.1", 18018))?
    .run()
    .await
}
