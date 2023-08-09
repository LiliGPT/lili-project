use crate::io::{LocalPath, RelativeFileSearcher};

pub fn javascript_is_next(project_dir: &str) -> bool {
    // Check if next.config.js exists
    match std::path::Path::new(project_dir)
        .join("next.config.js")
        .exists()
    {
        true => return true,
        false => {}
    };
    false
}

pub fn javascript_is_react(project_dir: &str) -> bool {
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

pub fn detect_nodejs(project_dir: &str) -> Result<(), Box<dyn std::error::Error>> {
    // check if package.json exists
    let package_json_exists = std::path::Path::new(project_dir)
        .join("package.json")
        .exists();
    if package_json_exists == false {
        return Err("No package.json found".into());
    }
    Ok(())
}

pub fn detect_nodets(project_dir: &str) -> Result<(), Box<dyn std::error::Error>> {
    // check if package.json exists
    let package_json_exists = std::path::Path::new(project_dir)
        .join("package.json")
        .exists();
    if package_json_exists == false {
        return Err("No package.json found".into());
    }
    // // get package.json dependencies
    // let package_json =
    //     std::fs::read_to_string(std::path::Path::new(project_dir).join("package.json"))?;
    // let package_json: serde_json::Value = serde_json::from_str(&package_json)?;
    // let package_json_dependencies = &package_json["dependencies"]
    //     .as_object()
    //     .expect("invalid Package.json dependencies")
    //     .to_owned();
    // let package_json_dev_dependencies = &package_json["devDependencies"]
    //     .as_object()
    //     .expect("invalid Package.json devDependencies")
    //     .to_owned();
    // // check if package.json contains typescript
    // let typescript_exists = package_json_dependencies.contains_key("typescript")
    //     || package_json_dev_dependencies.contains_key("typescript");
    // if typescript_exists == false {
    //     return Err("No typescript dependency found".into());
    // }
    // // check if package.json contains @types/node
    // let types_node_exists = package_json_dependencies.contains_key("@types/node")
    //     || package_json_dev_dependencies.contains_key("@types/node");
    // if types_node_exists == false {
    //     return Err("No @types/node dependency found".into());
    // }
    get_dependency_version(project_dir, "typescript")?;
    get_dependency_version(project_dir, "@types/node")?;
    Ok(())
}

// ---

pub struct PackageJsonDependency {
    pub name: String,
    pub version: String,
    pub is_dev: bool,
}

pub fn get_dependency_version(
    project_dir: &str,
    dependency_name: &str,
) -> Result<PackageJsonDependency, Box<dyn std::error::Error>> {
    let package_json = std::fs::read_to_string(format!("{}/package.json", project_dir))?;
    let package_json: serde_json::Value = serde_json::from_str(&package_json)?;
    let dependencies = package_json["dependencies"].as_object();
    let dev_dependencies = package_json["devDependencies"].as_object();
    if dependencies.is_none() && dev_dependencies.is_none() {
        return Err("no dependencies found".into());
    }
    let empty = serde_json::Map::new();
    let dependencies = match dependencies {
        Some(dependencies) => dependencies,
        None => &empty,
    };
    let dev_dependencies = match dev_dependencies {
        Some(dev_dependencies) => dev_dependencies,
        None => &empty,
    };
    let dependency_version = dependencies.get(dependency_name);
    match dependency_version {
        Some(dependency_version) => Ok(PackageJsonDependency {
            name: dependency_name.to_string(),
            version: dependency_version.as_str().unwrap().to_string(),
            is_dev: false,
        }),
        None => {
            let dependency_version = dev_dependencies.get(dependency_name);
            match dependency_version {
                Some(dependency_version) => {
                    return Ok(PackageJsonDependency {
                        name: dependency_name.to_string(),
                        version: dependency_version.as_str().unwrap().to_string(),
                        is_dev: true,
                    })
                }
                None => return Err("dependency not found".into()),
            }
        }
    }
}
