use super::ApiError;

pub async fn api_post_raw<Request: serde::ser::Serialize>(
    access_token: &str,
    uri: &str,
    json_request: &Request,
) -> Result<Option<String>, ApiError> {
    let http_client = reqwest::Client::new();
    let response = http_client
        .post(&format!(
            "{}{}",
            std::env::var("PROMPTER_URL").unwrap(),
            uri
        ))
        .bearer_auth(access_token)
        .json(json_request)
        .send()
        .await;
    let response = match response {
        Ok(response) => response,
        Err(err) => {
            return Err(ApiError::from(
                err,
                format!("Failed to send request to POST {}", uri).as_str(),
            ))
        }
    };

    match response.status() {
        reqwest::StatusCode::OK | reqwest::StatusCode::CREATED => {
            let response_text = &response.text().await.unwrap_or("".to_string());
            if response_text.is_empty() {
                Ok(None)
            } else {
                Ok(Some(response_text.to_string()))
            }
        }
        reqwest::StatusCode::NO_CONTENT => Ok(None),
        _ => {
            let response_status = response.status().as_u16() as i32;
            let response_text = &response.text().await.unwrap_or("Unknown error".to_string());
            Err(ApiError {
                status_code: response_status,
                message: response_text.to_string(),
            })
        }
    }
}

pub async fn api_post<Request: serde::ser::Serialize, Response: serde::de::DeserializeOwned>(
    access_token: &str,
    uri: &str,
    json_request: &Request,
) -> Result<Option<Response>, ApiError> {
    let response = api_post_raw(access_token, uri, json_request).await?;
    match response {
        Some(response) => {
            let response: Response = serde_json::from_str(&response).unwrap();
            Ok(Some(response))
        }
        None => Ok(None),
    }
}
