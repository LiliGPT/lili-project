use super::super::code_analyst;


#[tauri::command]
pub async fn rust_prompt_prepare(
    path: String,
    message: String,
) -> Result<impl serde::Serialize, String> {
    let path_info = code_analyst::get_path_info(&path)?;

    let prompt_request = path_info.get_prompter_request(&message).await?;
    Ok(prompt_request)
}
