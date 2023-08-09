use anyhow::Result;

use crate::shell::run_shell_command;

pub fn git_add_temporary_commit(project_dir: &str, execution_id: Option<String>) -> Result<()> {
    let now_timestamp = std::time::SystemTime::now()
        .duration_since(std::time::UNIX_EPOCH)
        .unwrap()
        .as_secs();
    run_shell_command("git add .", project_dir);
    let temp_message = match execution_id {
        Some(execution_id) => format!("execution-{}", execution_id),
        None => String::from(""),
    };
    let command = format!(
        "git commit -m \"chore(temp): {} {}\"",
        now_timestamp, temp_message
    );
    let _shell_res = run_shell_command(&command, project_dir);
    Ok(())
}
