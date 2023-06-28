import {
  createAsyncThunk,
  createEntityAdapter,
  createSelector,
  createSlice,
  PayloadAction,
} from '@reduxjs/toolkit';
import { PlatformError } from '../services/platform/platform.error';
import { ReduxAuthState, ReduxCurrentUser } from './auth.types';
import { ReduxError, ReduxLoadingStatus } from './redux.types';
import { PlatformClient } from '../services/platform/platform.client';
import { PlatformSignInResponse } from '../services/platform/platform.types';
import * as jose from 'jose';
import { RootState } from '../store';

export const AUTH_FEATURE_KEY = 'auth';

const makeErrorValue = (error: unknown) => {
  console.log(error, typeof error);
  // return new PlatformError('lili-store.project-slice', String(error));
  if (error instanceof PlatformError) {
    return String(error.error_description);
  }
  if (typeof error === 'object' && error !== null && 'message' in error) {
    return String(error.message);
  }
  return String(error);
};

// --- Initial State

export const initialAuthState: ReduxAuthState = {
  access_token: '',
  refresh_token: '',
  access_token_exp: 0,
  error: null,
  loading_status: ReduxLoadingStatus.Idle,
  user: null,
};

// --- Slice

export const authSlice = createSlice({
  name: AUTH_FEATURE_KEY,
  initialState: initialAuthState,
  reducers: {
    setLoadingStatus(state, action: PayloadAction<ReduxLoadingStatus>) {
      return {
        ...initialAuthState,
        loading_status: action.payload,
        error: null,
      }
    },
    setError(state, action: PayloadAction<ReduxError>) {
      return {
        ...initialAuthState,
        loading_status: ReduxLoadingStatus.Error,
        error: action.payload,
      }
    },
    setAuthResult(state, action: PayloadAction<PlatformSignInResponse>) {
      const decoded = jose.decodeJwt(action.payload.access_token);
      let user: ReduxCurrentUser | null = null;
      if (decoded) {
        user = {
          sub: decoded['sub'] as string,
          name: decoded['name'] as string,
          email: decoded['email'] as string,
        };
      }
      return {
        ...state,
        ...action.payload,
        access_token_exp: (decoded.exp ?? 0) * 1000,
        user,
        loading_status: ReduxLoadingStatus.Success,
        error: null,
      };
    }
  },
});

// --- Actions

// --- Selectors

export const selectAuthState = (state: {
  [AUTH_FEATURE_KEY]: ReduxAuthState;
}): ReduxAuthState => state[AUTH_FEATURE_KEY];

export const selectAuthLoadingStatus = () => createSelector(
  selectAuthState,
  (state) => state.loading_status,
);

export const selectAuthError = () => createSelector(
  selectAuthState,
  (state) => state.error,
);

export const selectCurrentUser = () => createSelector(
  selectAuthState,
  (state) => state.user,
);

// --- Thunks

export const signInThunk = createAsyncThunk<
  void,
  { email: string; password: string }
>(
  `${AUTH_FEATURE_KEY}/signIn`,
  async (args, { dispatch }) => {
    dispatch(authSlice.actions.setLoadingStatus(ReduxLoadingStatus.Loading));
    let result;
    try {
      result = await PlatformClient.client().signInPassword(args.email, args.password);
    } catch (error) {
      dispatch(authSlice.actions.setError({
        error_code: '--todo--',
        error_description: makeErrorValue(error),
      }));
      return;
    }
    dispatch(authSlice.actions.setAuthResult(result));
  },
);

export const refreshTokenThunk = createAsyncThunk(`${AUTH_FEATURE_KEY}/refreshToken`, async (_, { dispatch, getState }) => {
  const { access_token_exp, refresh_token } = selectAuthState(getState() as RootState);
  const five_seconds = 5 * 1000;
  if (Date.now() <= access_token_exp - five_seconds) {
    console.log(`[refreshTokenThunk] accessToken still valid`);
    return;
  }
  dispatch(authSlice.actions.setLoadingStatus(ReduxLoadingStatus.Loading));
  let result;
  try {
    result = await PlatformClient.client().refreshToken(refresh_token);
  } catch (error) {
    dispatch(authSlice.actions.setError({
      error_code: '--todo--',
      error_description: makeErrorValue(error),
    }));
    return;
  }
  console.log(`[refreshTokenThunk] token refreshed`);
  dispatch(authSlice.actions.setAuthResult(result));
});
