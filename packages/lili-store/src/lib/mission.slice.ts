import {
  createAsyncThunk,
  createEntityAdapter,
  createSelector,
  createSlice,
  PayloadAction,
} from '@reduxjs/toolkit';
import { ReduxError, ReduxLoadingStatus } from './redux.types';
import { ReduxMissionExecution, ReduxMissionState } from './mission.types';

export const MISSION_FEATURE_KEY = 'mission';

// --- Initial State

export const executionAdapter = createEntityAdapter<ReduxMissionExecution>({
  selectId: (execution) => execution.execution_id,
});

export const initialMissionState: ReduxMissionState = executionAdapter.getInitialState({
  loading_status: ReduxLoadingStatus.Idle,
  error: null,
});

// --- Slice

export const missionSlice = createSlice({
  name: MISSION_FEATURE_KEY,
  initialState: initialMissionState,
  reducers: {
    setLoadingStatus(state, action: PayloadAction<ReduxLoadingStatus>) {
      return {
        ...state,
        loading_status: action.payload,
      };
    },
    setError(state, action: PayloadAction<ReduxError>) {
      return {
        ...state,
        error: action.payload,
      }
    }
  },
  extraReducers: (builder) => {
    // pass
  },
});

// --- Selectors

const { selectAll } = executionAdapter.getSelectors();

export const getMissionState = (rootState: {
  [MISSION_FEATURE_KEY]: ReduxMissionState;
}): ReduxMissionState => rootState[MISSION_FEATURE_KEY];

export const selectMissionExecutions = () => createSelector(getMissionState, selectAll);

// --- Thunks
// /home/l/rust/experiments/gui/src/redux/slices/missionsSlice.ts

