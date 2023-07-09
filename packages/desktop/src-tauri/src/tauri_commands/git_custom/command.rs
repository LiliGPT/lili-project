use crate::{
    code_analyst::git::git_custom, code_missions_api::ApiError, shell::RunShellCommandResult,
};

#[derive(serde::Serialize, serde::Deserialize, Debug)]
pub struct CommandRequest {
    pub project_dir: String,
    pub command: String,
    pub args: String,
}

#[tauri::command]
pub async fn git_custom_command(
    request: CommandRequest,
) -> Result<RunShellCommandResult, ApiError> {
    let project_dir = &request.project_dir;
    let command = &request.command;
    let args = &request.args;
    let repository_info = git_custom(project_dir, command, args)?;
    Ok(repository_info)
}
