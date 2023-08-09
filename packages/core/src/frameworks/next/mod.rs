use crate::{
    code_analyst::languages::javascript::get_dependency_version,
    io::{LocalPath, RelativeFileSearcher},
};

pub fn is_valid_project(project_dir: &str) -> bool {
    // Check if package.json exists
    match get_dependency_version(project_dir, "next") {
        Ok(_) => return true,
        Err(_) => {}
    };
    let mut has_dir_ok = false;
    // Check if app directory exists
    let app_dir = std::path::Path::new(project_dir).join("app");
    if app_dir.exists() {
        has_dir_ok = true;
    }
    // Check if pages directory exists
    let pages_dir = std::path::Path::new(project_dir).join("pages");
    if pages_dir.exists() {
        has_dir_ok = true;
    }
    // Check if src/pages directory exists
    let src_pages_dir = std::path::Path::new(project_dir).join("src").join("pages");
    if !src_pages_dir.exists() {
        has_dir_ok = true;
    }
    // Check if src/app directory exists
    let src_app_dir = std::path::Path::new(project_dir).join("src").join("app");
    if !src_app_dir.exists() {
        has_dir_ok = true;
    }
    if !has_dir_ok {
        return false;
    }
    // search for any files with jsx or tsx extension
    let project_dir_path = LocalPath(project_dir.to_string());
    let searcher = RelativeFileSearcher::new(&project_dir_path);
    let files = searcher.find_files_with_extensions(vec!["jsx", "tsx"]);
    if files.len() > 0 {
        return true;
    }
    false
}
