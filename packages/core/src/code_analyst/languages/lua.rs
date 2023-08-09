use crate::io::{LocalPath, RelativeFileSearcher};

pub fn is_valid_project(project_dir: &str) -> bool {
    // search for any files with jsx or tsx extension
    let project_dir_path = LocalPath(project_dir.to_string());
    let searcher = RelativeFileSearcher::new(&project_dir_path);
    let files = searcher.find_files_with_extensions(vec!["lua"]);
    if files.len() > 0 {
        return true;
    }
    false
}
