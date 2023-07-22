use regex::Regex;
use serde::{Deserialize, Serialize};

use super::NestStatement;

#[derive(Debug, Serialize, Deserialize)]
pub struct Import {
    pub from: String,
    pub items: Vec<ImportedItem>,
    pub istart: usize,
    pub iend: usize,
    text: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct ImportedItem {
    pub name: String,
    pub alias: String,
}

impl Import {
    pub fn as_statements(code: &str) -> Vec<NestStatement> {
        let re = Regex::new(
            r#"import\s*\{?(?P<items>[ a-zA-Z0-9\,]*)\}? from\s['"]{1}(?P<from>.*)['"]{1}"#,
            // r#"^import\s*\{?(?P<items>[ a-zA-Z0-9\,]*)\}? from\s['"]{1}(?P<from>.*).*;$"#,
        )
        .unwrap();
        let caps = re.captures_iter(code);
        let statements = caps
            .map(|cap| {
                NestStatement::Import(Import {
                    text: cap[0].to_string(),
                    from: cap["from"].to_string(),
                    items: cap["items"]
                        .split(",")
                        .map(|x| {
                            let name = x.split("as").nth(0).unwrap().trim().to_string();
                            let alias = x
                                .split("as")
                                .nth(1)
                                .map(|x| x.trim().to_string())
                                .unwrap_or(name.clone());
                            ImportedItem { name, alias }
                        })
                        .collect::<Vec<ImportedItem>>(),
                    istart: cap.get(0).unwrap().start(),
                    iend: cap.get(0).unwrap().end(),
                })
            })
            .collect::<Vec<NestStatement>>();
        // println!("results: {:?}", &caps["items"]);
        return statements;
    }
}
