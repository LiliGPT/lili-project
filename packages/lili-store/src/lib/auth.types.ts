import { ReduxError, ReduxLoadingStatus } from "./redux.types";

export interface ReduxAuthState {
  access_token: string;
  access_token_exp: number;
  refresh_token: string;
  loading_status: ReduxLoadingStatus;
  error: ReduxError | null;
  user: ReduxCurrentUser | null;
}

export interface ReduxCurrentUser {
  sub: string;
  name: string;
  email: string;
}

