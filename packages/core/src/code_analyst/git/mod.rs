mod repository_info;

pub use repository_info::get_repository_info;

use crate::{
    code_missions_api::ApiError,
    shell::{run_shell_command, RunShellCommandResult},
};

pub fn git_add(project_dir: &str, path: &str) -> Result<(), ApiError> {
    let command = format!("git add {}", path);
    let res: RunShellCommandResult = run_shell_command(&command, project_dir);
    let stderr = res.stderr.clone();
    if stderr.len() > 0 {
        return Err(ApiError {
            message: format!("Failed to add file to git: {}", stderr),
            status_code: 500,
        });
    }
    Ok(())
}

pub fn git_reset(project_dir: &str, path: &str) -> Result<(), ApiError> {
    let command = format!("git reset {}", path);
    let res: RunShellCommandResult = run_shell_command(&command, project_dir);
    let stderr = res.stderr.clone();
    if stderr.len() > 0 {
        return Err(ApiError {
            message: format!("Failed to reset file in git: {}", stderr),
            status_code: 500,
        });
    }
    Ok(())
}

pub fn git_commit(project_dir: &str, message: &str) -> Result<(), ApiError> {
    let command = format!("git commit -m '{}'", message);
    let res: RunShellCommandResult = run_shell_command(&command, project_dir);
    let stderr = res.stderr.clone();
    if stderr.len() > 0 {
        return Err(ApiError {
            message: format!("Failed to commit file in git: {}", stderr),
            status_code: 500,
        });
    }
    Ok(())
}

pub fn git_custom(
    project_dir: &str,
    command: &str,
    args: &str,
) -> Result<RunShellCommandResult, ApiError> {
    let command = format!("git {} {}", command, args);
    let res: RunShellCommandResult = run_shell_command(&command, project_dir);
    Ok(res)
}
