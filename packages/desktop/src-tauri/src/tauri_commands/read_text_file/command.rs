use crate::code_missions_api::ApiError;

#[tauri::command]
pub async fn read_text_file_command(path: String) -> Result<String, ApiError> {
    match std::fs::read_to_string(path) {
        Ok(content) => Ok(content),
        Err(e) => Err(ApiError {
            message: e.to_string(),
            status_code: 500,
        }),
    }
}
