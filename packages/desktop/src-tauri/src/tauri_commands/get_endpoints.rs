use std::path::Path;

use crate::{
    code_analyst::Framework,
    frameworks::node_nest::{get_file_endpoints, NestEndpoint},
    io::LocalPath,
};

#[tauri::command]
pub fn get_endpoints(project_dir: &str) -> Vec<NestEndpoint> {
    let path_info = match crate::code_analyst::get_path_info(&project_dir).ok() {
        Some(path_info) => path_info,
        None => return vec![],
    };
    if &path_info.framework != &Framework::NodeNest {
        return vec![];
    }
    let project_files = crate::code_analyst::project_files::get_project_files(
        LocalPath(path_info.project_dir.clone()),
        &path_info.code_language,
        &path_info.framework,
    );
    let base_path = Path::new(&path_info.project_dir).to_owned();
    let controllers = project_files
        .iter()
        .filter(|file| file.contains("controller.ts"))
        .map(|file| base_path.join(file).to_str().unwrap().to_owned())
        .collect::<Vec<String>>();
    println!("controllers: {:?}", controllers);
    let mut endpoints = vec![];
    for controller in controllers {
        let file_endpoints = get_file_endpoints(&controller);
        endpoints.extend(file_endpoints);
    }
    endpoints
}
