use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct SetApprovedRequest {
    pub execution_id: String,
}
