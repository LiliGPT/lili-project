import { EntityState } from "@reduxjs/toolkit";
import { MissionAction, MissionExecution } from "../services/prompter/prompter.types";
import { ReduxError, ReduxLoadingStatus } from "./redux.types";

export interface ReduxMissionExecution {
  entity_id: string;
  data: MissionExecution | null;
  loading_status: ReduxLoadingStatus;
  error: ReduxError | null;
  selected_actions_paths: string[];
}

export interface ReduxMissionState extends EntityState<ReduxMissionExecution> {
  loading_status: ReduxLoadingStatus;
  error: ReduxError | null;
}

