use crate::{code_analyst::git::get_repository_info, code_missions_api::api_error::ApiError};

use super::command_request::CommandRequest;

#[tauri::command]
pub async fn repository_info_command(request: CommandRequest) -> Result<RepositoryInfo, ApiError> {
    let project_dir = request.project_dir;
    let repository_info = get_repository_info(project_dir).await?;
    Ok(repository_info)
}
