import { TauriInvokeFn } from './rust-platform.types';

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

