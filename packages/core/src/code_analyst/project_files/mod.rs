use crate::io::{LocalPath, RelativeFileSearcher};

use super::{languages::javascript, CodeLanguage, Framework};

mod nestts;

pub fn get_project_files(
    project_dir: LocalPath,
    code_language: &CodeLanguage,
    framework: &Framework,
) -> Vec<String> {
    match framework {
        Framework::NodeNest => return nestts::get_project_files(project_dir.clone()),
        _ => {}
    };

    match code_language {
        CodeLanguage::Javascript => {
            return get_files_with_exts(&project_dir, vec!["js", "jsx", "ts", "tsx"])
        }
        CodeLanguage::Rust => {
            return get_files_with_exts(&project_dir, vec!["rs"]);
        }
        CodeLanguage::Lua => {
            return get_files_with_exts(&project_dir, vec!["lua"]);
        }
        _ => {}
    };

    vec![]
}

fn get_files_with_exts(project_dir: &LocalPath, exts: Vec<&str>) -> Vec<String> {
    let base_dir = project_dir.0.clone();
    let searcher = RelativeFileSearcher::new(project_dir);
    let files = searcher.find_files_with_extensions(exts);
    let relative_files = files
        .iter()
        .map(|file| {
            file.replace(&base_dir, "")
                .trim_start_matches('/')
                .to_string()
        })
        .collect::<Vec<String>>();
    relative_files
}
