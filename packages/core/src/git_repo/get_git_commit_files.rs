use anyhow::Result;

use crate::shell::run_shell_command;

#[derive(Debug, Clone)]
pub struct GitCommitFile {
    pub path: String,
    pub status: String,
}

pub fn get_git_commit_files(commit_hash: &str, project_dir: &str) -> Result<Vec<GitCommitFile>> {
    let output = run_shell_command(
        &format!("git show --pretty= --name-status {}", commit_hash),
        project_dir,
    );
    if !output.success {
        anyhow::bail!(output.stderr);
    }
    // println!("output: {:?}", output);
    let list = output
        .stdout
        .split("\n")
        .map(|s| s.to_string())
        .filter(|s| !s.is_empty())
        .map(|s| {
            let mut split = s.split_ascii_whitespace();
            let status = split.next().unwrap_or("").to_string();
            let path = split.next().unwrap_or("").to_string();
            GitCommitFile { path, status }
        })
        .collect();
    Ok(list)
}
