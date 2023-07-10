use std::{error::Error, process::Command, thread, time::Duration};

use crate::code_missions_api::ApiError;

#[tauri::command]
pub async fn open_terminal() -> Result<(), ApiError> {
    let project_dir = "/home";
    // todo: make this cross platform
    // todo: open project_dir instead of home directory
    internal_open_terminal(project_dir);
    Ok(())
}

fn internal_open_terminal(project_dir: &str) {
    let mut _child = Command::new("wt.exe")
        .arg("-w")
        .arg("0")
        .arg("new-tab")
        .spawn()
        .expect("Failed to open terminal");
}
