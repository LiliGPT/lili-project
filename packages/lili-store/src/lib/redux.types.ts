export enum ReduxLoadingStatus {
  Idle,
  Loading,
  Error,
  Success,
}

export interface ReduxError {
  error_code: string;
  error_description: string;
}
