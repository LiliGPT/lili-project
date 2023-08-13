use anyhow::Result;

use crate::{
    code_missions_api::{MissionAction, MissionActionType},
    shell::run_shell_command,
};

pub fn run_actions(project_dir: &str, actions: &Vec<MissionAction>) -> Result<()> {
    for action in actions {
        match action.action_type {
            MissionActionType::CreateFile => {
                let file_path = format!("{}/{}", project_dir, action.path);
                let file_path = std::path::Path::new(&file_path);
                // create directory with mkdir -p
                let parent = file_path.parent().unwrap();
                let _mkdir = std::fs::create_dir_all(parent).ok();
                // create file with content
                std::fs::write(file_path, &action.content).ok()
            }
            MissionActionType::UpdateFile => {
                let file_path = format!("{}/{}", project_dir, action.path);
                let file_path = std::path::Path::new(&file_path);
                // overwrite file with content
                std::fs::write(file_path, &action.content).ok()
            } // MissionActionType::DeleteFile => {
              //     let file_path = format!("{}/{}", path, action.path);
              //     let file_path = std::path::Path::new(&file_path);
              //     // delete file
              //     std::fs::remove_file(file_path).ok()
              // }
        };
    }
    Ok(())
}

pub fn open_file_in_editor(project_dir: &str, relative_path: &str) -> Result<()> {
    if cfg!(windows) {
        open::that(format!("{}/{}", project_dir, relative_path))?;
    } else if cfg!(unix) {
        // this works in wsl
        // let file_path = format!("{}/{}", project_dir, relative_path);
        // let file_path = std::path::Path::new(&file_path);
        // open file in editor
        run_shell_command("code .", project_dir);
        std::thread::sleep(std::time::Duration::from_secs(1));
        run_shell_command(&format!("code {}", relative_path), project_dir);
    }
    Ok(())
}
