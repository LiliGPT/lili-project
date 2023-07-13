use std::path::PathBuf;

use actix_web::{post, web::Json, Responder};
use tauri::{AppHandle, Manager};

use crate::code_analyst::PathInfo;

#[derive(serde::Deserialize)]
pub struct Body {
    project_dir: String,
    file_path: String,
    line: u32,
    column: u32,
    message: String,
}

#[post("/create_mission")]
pub async fn handler(
    body: Json<Body>,
    state: actix_web::web::Data<crate::server::TauriAppState>,
) -> actix_web::Result<Json<PathInfo>> {
    let app = state.app.lock().unwrap();
    create_mission_popup_window(app.clone());
    match crate::code_analyst::get_path_info(&body.project_dir) {
        Ok(info) => Ok(Json(info)),
        Err(e) => Err(actix_web::error::ErrorInternalServerError(e)),
    }
}

fn create_mission_popup_window(app: AppHandle) {
    // hide the current window
    // let win = app.get_window("main").unwrap();
    // win.hide().unwrap();
    // create a new window
    let winurl = tauri::WindowUrl::App(PathBuf::from("mission_popup.html").into());
    let builder = tauri::WindowBuilder::new(&app, "mission_popup", winurl);
    builder.build().unwrap();
}
