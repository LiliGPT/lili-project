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
  /**
   * pickProject public function
   */
  abstract pickProject(): Promise<CodeProject>;
}
