// --- Commons

export enum CodeLanguage {
  Javascript = 'Javascript',
  Rust = 'Rust',
}

export enum Framework {
  NodeNest = 'NodeNest',
}

// --- CodeMission

export interface CodeMission {
  mission_id: string,
  mission_status: CodeMissionStatus,
  mission_data: MissionData,
  context_files: string[],
  reviewed_context_files: string[] | null,
  created_at: string,
  updated_at: string,
}

export enum CodeMissionStatus {
  Created = 'Created',
  Approved = 'Approved',
  Fail = 'Fail',
  Perfect = 'Perfect',
}

export interface MissionData {
  project_dir: string;
  message: string;
  project_files: string[];
  code_language: CodeLanguage;
  framework: Framework;
}

// --- MissionExecution

export interface MissionExecution {
  execution_id: string,
  mission_id: string,
  execution_status: MissionExecutionStatus,
  mission_data: MissionData,
  context_files: MissionExecutionContextFile[],
  original_actions: MissionAction[],
  reviewed_actions: MissionAction[] | null,
  created_at: string,
  updated_at: string,
}

export enum MissionExecutionStatus {
  Created = 'Created',
  Approved = 'Approved',
  Fail = 'Fail',
  Ok = 'Ok',
  Perfect = 'Perfect',
}

export interface MissionExecutionContextFile {
  path: string,
  content: string,
}

export interface MissionAction {
  action_type: MissionActionType,
  path: string,
  content: string,
}

export enum MissionActionType {
  CreateFile = 'CreateFile',
  UpdateFile = 'UpdateFile',
}

