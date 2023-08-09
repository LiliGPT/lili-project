use self::javascript::{javascript_is_next, javascript_is_react};

pub mod javascript;
pub mod lua;
pub mod rust;

pub fn detect_code_language_from_path(
    project_dir: &str,
) -> Result<super::types::CodeLanguage, String> {
    // Javascript: NodeTs
    let nodets = crate::code_analyst::languages::javascript::detect_nodets(project_dir);
    if nodets.is_ok() {
        return Ok(super::types::CodeLanguage::Javascript);
    }
    // Javascript: NodeJs
    let nodejs = crate::code_analyst::languages::javascript::detect_nodejs(project_dir);
    if nodejs.is_ok() {
        return Ok(super::types::CodeLanguage::Javascript);
    }
    // Javascript: Next
    match javascript_is_next(project_dir) {
        true => return Ok(super::types::CodeLanguage::Javascript),
        false => {}
    };
    // Javascript: React
    match javascript_is_react(project_dir) {
        true => return Ok(super::types::CodeLanguage::Javascript),
        false => {}
    };
    // Rust
    match crate::code_analyst::languages::rust::is_valid_project(project_dir) {
        true => return Ok(super::types::CodeLanguage::Rust),
        false => {}
    };
    // Lua
    match crate::code_analyst::languages::lua::is_valid_project(project_dir) {
        true => return Ok(super::types::CodeLanguage::Lua),
        false => {}
    };
    Ok(super::types::CodeLanguage::Unknown)
}
