use crate::rate_limit::RateLimitMe;

use super::{api_get, ApiError};

pub async fn rate_limit_get() -> Result<RateLimitMe, ApiError> {
    let access_token = crate::auth::get_access_token().unwrap_or_default();
    let response = api_get::<RateLimitMe>(&access_token, "/ratelimit/me").await?;
    match response {
        Some(response) => Ok(response),
        None => Err(ApiError {
            status_code: 500,
            message: "Failed to get rate limit".to_string(),
        }),
    }
}
