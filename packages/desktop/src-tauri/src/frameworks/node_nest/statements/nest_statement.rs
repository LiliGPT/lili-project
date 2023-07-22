use regex::Regex;
use serde::{Deserialize, Serialize};

use super::{class::Class, import::Import};

#[derive(Debug, Serialize)]
pub enum NestStatement {
    Import(Import),
    Class(Class),
}
