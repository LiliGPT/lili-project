use anyhow::Result;

pub fn get_last_commit_message(project_dir: &str) -> Result<String> {
    let project_dir = project_dir.to_string();
    let output = std::process::Command::new("git")
        .arg("log")
        .arg("-1")
        .arg("--pretty=%B")
        .current_dir(project_dir)
        .output()?;
    if !output.status.clone().success() {
        let error_message = String::from_utf8(output.stderr.clone())?;
        anyhow::bail!(error_message);
    }
    Ok(String::from_utf8(output.stdout)?)
}
