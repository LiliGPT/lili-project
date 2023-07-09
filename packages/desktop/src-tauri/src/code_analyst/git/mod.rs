use crate::{
    code_missions_api::ApiError,
    shell::{run_shell_command, RunShellCommandResult},
};

use super::{GitChangeType, GitLogEntry, GitStatusEntry, RepositoryInfo};

pub fn get_repository_info(project_dir: &str) -> Result<RepositoryInfo, ApiError> {
    let branch: String = get_repository_branch(project_dir)?;
    let git_status = get_git_status(project_dir)?;
    let diff_text = get_diff_text(project_dir);
    let log = get_git_log(project_dir)?;
    Ok(RepositoryInfo {
        project_dir: project_dir.to_owned(),
        branch,
        git_status,
        diff_text,
        log,
    })
}

fn get_repository_branch(project_dir: &str) -> Result<String, ApiError> {
    let command = "git branch --no-color --show-current";
    let res: RunShellCommandResult = run_shell_command(command, project_dir);
    let stdout = res.stdout.clone();
    let stderr = res.stderr.clone();
    if stderr.len() > 0 {
        return Err(ApiError {
            message: format!("Failed to get repository branch: {}", stderr),
            status_code: 500,
        });
    }
    if stdout.len() == 0 {
        return Err(ApiError {
            message: "Failed to get repository branch: No branch found".to_owned(),
            status_code: 500,
        });
    }
    Ok(stdout)
}

fn get_git_log(project_dir: &str) -> Result<Vec<GitLogEntry>, ApiError> {
    let command = "git --no-pager log --pretty=format:'%h|%an|%ad|%s' --date=iso-strict";
    let res: RunShellCommandResult = run_shell_command(command, project_dir);
    let stdout = res.stdout.clone();
    let stderr = res.stderr.clone();
    if stderr.len() > 0 {
        return Err(ApiError {
            message: format!("Failed to get git log: {}", stderr),
            status_code: 500,
        });
    }
    if stdout.len() == 0 {
        return Err(ApiError {
            message: "Failed to get git log: No entries found".to_owned(),
            status_code: 500,
        });
    }
    let mut entries: Vec<GitLogEntry> = Vec::new();
    for line in stdout.lines() {
        let line_split = line.split('|').collect::<Vec<&str>>();
        let (hash, author, datetime, message) = (
            line_split[0].to_owned(),
            line_split[1].to_owned(),
            line_split[2].to_owned(),
            line_split[3].to_owned(),
        );
        entries.push(GitLogEntry {
            hash,
            author,
            message,
            datetime,
        });
    }
    Ok(entries)
}

fn get_git_status(project_dir: &str) -> Result<Vec<GitStatusEntry>, ApiError> {
    let command = "git status --porcelain -u";
    let res: RunShellCommandResult = run_shell_command(command, project_dir);
    let stdout = res.stdout.clone();
    let stderr = res.stderr.clone();
    if stderr.len() > 0 {
        return Err(ApiError {
            message: format!("Failed to get unstaged files: {}", stderr),
            status_code: 500,
        });
    }
    if stdout.len() == 0 {
        return Err(ApiError {
            message: "Failed to get unstaged files: No files found".to_owned(),
            status_code: 500,
        });
    }
    let mut entries: Vec<GitStatusEntry> = Vec::new();
    for line in stdout.lines() {
        let entry = parse_git_status_line(line)?;
        entries.push(entry);
    }
    Ok(entries)
}

fn parse_git_status_line(line: &str) -> Result<GitStatusEntry, ApiError> {
    let mut chars = line.chars();
    let first_char = chars.next().unwrap();
    let second_char = chars.next().unwrap();
    let (is_staged, change_type): (bool, GitChangeType);
    (is_staged, change_type) = match (first_char, second_char) {
        ('?', '?') => (false, GitChangeType::Untracked),
        ('A', ' ') => (true, GitChangeType::Added),
        ('M', ' ') => (true, GitChangeType::Modified),
        ('D', ' ') => (true, GitChangeType::Deleted),
        (' ', 'M') => (false, GitChangeType::Modified),
        (' ', 'D') => (false, GitChangeType::Deleted),
        _ => {
            return Err(ApiError {
                message: format!("Failed to parse git status line: {}", line),
                status_code: 500,
            })
        }
    };
    let file_path = chars.as_str().trim();
    Ok(GitStatusEntry {
        file_path: file_path.to_owned(),
        is_staged,
        change_type,
    })
}

fn get_diff_text(project_dir: &str) -> String {
    let command = "git --no-pager diff -U";
    let res: RunShellCommandResult = run_shell_command(command, project_dir);
    let stdout = res.stdout.clone();
    let stderr = res.stderr.clone();
    if stderr.len() > 0 {
        print!("[get_diff_text] Failed to get diff text: {}", stderr);
        return "".to_owned();
    }
    if stdout.len() == 0 {
        return "".to_owned();
    }
    stdout
}
