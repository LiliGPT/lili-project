use crate::{
    code_analyst::languages::javascript::get_dependency_version,
    io::{LocalPath, RelativeFileSearcher},
};

pub fn is_valid_project(project_dir: &str) -> bool {
    // Check if package.json exists
    match get_dependency_version(project_dir, "react") {
        Ok(_) => return true,
        Err(_) => {}
    };
    // search for any files with jsx or tsx extension
    let project_dir_path = LocalPath(project_dir.to_string());
    let searcher = RelativeFileSearcher::new(&project_dir_path);
    let files = searcher.find_files_with_extensions(vec!["jsx", "tsx"]);
    if files.len() > 0 {
        return true;
    }
    false
}
