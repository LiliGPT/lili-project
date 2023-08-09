use regex::Regex;
use serde::{Deserialize, Serialize};

use crate::frameworks::{node_nest::nestutils, strutils};

use super::nest_statement::NestStatement;

#[derive(Debug, Serialize, Deserialize)]
pub struct Class {
    pub name: String,
    pub decorators: Vec<Decorator>,
    text: String,
    pub methods: Vec<ClassMethod>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct Decorator {
    pub name: String,
    pub args: String,
    pub text: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct ClassMethod {
    pub decorators: Vec<Decorator>,
    pub name: String,
    pub text: String,
    body: String,
}

impl Class {
    // returns the Class and rest of the text
    fn setup_new_class(text: &str) -> (Class, String) {
        let (class_text, text) = nestutils::get_next_scope(text);
        let name_start_index = &class_text.find("class ").unwrap();
        let name_end_index = &class_text[name_start_index + 6..].find(" ").unwrap();
        let name = &class_text[name_start_index + 6..name_start_index + name_end_index + 6];
        (
            Class {
                name: name.to_string(),
                text: class_text.clone(),
                decorators: Self::_get_decorators(&class_text),
                methods: Self::_get_methods(&class_text.clone()),
            },
            text,
        )
    }

    fn _get_decorators(text: &str) -> Vec<Decorator> {
        let mut text = text.to_string();
        let mut decorators = Vec::new();
        loop {
            let (new_text, decorator) = Self::_get_next_decorator(text.to_string());
            if decorator.is_none() {
                break;
            }
            text = new_text;
            let decorator = decorator.unwrap();
            decorators.push(decorator);
        }
        decorators
    }

    fn _get_methods(class_text: &str) -> Vec<ClassMethod> {
        let start_index = match class_text.find('{') {
            Some(index) => index + 1,
            None => return Vec::new(),
        };
        let mut text = class_text[start_index..].to_owned();
        let mut methods: Vec<ClassMethod> = Vec::new();
        loop {
            let (new_text, method) = Self::_get_next_method(text);
            if method.is_none() {
                break;
            }
            text = new_text;
            methods.push(method.unwrap());
        }
        methods
    }

    fn _get_next_method(text: String) -> (String, Option<ClassMethod>) {
        let mut decorators = Vec::new();
        let original_text = text.clone();
        let mut text = text;
        loop {
            let (new_text, decorator) = Self::_get_next_decorator(text.clone());
            if let Some(decorator) = decorator {
                decorators.push(decorator);
                text = new_text;
            } else {
                break;
            }
        }
        // if text.find("{").is_none() || text.find("(").is_none() {
        //     return (text.to_owned(), None);
        // }
        let is_method = strutils::match_in_order(&text, "(){}}");
        if !is_method {
            return (text.to_owned(), None);
        }
        // let full_name = text[0..text.find("(").unwrap()].to_string();
        let full_name = text[0..text.find("(").unwrap()].trim().to_string();
        let re_name = Regex::new(r#"^[\s?]*[a-zA-Z_ ]+$"#).unwrap();
        if full_name.is_empty() || !re_name.is_match(&full_name) {
            return (text.to_owned(), None);
        }
        let mut body_start = text.find("{").unwrap() + 1;
        let _body = &text[body_start..];
        let mut _stack_size = 0;
        let mut body = String::new();
        for char in _body.chars() {
            if char == '{' {
                _stack_size += 1;
            }
            if char == '}' {
                _stack_size -= 1;
            }
            if _stack_size == -1 {
                break;
            }
            body.push(char.clone());
            body_start += 1;
        }
        // let _body = "body";
        let body_len = body.len() + 1;
        let text = &_body[body_len..];
        // let method_text = original_text[0..original_text.len() - text.len()].to_string();
        // let rest_text = text.to_string();
        let (method_text, rest_text) = nestutils::get_next_scope(&original_text);
        // let original_text = original_text[0..original_text_index].to_string();
        (
            rest_text.to_string(),
            Some(ClassMethod {
                decorators,
                name: full_name.to_string(),
                text: method_text,
                body: body.to_string(),
            }),
        )
    }

    fn _get_next_decorator(text: String) -> (String, Option<Decorator>) {
        if text.trim().replace('\n', "").starts_with("@") {
            let text = text[text.find("@").unwrap()..].to_string();
            let mut stack_size = 1;
            let mut decorator = String::new();
            for char in text.chars() {
                if char == '{' {
                    stack_size += 1;
                }
                if char == '}' {
                    stack_size -= 1;
                }
                if char == '@' {
                    stack_size -= 1;
                }
                if char == '(' {
                    stack_size += 1;
                }
                if char == ')' {
                    stack_size -= 1;

                    if stack_size == 0 {
                        decorator.push(')');
                        break;
                    }
                }
                if stack_size == -1 {
                    break;
                }
                decorator.push(char);
            }
            if !strutils::match_in_order(&decorator, "()") {
                return (text, None);
            }
            let index_open = decorator.find("(").unwrap().to_owned();
            let index_close = decorator.rfind(")").unwrap().to_owned();
            let real_decorator = Decorator {
                name: decorator[1..index_open].to_string(),
                args: decorator[index_open + 1..index_close].to_string(),
                text: decorator.to_string(),
            };
            return (text[decorator.len()..].to_string(), Some(real_decorator));
        }
        (text, None)
    }

    pub fn as_statements(code: &str) -> Vec<NestStatement> {
        // regex to detect classes
        let re = Regex::new(r#"\n([@a-zA-Z('"): \{\}/\-\n]*.*class .*\{[.\n\s\S]*\})"#).unwrap();
        let caps = re.captures_iter(code);
        let mut statements = Vec::new();
        caps.for_each(|cap| {
            let text = &cap[0];
            let mut text = text.to_string();
            while text.len() > 0 && strutils::match_in_order(&text, "class  {}") {
                let (class, next_text) = Self::setup_new_class(&text);
                statements.push(NestStatement::Class(class));
                text = next_text;
            }
        });
        statements
    }
}
