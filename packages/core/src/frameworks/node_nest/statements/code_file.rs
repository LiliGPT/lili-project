use std::env::join_paths;

use crate::frameworks::node_nest::nestutils;

use super::{class::Class, import::Import, nest_statement::NestStatement};

#[derive(Debug)]
pub struct CodeFile {
    text: String,
    pub file_path: String,
    pub statements: Vec<NestStatement>,
}

impl CodeFile {
    pub fn new(file_path: &str) -> Result<CodeFile, String> {
        let file_content = match std::fs::read_to_string(file_path) {
            Ok(file) => file,
            Err(err) => return Err(format!("Error reading CodeFile: {:?} {:?}", file_path, err)),
        };
        let mut statements = Vec::new();
        statements.extend(Class::as_statements(&file_content));
        statements.extend(Import::as_statements(&file_content));

        Ok(CodeFile {
            text: file_content.to_string(),
            file_path: file_path.to_string(),
            statements,
        })
    }

    pub fn find_imported_content(&self, name: &str) -> Option<String> {
        for stt in &self.statements {
            match stt {
                NestStatement::Import(import) => {
                    for item in &import.items {
                        if item.name == name {
                            let mut base_dir = std::path::Path::new(&self.file_path)
                                .parent()
                                .unwrap()
                                .to_owned();
                            if import.from.contains("src/") {
                                let base_dir_str = base_dir.to_string_lossy().to_string();
                                let src_pos = base_dir_str.find("src/");
                                if let Some(src_pos) = src_pos {
                                    let new_base_dir = base_dir_str[..src_pos].to_string();
                                    base_dir = std::path::Path::new(&new_base_dir).to_owned();
                                }
                            }
                            // println!("base_dir: {:?} --- {:?}", base_dir, &import.from);
                            let imported_path = base_dir.join(&import.from);
                            let imported_path = imported_path.to_string_lossy().to_string();
                            return nestutils::import_scoped_string(&imported_path, name);
                        }
                    }
                }
                _ => {}
            }
        }
        None
    }
}
