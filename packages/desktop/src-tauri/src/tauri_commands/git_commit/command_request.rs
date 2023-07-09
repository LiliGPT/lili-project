#[derive(serde::Serialize, serde::Deserialize, Debug)]
pub struct CommandRequest {
    pub project_dir: String,
    pub message: String,
}
