use super::statements::{CodeFile, NestStatement};

pub fn split_statements(file_path: &str) -> Vec<NestStatement> {
    let codefile = match CodeFile::new(file_path) {
        Ok(statements) => statements,
        Err(_) => return Vec::new(),
    };

    codefile.statements
}
