use crate::{configjson, error::PlatformError};

use super::{AuthLoginRequest, AuthLoginResponse};

pub async fn auth_login(request: AuthLoginRequest) -> Result<AuthLoginResponse, PlatformError> {
    // --- login to keycloak
    let client = reqwest::Client::new();
    let login_endpoint = "https://liligpt-auth.giovannefeitosa.com/auth/realms/liligpt/protocol/openid-connect/token";
    let response = client
        .post(login_endpoint)
        .form(&[
            ("grant_type", "password"),
            ("client_id", "liligpt_backend"),
            ("client_secret", "7fc42eea-3b13-4f5f-ac8e-0c68c934475a"),
            ("username", &request.username),
            ("password", &request.password),
        ])
        .send()
        .await;
    let response = match response {
        Ok(response) => response,
        Err(error) => {
            return Err(PlatformError::reqwest(
                error,
                "Error sending request to authentication server",
            ))
        }
    };
    if response.status() == 522 || response.status() == 521 {
        return Err(PlatformError::new(
            &format!("http-{}", response.status().as_str()),
            "Authentication server is down",
        ));
    }
    // --- parse text response (manually to prevent next function to panic)
    let response = match response.text().await {
        Ok(response) => response,
        Err(error) => {
            return Err(PlatformError::reqwest(
                error,
                "Error reading authentication server response",
            ))
        }
    };
    println!("Response: {:?}", &response);
    // --- parse json response
    let final_response = match serde_json::from_str::<AuthLoginResponse>(&response) {
        Ok(response) => response,
        Err(error) => {
            return Err(PlatformError::new(
                "json-parse",
                &format!("Error parsing authentication server response: {}", error),
            ))
        }
    };
    // --- save tokens to config.json
    configjson::set("access_token", &final_response.access_token);
    configjson::set("refresh_token", &final_response.refresh_token);
    // --- return
    Ok(final_response)
}
