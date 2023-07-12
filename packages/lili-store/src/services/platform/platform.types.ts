import { TauriInvokeFn } from './rust-platform.types';

export interface RunShellCommandResponse {
  stdout: string;
  stderr: string;
}

export abstract class SpecificPlatformClient {
  invokeFn: TauriInvokeFn;

  constructor(invokeFn: TauriInvokeFn) {
    this.invokeFn = invokeFn;
  }

  abstract pickProject(): Promise<CodeProject>;
  abstract signInPassword(username: string, password: string): Promise<PlatformSignInResponse>;
  abstract refreshToken(refresh_token: string): Promise<PlatformSignInResponse>;
  abstract runShellCommand(cwd: string, command: string): Promise<string>;
  abstract spawnShellCommand(args: SpawnShellCommandArgs): Promise<number>;
  abstract repositoryInfo(project_dir: string): Promise<RepositoryInfo>;
  abstract readTextFile(path: string): Promise<string>;
  abstract gitAdd(project_dir: string, path: string): Promise<void>;
  abstract gitCommit(project_dir: string, message: string): Promise<void>;
  abstract gitReset(project_dir: string, path: string): Promise<void>;
  abstract gitCustom(project_dir: string, command: string, args: string): Promise<RunShellCommandResponse>;
  abstract openTerminal(): Promise<void>;
}

export interface CodeProject {
  project_dir: string;
  code_language: string;
  framework: string;
  dependencies_installed: boolean | null;
  local_server_commands: string[];
  subprojects: CodeSubproject[];
  test_scripts: {
    [key: string]: string,
  };
}

export interface CodeSubproject {
  name: string;
  path: string;
  code_language: string;
  framework: string;
}

export enum PlatformPossibleClients {
  Rust,
  Web,
}

export interface PlatformSignInResponse {
  access_token: string;
  refresh_token: string;
}

export interface SpawnShellCommandArgs {
  command: string;
  cwd: string;
  on_stdout: (data: string) => void;
  on_stderr: (data: string) => void;
  on_error: (data: Error) => void;
  on_exit: (code: number) => void;
}

export interface RepositoryInfo {
  project_dir: string;
  branch: string;
  git_status: GitStatusEntry[];
  diff_text: string;
  log: GitLogEntry[];
}

export interface GitStatusEntry {
  file_path: string;
  is_staged: boolean;
  change_type: GitChangeType;
}

export enum GitChangeType {
  Added = 'Added',
  Modified = 'Modified',
  Deleted = 'Deleted',
  Untracked = 'Untracked',
}

export interface GitLogEntry {
  hash: string;
  author: string;
  datetime: string;
  message: string;
}

