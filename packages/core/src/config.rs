pub struct CoreConfig;

impl CoreConfig {
    pub fn prompterUrl() -> String {
        std::env::var("PROMPTER_URL")
            .unwrap_or(String::from("https://lili-prompter.giovannefeitosa.com"))
    }
}
