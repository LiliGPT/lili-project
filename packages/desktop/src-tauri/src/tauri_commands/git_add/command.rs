use crate::{code_analyst::git::git_add, code_missions_api::ApiError};

use super::command_request::CommandRequest;

#[tauri::command]
pub async fn git_add_command(request: CommandRequest) -> Result<(), ApiError> {
    let project_dir = &request.project_dir;
    let path = &request.path;
    let repository_info = git_add(project_dir, path)?;
    Ok(repository_info)
}
