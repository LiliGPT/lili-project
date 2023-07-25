use serde::{Deserialize, Serialize};

use super::{api_client::api_post, ApiError};

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct AskTailwindGeneratorRequest {
    source_code: String,
    message: String,
}

pub async fn ask_tailwind_generator(
    request: AskTailwindGeneratorRequest,
) -> Result<String, ApiError> {
    let access_token = crate::auth::get_access_token().unwrap_or_default();
    let response = api_post::<AskTailwindGeneratorRequest, String>(
        &access_token,
        "/tailwind_generator/ask",
        &request,
    )
    .await?;
    Ok(response.unwrap())
}
