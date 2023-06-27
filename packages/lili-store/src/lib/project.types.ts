import { EntityState } from "@reduxjs/toolkit";
import { CodeProject } from "../services/platform/platform.types";
import { ReduxLoadingStatus } from "./redux.types";

export interface ReduxCodeProject {
  parent_project_uid?: string;
  data: CodeProject;
  project_uid: string;
  display_name: string;
  dependencies: ReduxProjectDependency;
};

export interface ReduxProjectDependency {
  is_loading: boolean;
  error_message: string;
}

export interface ReduxProjectState extends EntityState<ReduxCodeProject> {
  opened_project_uid: string;
  loading_status: ReduxLoadingStatus;
  error: string | null;
}

