#[derive(Debug, Clone, serde::Serialize, serde::Deserialize)]
pub struct RateLimitMe {
    pub start_date: String,
    pub missions_count: i32,
    pub missions_max: i32,
    pub missions_perc: u32,
}
