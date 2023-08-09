use super::{AuthLoginResponse};

pub async fn auth_login_platform() -> Option<AuthLoginResponse> {
    let access_token = super::get_access_token();
    let refresh_token = super::get_refresh_token();

    if access_token.is_none() || refresh_token.is_none() {
        return None;
    }

    return Some(AuthLoginResponse {
        access_token: access_token.unwrap(),
        refresh_token: refresh_token.unwrap(),
    })
}