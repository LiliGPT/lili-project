#[derive(Debug, strum::Display, serde::Serialize, serde::Deserialize, Default, Clone)]
pub enum CodeLanguage {
    Javascript,
    // JavascriptJs,
    // JavascriptTs,
    #[default]
    Unknown,
}

#[derive(Debug, strum::Display, serde::Serialize, serde::Deserialize, Default, Clone)]
pub enum Framework {
    // instead of serializing as NodeTs, I want to serialize as Nest
    NodeNest,
    NodeExpress,
    Tauri,
    #[default]
    Unknown,
}

#[derive(Debug, serde::Serialize, serde::Deserialize)]
pub struct SubprojectDescriptor {
    pub name: String,
    pub path: String,
    pub code_language: CodeLanguage,
    pub framework: Framework,
}

#[derive(Debug, serde::Serialize, Default)]
pub struct PathInfo {
    pub project_dir: String,
    pub code_language: CodeLanguage,
    pub framework: Framework,
    pub dependencies_installed: bool,
    pub local_server_commands: Vec<String>,
    pub subprojects: Vec<SubprojectDescriptor>,
    pub test_scripts: serde_json::Map<String, serde_json::Value>,
}

#[derive(Debug, serde::Serialize, Default)]
pub struct RepositoryInfo {
    pub project_dir: String,
    pub branch: String,
    pub git_status: Vec<GitStatusEntry>,
    pub diff_text: String,
    pub log: Vec<GitLogEntry>,
}

#[derive(Debug, serde::Serialize)]
pub struct GitStatusEntry {
    pub file_path: String,
    pub is_staged: bool,
    pub change_type: GitChangeType,
}

#[derive(Debug, serde::Serialize, strum::Display)]
pub enum GitChangeType {
    Added,
    Modified,
    Deleted,
    Untracked,
}

#[derive(Debug, serde::Serialize)]
pub struct GitLogEntry {
    pub hash: String,
    pub author: String,
    pub datetime: String,
    pub message: String,
}
