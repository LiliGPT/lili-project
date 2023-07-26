use crate::code_missions_api::{api_post, ApiError};
use serde::{Deserialize, Serialize};

use super::TgComponent;

#[derive(Debug, Deserialize, Serialize, Clone)]
pub struct TgCreateComponentRequest {
    pub name: String,
    pub training_description: String,
    pub categories: Vec<String>,
    pub source_code: String,
}

pub async fn tg_create_component(
    request: TgCreateComponentRequest,
) -> Result<TgComponent, ApiError> {
    let access_token = crate::auth::get_access_token().unwrap_or_default();
    let response = api_post::<TgCreateComponentRequest, TgComponent>(
        &access_token,
        "/tailwind_generator/create_component",
        &request,
    )
    .await?;
    Ok(response.unwrap())
}
