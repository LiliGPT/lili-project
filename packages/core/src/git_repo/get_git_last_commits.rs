use anyhow::Result;

use crate::shell::run_shell_command;

use super::get_current_branch_name;

#[derive(Debug, Clone)]
pub struct GitCommit {
    pub hash: String,
    pub message: String,
}

pub fn get_git_last_commits(project_dir: &str) -> Result<Vec<GitCommit>> {
    // let output = run_shell_command("git log --pretty=format:'%s' -n 10", project_dir);
    // let list = output
    //     .stdout
    //     .split("\n")
    //     .map(|s| s.to_string())
    //     .filter(|s| !s.is_empty())
    //     .collect();
    let branch_name = get_current_branch_name(project_dir)?;
    let output = run_shell_command(
        &format!("git log --pretty=format:'%h__%s' -n 10 {}", branch_name),
        project_dir,
    );
    if output.success == false {
        return Err(anyhow::anyhow!("Failed: {}", output.stderr));
    }
    let list = output
        .stdout
        .split("\n")
        .map(|s| s.to_string())
        .filter(|s| !s.is_empty())
        .map(|s| {
            let s = s.trim_start_matches("'").trim_end_matches("'");
            let mut split = s.split("__");
            let hash = split.next().unwrap().to_string();
            let message = split.collect::<Vec<&str>>().join("__");
            GitCommit { hash, message }
        })
        .collect();
    Ok(list)
}
