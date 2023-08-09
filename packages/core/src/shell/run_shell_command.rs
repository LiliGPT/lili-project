use std::process::Command;

#[derive(serde::Serialize, serde::Deserialize, Debug)]
pub struct RunShellCommandResult {
    pub success: bool,
    pub stdout: String,
    pub stderr: String,
}

// this function receives a command like this
// git commit -m "commit message"
// and returns a vector of strings like this
// ["commit", "-m", "commit message"]
fn get_command_arguments(original_command: &str) -> Vec<String> {
    let mut command = original_command.split_whitespace();
    let _command_name = command.next().unwrap();
    let command_args = command.collect::<Vec<&str>>();
    let command_args = command_args
        .iter()
        .map(|arg| arg.to_string())
        .collect::<Vec<String>>();
    let mut parsed_args = vec![];
    let mut temp_arg = String::new();
    for arg in command_args {
        let current_arg_is_start = arg.starts_with("\"") || arg.starts_with("'");
        let current_arg_is_end = arg.ends_with("\"") || arg.ends_with("'");
        if !current_arg_is_start && !current_arg_is_end {
            if temp_arg.len() > 0 {
                temp_arg.push_str(" ");
                temp_arg.push_str(&arg);
            } else {
                parsed_args.push(arg);
            }
        } else if current_arg_is_start && !current_arg_is_end {
            temp_arg.push_str(arg.trim_start_matches("\"").trim_start_matches("'"));
        } else if !current_arg_is_start && current_arg_is_end {
            if temp_arg.len() == 0 {
                parsed_args.push(arg);
                continue;
            }
            temp_arg.push_str(" ");
            temp_arg.push_str(arg.trim_end_matches("\"").trim_end_matches("'"));
            parsed_args.push(temp_arg);
            temp_arg = String::new();
        } else if current_arg_is_start && current_arg_is_end {
            parsed_args.push(arg[1..arg.len() - 1].to_string());
        }
    }
    if temp_arg.len() > 0 {
        parsed_args.push(temp_arg);
    }
    parsed_args
}

pub fn run_shell_command(command: &str, cwd: &str) -> RunShellCommandResult {
    let original_command = command.clone();
    let mut command = command.split_whitespace();
    let command_name = command.next().unwrap();
    let command_args = get_command_arguments(original_command);
    // print!(
    //     "command_name: {}\narguments: {}\n",
    //     command_name,
    //     command_args.join("  ")
    // );
    let output = Command::new(command_name)
        .args(command_args)
        .current_dir(cwd)
        .output()
        .expect("failed to execute process");
    let success = output.status.success();
    let stdout = String::from_utf8(output.stdout).unwrap();
    let stderr = String::from_utf8(output.stderr).unwrap();
    RunShellCommandResult {
        success,
        stdout,
        stderr,
    }
}
