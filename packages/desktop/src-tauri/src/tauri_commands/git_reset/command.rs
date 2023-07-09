use crate::{code_analyst::git::git_reset, code_missions_api::ApiError};

use super::command_request::CommandRequest;

#[tauri::command]
pub async fn git_reset_command(request: CommandRequest) -> Result<(), ApiError> {
    let project_dir = &request.project_dir;
    let path = &request.path;
    git_reset(project_dir, path)?;
    Ok(())
}
