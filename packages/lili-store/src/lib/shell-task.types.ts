import { EntityState } from "@reduxjs/toolkit";

export type ReduxShellTaskState = EntityState<ReduxShellTask>;

export interface ReduxShellTask {
  project_id: string;
  command: string;
  pid?: number;
  is_running: boolean;
  logs: ReduxShellLog[];
}

export interface ReduxShellLog {
  timestamp: number;
  type: ReduxShellLogType;
  text: string;
}

export enum ReduxShellLogType {
  Error,
  Normal,
}

