use crate::{auth};

#[tauri::command]
pub async fn auth_login_platform(
) -> Result<impl serde::Serialize, String> {
  // configjson::set("auth.username", &request.username)?;
  // configjson::set("auth.password", &request.password)?;
  let response = auth::auth_login_platform().await.ok_or("auth_login_platform failed".to_string());
  response
}
