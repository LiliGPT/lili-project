use anyhow::Result;
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct KeycloakDecodedAccessToken {
    // hidden access_token field
    #[serde(skip)]
    access_token: String,

    pub exp: i64,
    pub iat: i64,
    pub jti: String,
    pub iss: String,
    pub aud: String,
    pub sub: String,
    pub typ: String,
    pub azp: String,
    pub session_state: String,
    pub acr: String,
    #[serde(rename = "allowed-origins")]
    pub allowed_origins: Vec<String>,
    pub realm_access: KeycloakRealmAccess,
    pub resource_access: KeycloakResourceAccess,
    pub scope: String,
    pub email_verified: bool,
    pub name: String,
    pub preferred_username: String,
    pub given_name: String,
    pub family_name: String,
    pub email: String,
}

impl KeycloakDecodedAccessToken {
    pub fn new(access_token: &str) -> Result<Self> {
        // decode jwt without verifying signature
        let mut validation = jsonwebtoken::Validation::default();
        validation.insecure_disable_signature_validation();
        let decoded = jsonwebtoken::decode::<KeycloakDecodedAccessToken>(
            access_token,
            &jsonwebtoken::DecodingKey::from_secret("".as_ref()),
            &validation,
        );
        match decoded {
            Ok(token_data) => Ok(token_data.claims),
            Err(error) => Err(anyhow::anyhow!(format!("Invalid access_token {}", error))),
        }
    }

    pub fn get_user_name(&self) -> Result<String> {
        // let user_name = self.preferred_username.clone(); // this is the email
        let user_name = self.name.clone();
        if user_name.is_empty() {
            Err(anyhow::anyhow!("User name is empty"))
        } else {
            Ok(user_name)
        }
    }
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct KeycloakIntrospectTokenResponse {
    pub exp: i64,
    pub iat: i64,
    pub jti: String,
    pub iss: String,
    pub aud: String,
    pub sub: String,
    pub typ: String,
    pub azp: String,
    pub session_state: String,
    pub name: String,
    pub given_name: String,
    pub family_name: String,
    pub preferred_username: String,
    pub email: String,
    pub email_verified: bool,
    pub acr: String,
    #[serde(rename = "allowed-origins")]
    pub allowed_origins: Vec<String>,
    pub realm_access: KeycloakRealmAccess,
    pub resource_access: KeycloakResourceAccess,
    pub scope: String,
    pub client_id: String,
    pub username: String,
    pub active: bool,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct KeycloakRealmAccess {
    pub roles: Vec<String>,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct KeycloakResourceAccess {
    pub account: KeycloakResourceAccessDetails,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct KeycloakResourceAccessDetails {
    pub roles: Vec<String>,
}
