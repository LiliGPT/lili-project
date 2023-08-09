use anyhow::Result;

use super::get_current_branch_name;

pub fn git_temporary_branch_create(project_dir: &str) -> Result<String> {
    // let branch_name = "master";
    let now_str = std::time::SystemTime::now()
        .duration_since(std::time::UNIX_EPOCH)?
        .as_secs()
        .to_string();
    let command = format!("git checkout -b temp-{}", now_str);
    let output = std::process::Command::new("git")
        .arg("checkout")
        .arg("-b")
        .arg(format!("temp-{}", now_str))
        .current_dir(project_dir)
        .output()?;
    if !output.status.clone().success() {
        let error_message = String::from_utf8(output.stderr.clone())?;
        anyhow::bail!(error_message);
    }
    Ok(String::from_utf8(output.stdout)?)
}
