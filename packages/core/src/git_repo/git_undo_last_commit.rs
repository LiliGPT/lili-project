use anyhow::{anyhow, Result};

use crate::shell::run_shell_command;

pub fn git_undo_last_commit(project_dir: &str) -> Result<()> {
    let commands = vec!["git reset --hard HEAD~1"];
    for command in commands {
        let result = run_shell_command(command, project_dir);
        if !result.stderr.is_empty() {
            return Err(anyhow!(
                "Error executing command: '{}'\n{}\n",
                command,
                result.stderr
            ));
        }
    }
    Ok(())
}
