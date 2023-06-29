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
import { MissionExecution, MissionExecutionStatus } from '../services/prompter/prompter.types';
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

export const initialMissionState: ReduxMissionState = executionAdapter.getInitialState({
  loading_status: ReduxLoadingStatus.Idle,
  error: null,
});

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
    setSliceLoadingStatus(state, action: PayloadAction<ReduxLoadingStatus>) {
      return {
        ...state,
        loading_status: action.payload,
        error: null,
      };
    },
    setSliceError(state, action: PayloadAction<ReduxError>) {
      return {
        ...state,
        loading_status: ReduxLoadingStatus.Error,
        error: action.payload,
      };
    },
    setExecutionLoadingStatus(state, action: PayloadAction<{
      execution_id: string;
      loading_status: ReduxLoadingStatus;
    }>) {
      return _patchEntity(state, action.payload.execution_id, {
        ...initialMissionState,
        loading_status: action.payload.loading_status,
      });
    },
    setExecutionError(state, action: PayloadAction<{
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

// fetchMissionExecutionsThunk

export const fetchMissionExecutionsThunk = createAsyncThunk<
  MissionExecution[],
  void
>(`${MISSION_FEATURE_KEY}/fetchMissionExecutionsThunk`,
  async (_, { dispatch }) => {
    dispatch(missionSlice.actions.setSliceLoadingStatus(ReduxLoadingStatus.Loading));
    await dispatch(refreshTokenThunk());
    const filter = {
      'execution_status': { '$ne': 'fail' }
    };
    let executions: MissionExecution[] = [];
    try {
      executions = await PrompterClient.searchExecutions(filter);
      for (const exec of executions) {
        dispatch(missionSlice.actions.upsertOne({
          entity_id: exec.execution_id,
          data: exec,
          loading_status: ReduxLoadingStatus.Idle,
          error: null,
        }));
      }
      dispatch(missionSlice.actions.setSliceLoadingStatus(ReduxLoadingStatus.Success));
    } catch(e) {
      dispatch(missionSlice.actions.setSliceError({
        error_code: 'lili-store.mission-slice',
        error_description: makeErrorValue(e),
      }));
    }
    return executions;
  }
);

// createMissionThunk

type CreateMissionThunkArgs = {
  project_dir: string;
  message: string;
}

export const createMissionThunk = createAsyncThunk<
  ReduxMissionExecution,
  CreateMissionThunkArgs
>('mission/createMissionThunk',
  async (args, { dispatch }) => {
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
    dispatch(missionSlice.actions.upsertOne(new_execution));
    dispatch(missionSlice.actions.setExecutionLoadingStatus({
      execution_id: entity_id,
      loading_status: ReduxLoadingStatus.Loading,
    }));
    await dispatch(refreshTokenThunk());
    try {
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

// setExecutionFailThunk

export const setExecutionFailThunk = createAsyncThunk<
  void,
  string
>(`${MISSION_FEATURE_KEY}/setExecutionFailThunk`,
  async (execution_id: string, { dispatch, getState }) => {
    dispatch(missionSlice.actions.setExecutionLoadingStatus({
      execution_id,
      loading_status: ReduxLoadingStatus.Loading,
    }));
    await dispatch(refreshTokenThunk());
    try {
      await PrompterClient.setExecutionFail(execution_id);
      const execution = selectMissionExecution(execution_id)((getState() as RootState));
      if (!execution?.data) {
        console.log('[setExecutionFailThunk] invalid execution ', execution_id, execution);
        return;
      }
      dispatch(missionSlice.actions.upsertOne({
        ...execution,
        loading_status: ReduxLoadingStatus.Success,
        error: null,
        data: {
            ...execution.data,
            execution_status: MissionExecutionStatus.Fail,
        },
      }));
    } catch (error) {
      dispatch(missionSlice.actions.setExecutionError({
        execution_id,
        error: {
          error_code: '--todo--',
          error_description: makeErrorValue(error),
        },
      }));
    }
  }
);

// removeExecutionActionThunk

type RemoveExecutionActionThunkArgs = {
  execution_id: string;
  action_path: string;
}

export const removeExecutionActionThunk = createAsyncThunk<
  void,
  RemoveExecutionActionThunkArgs
>(`${MISSION_FEATURE_KEY}/removeExecutionActionThunk`,
  async (args, { dispatch, getState }) => {
    dispatch(missionSlice.actions.setExecutionLoadingStatus({
      execution_id: args.execution_id,
      loading_status: ReduxLoadingStatus.Loading,
    }));
    await dispatch(refreshTokenThunk());
    const execution = selectMissionExecution(args.execution_id)(getState() as RootState);
    if (!execution) {
      console.log(`[removeExecutionActionThunk] Execution not found: ${args.execution_id}`);
      dispatch(missionSlice.actions.setExecutionError({
        execution_id: args.execution_id,
        error: {
          error_code: 'not_found',
          error_description: 'Execution not found.',
        },
      }));
      return;
    }
    if (!execution.data) {
      console.log(`[removeExecutionActionThunk] Execution data not found: ${args.execution_id}`);
      dispatch(missionSlice.actions.setExecutionError({
        execution_id: args.execution_id,
        error: {
          error_code: 'invalid_execution_data',
          error_description: 'Execution data not found.',
        },
      }));
      return;
    }
    let reviewedActions = execution.data.reviewed_actions ?? execution.data.original_actions;
    reviewedActions = reviewedActions.filter((action) => action.path !== args.action_path);
    try {
      await PrompterClient.replaceExecutionActions(args.execution_id, reviewedActions);
      dispatch(missionSlice.actions.upsertOne({
        ...execution,
        data: {
          ...execution.data,
          reviewed_actions: reviewedActions,
          updated_at: new Date().toISOString(),
        },
      }));
      dispatch(missionSlice.actions.setExecutionLoadingStatus({
        execution_id: args.execution_id,
        loading_status: ReduxLoadingStatus.Success,
      }));
    } catch (error) {
      dispatch(missionSlice.actions.setExecutionError({
        execution_id: args.execution_id,
        error: {
          error_code: '--todo--',
          error_description: makeErrorValue(error),
        },
      }));
    }
  }
);

// approveAndRunExecutionThunk

type ApproveAndRunExecutionThunkArgs = {
  project_dir: string;
  execution_id: string;
}

export const approveAndRunExecutionThunk = createAsyncThunk<
  void,
  ApproveAndRunExecutionThunkArgs
>(`${MISSION_FEATURE_KEY}/approveAndRunExecutionThunk`,
  async (args, { dispatch, getState }) => {
    dispatch(missionSlice.actions.setExecutionLoadingStatus({
      execution_id: args.execution_id,
      loading_status: ReduxLoadingStatus.Loading,
    }));
    await dispatch(refreshTokenThunk());
    try {
      await PrompterClient.approveAndRun(args.project_dir, args.execution_id);
      const execution = selectMissionExecution(args.execution_id)(getState() as RootState);
      if (!execution || !execution.data) {
        console.log(
          '[approveAndRunExecutionThunk] Invalid execution',
          'This should not happen.',
          execution,
        );
        return;
      }
      dispatch(missionSlice.actions.upsertOne({
        ...execution,
        loading_status: ReduxLoadingStatus.Success,
        error: null,
        data: {
          ...execution.data,
          execution_status: MissionExecutionStatus.Approved,
          updated_at: new Date().toISOString(),
        },
      }));
    } catch (error) {
      dispatch(missionSlice.actions.setExecutionError({
        execution_id: args.execution_id,
        error: {
          error_code: '--todo--',
          error_description: makeErrorValue(error),
        },
      }));
    }
  }
);

// retryExecutionThunk

type RetryExecutionThunkArgs = {
  execution_id: string;
  message: string;
}

export const retryExecutionThunk = createAsyncThunk<
  void,
  RetryExecutionThunkArgs
>(`${MISSION_FEATURE_KEY}/retryExecutionThunk`,
  async (args, { dispatch, getState }) => {
    dispatch(missionSlice.actions.setExecutionLoadingStatus({
      execution_id: args.execution_id,
      loading_status: ReduxLoadingStatus.Loading,
    }));
    await dispatch(refreshTokenThunk());
    try {
      console.log('retry execution: ', args);
      await PrompterClient.retryExecution(args.execution_id, args.message);
      console.log('retry execution worked');
      await dispatch(fetchMissionExecutionsThunk());
    } catch (error) {
      dispatch(missionSlice.actions.setExecutionError({
        execution_id: args.execution_id,
        error: {
          error_code: '--todo--',
          error_description: makeErrorValue(error),
        },
      }));
    }
  }
);

// commitExecutionLocalChangesThunk

type CommitExecutionLocalChangesThunkArgs = {
  project_dir: string;
  execution_id: string;
}

export const commitExecutionLocalChangesThunk = createAsyncThunk<
  void,
  CommitExecutionLocalChangesThunkArgs
>(`${MISSION_FEATURE_KEY}/commitExecutionLocalChangesThunk`,
  async (args, { dispatch, getState }) => {
    dispatch(missionSlice.actions.setExecutionLoadingStatus({
      execution_id: args.execution_id,
      loading_status: ReduxLoadingStatus.Loading,
    }));
    await dispatch(refreshTokenThunk());
    try {
      await PrompterClient.submitReview(args.project_dir, args.execution_id);
      await dispatch(fetchMissionExecutionsThunk());
    } catch (error) {
      dispatch(missionSlice.actions.setExecutionError({
        execution_id: args.execution_id,
        error: {
          error_code: '--todo--',
          error_description: makeErrorValue(error),
        },
      }));
    }
  }
);
