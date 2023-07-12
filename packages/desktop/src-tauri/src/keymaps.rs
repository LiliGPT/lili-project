use tauri::{AppHandle, GlobalShortcutManager};

pub fn setup(app_handle: AppHandle) {
    app_handle
        .global_shortcut_manager()
        .register("Alt+M", show_popup_create_mission);
}

fn show_popup_create_mission() {
    println!("Alt+M pressed");
}
