import { EntityState } from "@reduxjs/toolkit";
import { MissionExecution } from "../services/prompter/prompter.types";
import { ReduxError, ReduxLoadingStatus } from "./redux.types";

export type ReduxMissionExecution = MissionExecution;

export interface ReduxMissionState extends EntityState<ReduxMissionExecution> {
  loading_status: ReduxLoadingStatus;
  error: ReduxError | null;
}