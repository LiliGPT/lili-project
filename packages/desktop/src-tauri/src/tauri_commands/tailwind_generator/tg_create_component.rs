use crate::{
    code_missions_api::ApiError,
    tg_api::{tg_create_component as _tg_create_component, TgComponent, TgCreateComponentRequest},
};

#[tauri::command]
pub async fn tg_create_component(
    request: TgCreateComponentRequest,
) -> Result<TgComponent, ApiError> {
    let result = _tg_create_component(request).await?;
    Ok(result)
}
