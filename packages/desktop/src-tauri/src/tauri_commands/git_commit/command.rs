use crate::{code_analyst::git::git_commit, code_missions_api::ApiError};

use super::command_request::CommandRequest;

#[tauri::command]
pub async fn git_commit_command(request: CommandRequest) -> Result<(), ApiError> {
    let project_dir = &request.project_dir;
    let path = &request.path;
    git_commit(project_dir, path)?;
    Ok(())
}
