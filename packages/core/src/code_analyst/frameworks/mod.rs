use super::CodeLanguage;

pub mod nodets;

pub fn detect_framework_from_path(
    project_dir: &str,
    language: &CodeLanguage,
) -> super::types::Framework {
    match language {
        CodeLanguage::Javascript => {
            // todo: javascript should be different
            let framework = super::frameworks::nodets::detect_nodets_framework(project_dir);
            if let Some(framework) = framework {
                return framework;
            }
            if crate::frameworks::next::is_valid_project(project_dir) {
                return super::types::Framework::Next;
            }
            if crate::frameworks::node_react::is_valid_project(project_dir) {
                return super::types::Framework::React;
            }
        }
        CodeLanguage::Rust => {
            // todo: detect tauri
            return super::types::Framework::Unknown;
        }
        CodeLanguage::Lua => {
            return super::types::Framework::Unknown;
        }
        CodeLanguage::Unknown => {
            return super::types::Framework::Unknown;
        }
    }
    super::types::Framework::Unknown
}

pub fn is_dependencies_installed(project_dir: &str, language: &CodeLanguage) -> Option<bool> {
    match language {
        CodeLanguage::Javascript => {
            return Some(super::dependencies::nodets::is_dependencies_installed(
                project_dir,
            ));
        }
        _ => None,
    }
}

pub fn get_local_server_commands(
    project_dir: &str,
    code_language: &CodeLanguage,
    _framework: &super::types::Framework,
) -> Result<Vec<String>, String> {
    // read projectJson at project_dir
    match code_language {
        CodeLanguage::Javascript => Ok(node_commands(project_dir).unwrap_or(vec![])),
        CodeLanguage::Rust => Ok(vec![]),
        CodeLanguage::Lua => Ok(vec![]),
        CodeLanguage::Unknown => Ok(vec![]),
    }
}

fn node_commands(project_dir: &str) -> Result<Vec<String>, Box<dyn std::error::Error>> {
    let project_json_path = std::path::Path::new(project_dir).join("package.json");
    let project_json = match std::fs::read_to_string(project_json_path) {
        Ok(project_json) => project_json,
        Err(_) => return Ok(vec![]),
    };
    let project_json: serde_json::Value = serde_json::from_str(&project_json)?;
    let project_json_scripts = &project_json["scripts"]
        .as_object()
        .expect("invalid Package.json scripts")
        .to_owned();
    let mut commands = vec![];
    for (key, _value) in project_json_scripts {
        let is_start = key.contains("start");
        let is_dev = key.contains("dev");
        if is_start == true || is_dev == true {
            commands.push(format!("npm run {}", key));
        }
    }
    Ok(commands)
}
