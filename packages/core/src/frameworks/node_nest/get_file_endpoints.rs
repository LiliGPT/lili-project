use regex::Regex;
use serde::{Deserialize, Serialize};

use super::statements::{Class, ClassMethod, CodeFile, NestStatement};

#[derive(Debug, Serialize, Deserialize)]
pub struct NestEndpoint {
    pub controller_name: String,
    pub function_name: String,
    pub method: String,
    pub path: String,
    pub request_body: Option<NestEndpointRequestBody>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct NestEndpointRequestBody {
    pub name: String,
    pub content: Option<String>,
}

impl NestEndpoint {
    pub fn from(method: &ClassMethod, class: &Class, codefile: &CodeFile) -> Option<NestEndpoint> {
        let find_decorators = vec!["Get", "Post", "Put", "Delete", "Patch"];
        let mut base_path = "".to_string();
        for decorator in &class.decorators {
            if decorator.name == "Controller" {
                let args_len = decorator.args.len();
                if args_len > 0 {
                    base_path = decorator.args[1..args_len - 1].to_string()
                } else {
                    base_path = "".to_string()
                }
            }
        }
        let reb = Regex::new(r#"@Body\(\) [^:]*: ([a-zA-Z_]*)"#).unwrap();
        let request_body = reb.captures(&method.text).map(|cap| {
            let imported = codefile.find_imported_content(&cap[1]);
            NestEndpointRequestBody {
                name: cap[1].to_string(),
                content: imported,
            }
        });
        println!(
            "nest endpoint from: {:?} ---- {:?}\n\n",
            method.name, method.text
        );
        for decorator in &method.decorators {
            if !find_decorators.contains(&decorator.name.as_str()) {
                continue;
            }
            let args_len = decorator.args.len();
            let path = if args_len > 0 {
                let raw_path = decorator.args[1..args_len - 1].to_string();
                let separator = if raw_path.starts_with("/") || base_path.ends_with("/") {
                    ""
                } else {
                    "/"
                };
                let path = format!("{}{}{}", base_path, separator, raw_path);
                let path = if path.starts_with("/") {
                    path
                } else {
                    format!("/{}", path)
                };
                path
            } else if base_path.len() == 0 {
                "/".to_string()
            } else {
                base_path
            };
            return Some(NestEndpoint {
                controller_name: class.name.clone(),
                function_name: method.name.clone(),
                method: decorator.name.to_string(),
                path,
                request_body,
            });
        }
        None
    }
}

pub fn get_file_endpoints(file_path: &str) -> Vec<NestEndpoint> {
    let codefile = match CodeFile::new(file_path) {
        Ok(statements) => statements,
        Err(_) => return Vec::new(),
    };

    let mut endpoints = Vec::new();
    for statement in &codefile.statements {
        match statement {
            NestStatement::Class(class) => {
                let controller_name = class.name.clone();
                for method in &class.methods {
                    let endpoint = NestEndpoint::from(method, &class, &codefile);
                    match endpoint {
                        Some(endpoint) => {
                            endpoints.push(endpoint);
                        }
                        None => {}
                    };
                }
            }
            _ => {}
        }
    }
    endpoints
}
