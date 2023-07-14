use std::path::PathBuf;

use actix_web::{post, web::Json};
use tauri::AppHandle;

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
    create_mission_popup_window(app.clone(), &body.project_dir, &body.message);
    match crate::code_analyst::get_path_info(&body.project_dir) {
        Ok(info) => Ok(Json(info)),
        Err(e) => Err(actix_web::error::ErrorInternalServerError(e)),
    }
}

pub fn create_mission_popup_window(app: AppHandle, project_dir: &str, message: &str) {
    // hide the current window
    // let win = app.get_window("main").unwrap();
    // win.hide().unwrap();
    let url = format!(
        "mission_popup.html?project_dir={}&message={}",
        urlencoding::encode(project_dir),
        urlencoding::encode(message)
    );
    // create a new window
    let winurl = tauri::WindowUrl::App(PathBuf::from(url).into());
    let builder = tauri::WindowBuilder::new(&app, "mission_popup", winurl);
    builder
        .inner_size(1920.0, 1080.0)
        .maximized(false)
        .resizable(false)
        .always_on_top(true)
        .focused(true)
        .decorations(false)
        .transparent(true)
        .build()
        .unwrap();
    // builder
    //     .inner_size(700.0, 500.0)
    //     .maximizable(false)
    //     .resizable(false)
    //     .decorations(false)
    //     .always_on_top(true)
    //     .build()
    //     .unwrap();
}
