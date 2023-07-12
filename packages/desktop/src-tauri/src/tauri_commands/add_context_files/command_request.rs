use serde::{Deserialize, Serialize};



#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct CommandRequest {
    pub execution_id: String,
    pub project_dir: String,
}
