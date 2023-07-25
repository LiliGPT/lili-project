use crate::code_missions_api::{
    ask_tailwind_generator as _ask_tailwind_generator, ApiError, AskTailwindGeneratorRequest,
};

#[tauri::command]
pub async fn ask_tailwind_generator(
    request: AskTailwindGeneratorRequest,
) -> Result<String, ApiError> {
    let result = _ask_tailwind_generator(request).await?;
    Ok(result)
}
