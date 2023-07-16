use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Debug)]
pub struct PlatformError {
    pub error_code: String,
    pub error_description: String,
}

impl PlatformError {
    pub fn new(error_code: &str, error_description: &str) -> PlatformError {
        PlatformError {
            error_code: error_code.to_string(),
            error_description: error_description.to_string(),
        }
    }

    pub fn reqwest(error: reqwest::Error, error_description: &str) -> PlatformError {
        PlatformError {
            error_code: format!("http-{}", error.status().unwrap().as_str()),
            error_description: error_description.to_string(),
        }
    }
}
