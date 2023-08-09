// returns the text until next scope (between {...}), and the rest of the text
pub fn get_next_scope(text: &str) -> (String, String) {
    let mut new_text = String::new();
    let stack_openers = vec!['{', '[', '('];
    let stack_closers = vec!['}', ']', ')'];
    let mut stack = Vec::new();
    let mut scope_found = false;

    for ch in text.chars() {
        if stack_openers.contains(&ch) {
            stack.push(ch);
        } else if stack_closers.contains(&ch) {
            stack.pop();
        }
        new_text.push(ch.clone());
        if stack.len() == 0 && ch == '}' {
            break;
        }
    }

    (new_text.clone(), text[new_text.len()..].to_string())
}

// import a chunk from a file
pub fn import_scoped_string(file_path: &str, name: &str) -> Option<String> {
    let full_file_path = if file_path.ends_with(".ts") {
        file_path.to_string()
    } else {
        format!("{}.ts", file_path)
    };
    let content = match std::fs::read_to_string(full_file_path) {
        Ok(content) => content,
        Err(_err) => {
            println!("Error reading file: {} {}", file_path, _err);
            return None;
        }
    };
    let to_find = format!(" {} ", name);
    let found_index = match content.find(&to_find) {
        Some(found) => found,
        None => return None,
    };
    let (prev, rest) = content.split_at(found_index);
    let prev_line_index = match prev.rfind('\n') {
        Some(found) => found,
        None => 0,
    };
    let full_text = prev[prev_line_index..].to_string() + &rest;
    let (scoped_content, rest_text) = get_next_scope(&full_text);
    Some(scoped_content.trim().to_string())
}
