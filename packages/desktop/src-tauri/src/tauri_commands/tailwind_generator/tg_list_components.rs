use crate::{
    code_missions_api::ApiError,
    tg_api::{tg_list_components as _tg_list_components, TgComponent, TgListComponentsRequest},
};

#[tauri::command]
pub async fn tg_list_components(
    request: TgListComponentsRequest,
) -> Result<Vec<TgComponent>, ApiError> {
    let result = _tg_list_components(request).await?;
    Ok(result)
}
