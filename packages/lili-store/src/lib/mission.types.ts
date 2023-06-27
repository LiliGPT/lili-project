import { EntityState } from "@reduxjs/toolkit";
import { MissionExecution } from "../services/prompter/prompter.types";
import { ReduxError, ReduxLoadingStatus } from "./redux.types";

export interface ReduxMissionExecution {
  entity_id: string;
  data: MissionExecution | null;
  loading_status: ReduxLoadingStatus;
  error: ReduxError | null;
}

export type ReduxMissionState = EntityState<ReduxMissionExecution>;
