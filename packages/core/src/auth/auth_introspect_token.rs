use anyhow::{anyhow, Result};

use super::KeycloakIntrospectTokenResponse;

pub async fn auth_introspect_token(access_token: &str) -> Result<KeycloakIntrospectTokenResponse> {
    let client = reqwest::Client::new();
    let endpoint = "https://liligpt-auth.giovannefeitosa.com/auth/realms/liligpt/protocol/openid-connect/token/introspect";
    let response = client
        .post(endpoint)
        .form(&[
            ("client_id", "liligpt_backend"),
            ("client_secret", "7fc42eea-3b13-4f5f-ac8e-0c68c934475a"),
            ("token", access_token),
        ])
        .timeout(std::time::Duration::from_secs(6))
        .send()
        .await;
    let response = match response {
        Ok(response) => response,
        Err(error) => {
            return Err(anyhow!(format!(
                "Failed to send request to auth server: {}",
                error
            )))
        }
    };
    let response = match response.text().await {
        Ok(response) => response,
        Err(error) => {
            return Err(anyhow!(
                "Failed to parse text response from auth server: {}",
                error
            ))
        }
    };
    let final_response = match serde_json::from_str::<KeycloakIntrospectTokenResponse>(&response) {
        Ok(response) => response,
        Err(error) => {
            return Err(anyhow!(
                "Failed to parse json response from auth server: {}",
                error
            ))
        }
    };
    Ok(final_response)
}
