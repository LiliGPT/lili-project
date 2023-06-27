import {
  createAsyncThunk,
  createEntityAdapter,
  createSelector,
  createSlice,
  PayloadAction,
} from '@reduxjs/toolkit';
import { PlatformError } from '../services/platform/platform.error';
import { ReduxCoreState, ReduxCoreView } from './core.types';

export const CORE_FEATURE_KEY = 'core';

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

export const initialCoreState: ReduxCoreState = {
  // page view
  view: ReduxCoreView.SignIn,
};

// --- Slice

export const coreSlice = createSlice({
  name: CORE_FEATURE_KEY,
  initialState: initialCoreState,
  reducers: {
    setCoreView: (state, action: PayloadAction<ReduxCoreView>) => {
      return {
        ...state,
        view: action.payload,
      };
    },
  },
});

// --- Actions

export const { setCoreView } = coreSlice.actions;

// --- Selectors

export const selectCoreState = (state: {
  [CORE_FEATURE_KEY]: ReduxCoreState;
}): ReduxCoreState => state[CORE_FEATURE_KEY];

export const selectCoreView = () => createSelector(
  selectCoreState,
  (state) => state.view,
);
