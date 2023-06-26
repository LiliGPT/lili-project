import { CodeSubproject } from './code-subprojects.types';

export interface CodeProjectEntity {
  project_dir: string;
  code_language: string;
  framework: string;
  dependencies_installed: boolean;
  local_server_commands: string[];
  subprojects: CodeSubproject[];
}
