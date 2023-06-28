import {
  createAsyncThunk,
  createEntityAdapter,
  createSelector,
  createSlice,
  PayloadAction,
} from '@reduxjs/toolkit';
import { ReduxError, ReduxLoadingStatus } from './redux.types';
import { ReduxMissionExecution, ReduxMissionState } from './mission.types';
import { PrompterClient } from '../services/prompter/prompter.client';
import { PlatformError } from '../services/platform/platform.error';
import { MissionExecution } from '../services/prompter/prompter.types';
import { RootState } from '../store';
import { refreshTokenThunk } from './auth.slice';

export const MISSION_FEATURE_KEY = 'mission';

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

export const executionAdapter = createEntityAdapter<ReduxMissionExecution>({
  selectId: (entity) => entity.entity_id,
});

export const initialMissionState: ReduxMissionState = executionAdapter.getInitialState();

// --- Slice

function _patchEntity(
  state: ReduxMissionState,
  entity_id: string,
  update: Partial<ReduxMissionExecution>,
): ReduxMissionState {
  const found = state.entities[entity_id];
  if (!found) {
    return state;
  }
  let found_data: MissionExecution | null = null;
  if (found.data) {
    found_data = {
      ...found.data,
      ...(update.data || {}),
    };
  }
  const updated_entity: ReduxMissionExecution = {
    ...found,
    ...update,
    data: found_data,
  };
  return {
    ...state,
    entities: {
      ...state.entities,
      [entity_id]: updated_entity,
    },
  };
}

export const missionSlice = createSlice({
  name: MISSION_FEATURE_KEY,
  initialState: initialMissionState,
  reducers: {
    upsertOne: executionAdapter.upsertOne,
    removeOne: executionAdapter.removeOne,
    setLoadingStatus(state, action: PayloadAction<{
      execution_id: string;
      loading_status: ReduxLoadingStatus;
    }>) {
      return _patchEntity(state, action.payload.execution_id, {
        ...initialMissionState,
        loading_status: action.payload.loading_status,
      });
    },
    setError(state, action: PayloadAction<{
      execution_id: string;
      error: ReduxError;
    }>) {
      return _patchEntity(state, action.payload.execution_id, {
        ...initialMissionState,
        loading_status: ReduxLoadingStatus.Error,
        error: action.payload.error,
      });
    }
  },
  extraReducers: (builder) => {
    // builder.addCase(createMissionThunk.pending, (state): ReduxMissionState => {
    //   return {
    //     ...state,
    //     loading_status: ReduxLoadingStatus.Loading,
    //   };
    // });
    // builder.addCase(createMissionThunk.fulfilled, (state, action): ReduxMissionState => {
    //   executionAdapter.upsertOne(state, action.payload);
    //   state.loading_status = ReduxLoadingStatus.Success;
    // });
    // builder.addCase(createMissionThunk.rejected, (state, action): ReduxMissionState => {
    //   state.loading_status = ReduxLoadingStatus.Error;
    //   state.error = {
    //     error_code: 'lili-store.mission-slice',
    //     error_description: String(action.payload),
    //   }
    // });
  },
});

// --- Selectors

const { selectAll } = executionAdapter.getSelectors();

export const getMissionState = (rootState: {
  [MISSION_FEATURE_KEY]: ReduxMissionState;
}): ReduxMissionState => rootState[MISSION_FEATURE_KEY];

export const selectMissionExecutions = () => createSelector(getMissionState, selectAll);

export const selectMissionLoading = (entity_id: string) => createSelector(
  getMissionState,
  (state) => state.entities[entity_id]?.loading_status,
);

export const selectMissionError = (entity_id: string) => createSelector(
  getMissionState,
  (state) => state.entities[entity_id]?.error,
);

export const selectMissionExecution = (entity_id: string) => createSelector(
  getMissionState,
  (state) => state.entities[entity_id],
);

// --- Thunks
// /home/l/rust/experiments/gui/src/redux/slices/missionsSlice.ts

type CreateMissionThunkArgs = {
  project_dir: string;
  message: string;
}

export const createMissionThunk = createAsyncThunk<
  ReduxMissionExecution,
  CreateMissionThunkArgs,
  {
    rejectValue: string;
  }
>('mission/createMissionThunk',
  async (args, { rejectWithValue, getState, dispatch }) => {
    const entity_id = `new-${args.project_dir}`;
    let execution: MissionExecution | undefined;
    // if (!PlatformClient.client()) {
    //   return rejectWithValue(makeErrorValue('Platform client not set.'));
    // }
    let new_execution: ReduxMissionExecution = {
      entity_id,
      data: null,
      loading_status: ReduxLoadingStatus.Loading,
      error: null,
    };
    const getCurrentState = () => (getState() as RootState)[MISSION_FEATURE_KEY];
    // executionAdapter.addOne(getCurrentState(), new_execution);
    dispatch(missionSlice.actions.upsertOne(new_execution));
    try {
      await dispatch(missionSlice.actions.setLoadingStatus({
        execution_id: entity_id,
        loading_status: ReduxLoadingStatus.Loading,
      }));
      await dispatch(refreshTokenThunk());
      execution = await PrompterClient.createMission(args.project_dir, args.message);
    } catch (error) {
      new_execution = {
        ...new_execution,
        loading_status: ReduxLoadingStatus.Error,
        error: {
          error_code: '--todo--',
          error_description: makeErrorValue(error),
        },
      }
      dispatch(missionSlice.actions.upsertOne(new_execution));
      return new_execution;
    }
    if (!execution) {
      new_execution = {
        ...new_execution,
        loading_status: ReduxLoadingStatus.Error,
        error: {
          error_code: 'not_found',
          error_description: 'No execution returned.',
        },
      };
      dispatch(missionSlice.actions.upsertOne(new_execution));
      return new_execution;
    }
    dispatch(missionSlice.actions.removeOne(entity_id));
    const result: ReduxMissionExecution = {
      entity_id: execution.execution_id,
      data: execution,
      loading_status: ReduxLoadingStatus.Success,
      error: null,
    };
    dispatch(missionSlice.actions.upsertOne(result));
    return result;
  }
);
