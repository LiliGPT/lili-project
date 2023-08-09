pub fn match_in_order(text: &str, sequence: &str) -> bool {
    let mut text = text.to_string();
    for char in sequence.chars() {
        if let Some(index) = text.find(char) {
            text = text[index + 1..].to_string();
        } else {
            return false;
        }
    }
    true
}
