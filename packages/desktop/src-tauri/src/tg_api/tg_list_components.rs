use crate::code_missions_api::{api_post, ApiError};
use serde::{Deserialize, Serialize};

use super::TgComponent;

#[derive(Debug, Deserialize, Serialize, Clone)]
pub struct TgListComponentsRequest {
    pub category: String,
}

pub async fn tg_list_components(
    request: TgListComponentsRequest,
) -> Result<Vec<TgComponent>, ApiError> {
    let access_token = crate::auth::get_access_token().unwrap_or_default();
    let response = api_post::<TgListComponentsRequest, Vec<TgComponent>>(
        &access_token,
        "/tailwind_generator/components",
        &request,
    )
    .await?;
    Ok(response.unwrap())
}
