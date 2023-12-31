pub fn is_valid_express_project(project_path: &str) -> Result<(), String> {
    // check if package.json exists
    let package_json_path = project_path.to_string() + "/package.json";
    let package_json_path = std::path::Path::new(&package_json_path);
    if false == package_json_path.exists() {
        return Err("package.json not found".to_string());
    };
    // read package.json
    let package_json_content = std::fs::read_to_string(package_json_path).unwrap();
    let package_json = serde_json::from_str::<serde_json::Value>(&package_json_content).unwrap();
    let dependencies = package_json["dependencies"].as_object();
    if dependencies.is_none() {
        return Err("Invalid package.json".to_string());
    };
    let dependencies = dependencies.unwrap();
    // check if package.json has express dependency
    if false == dependencies.contains_key("express") {
        return Err("express dependency not found".to_string());
    };
    // return ok
    Ok(())
}
