use serde::{Deserialize, Serialize};

#[derive(Debug, Deserialize, Serialize, Clone)]
pub struct TgComponent {
    pub _id: String,
    pub name: String,
    pub training_description: String,
    pub categories: Vec<String>,
    pub source_code: String,
    pub changelog: Vec<TgComponentChangelog>,
    pub created_at: String,
    pub updated_at: String,
}

#[derive(Debug, Deserialize, Serialize, Clone)]
pub struct TgComponentChangelog {
    pub _id: String,
    pub message: String,
    pub original_code: String,
    pub source_code: String,
    pub created_at: String,
}

#[derive(Debug, Deserialize, Serialize, Clone)]
pub struct TgCategory {
    pub _id: String,
    pub name: String,
    pub slug: String,
}
