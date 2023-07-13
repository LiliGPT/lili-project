use tauri::{AppHandle, GlobalShortcutManager, Manager};

pub fn setup(app_handle: AppHandle) {
    app_handle
        .global_shortcut_manager()
        .register("Alt+M", show_popup_create_mission);
    // app_handle
    //     .global_shortcut_manager()
    //     .register("Escape", move || close_popup_create_mission(&app_handle));
}

fn show_popup_create_mission() {
    println!("Alt+M pressed");
}

fn close_popup_create_mission(app_handle: &AppHandle) {
    println!("Esc pressed");
    app_handle
        .get_window("mission_popup")
        .unwrap()
        .close()
        .unwrap();
}
