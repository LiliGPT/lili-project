use serde::{Deserialize, Serialize};

use super::KeycloakDecodedAccessToken;

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct AuthLoginResponse {
    pub access_token: String,
    pub refresh_token: String,
}

impl AuthLoginResponse {
    pub fn decode_access_token(&self) -> Result<KeycloakDecodedAccessToken, String> {
        match KeycloakDecodedAccessToken::new(&self.access_token) {
            Ok(decoded_access_token) => Ok(decoded_access_token),
            Err(error) => Err(error.to_string()),
        }
    }
}
