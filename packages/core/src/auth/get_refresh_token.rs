use crate::configjson;

pub fn get_refresh_token() -> Option<String> {
    let refresh_token = configjson::get("refresh_token");
    refresh_token
}
