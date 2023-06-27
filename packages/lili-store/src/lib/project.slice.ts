import {
  createAsyncThunk,
  createEntityAdapter,
  createSelector,
  createSlice,
  PayloadAction,
} from '@reduxjs/toolkit';
import { ReduxCodeProject, ReduxProjectState } from './project.types';
import { ReduxLoadingStatus } from './redux.types';
import { PlatformClient } from '../services/platform/platform.client';
import { PlatformError } from '../services/platform/platform.error';
import { CodeProject } from '../services/platform/platform.types';

export const PROJECT_FEATURE_KEY = 'project';

export const projectAdapter = createEntityAdapter<ReduxCodeProject>({
  selectId: (project) => project.project_uid,
});

const makeErrorValue = (error: unknown) => {
  console.log(error, typeof error);
  // return new PlatformError('lili-store.project-slice', String(error));
  if (error instanceof PlatformError) {
    return String(error.error_description);
  }
  return String(error);
};

/**
 * Export an effect using createAsyncThunk from
 * the Redux Toolkit: https://redux-toolkit.js.org/api/createAsyncThunk
 *
 * e.g.
 * ```
 * import React, { useEffect } from 'react';
 * import { useDispatch } from 'react-redux';
 *
 * // ...
 *
 * const dispatch = useDispatch();
 * useEffect(() => {
 *   dispatch(fetchProject())
 * }, [dispatch]);
 * ```
 */
// --- example ---
type PickProjectThunkArgs = undefined;

export const pickProjectThunk = createAsyncThunk<
  ReduxCodeProject,
  PickProjectThunkArgs,
  {
    rejectValue: string;
  }
>('project/pickProjectThunk',
  async (args, { rejectWithValue }) => {
    let project: CodeProject | undefined;
    // if (!PlatformClient.client()) {
    //   return rejectWithValue(makeErrorValue('Platform client not set.'));
    // }
    try {
      project = await PlatformClient.client().pickProject();
    } catch (error) {
      return rejectWithValue(makeErrorValue(error));
    }
    if (!project) {
      return rejectWithValue(makeErrorValue('Project not found.'));
    }
    const redux_project: ReduxCodeProject = {
      parent_project_uid: undefined,
      data: project,
      dependencies: {
        is_loading: false,
        error_message: '',
      },
      display_name: project.project_dir.split('/').pop() ?? project.project_dir,
      project_uid: project.project_dir,
    };
    return redux_project;
  }
);

export const initialProjectState: ReduxProjectState = projectAdapter.getInitialState(
  {
    opened_project_uid: '',
    loading_status: ReduxLoadingStatus.Idle,
    error: null,
  }
);

export const projectSlice = createSlice({
  name: PROJECT_FEATURE_KEY,
  initialState: initialProjectState,
  reducers: {
    // upsertOne: projectAdapter.upsertOne,
    // remove: projectAdapter.removeOne,
    setLoadingStatus(state, action: PayloadAction<ReduxLoadingStatus>) {
      return {
        ...state,
        loadingStatus: action.payload,
      };
    },
    setOpenedProjectUid(state, action: PayloadAction<string>) {
      return {
        ...state,
        opened_project_uid: action.payload,
      };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(pickProjectThunk.pending, (state: ReduxProjectState) => {
        state.loading_status = ReduxLoadingStatus.Loading;
      })
      .addCase(
        pickProjectThunk.fulfilled,
        (state: ReduxProjectState, action: PayloadAction<ReduxCodeProject>) => {
          projectAdapter.upsertOne(state, action.payload);
          state.loading_status = ReduxLoadingStatus.Success;
        })
      .addCase(pickProjectThunk.rejected, (state: ReduxProjectState, action) => {
        state.loading_status = ReduxLoadingStatus.Error;
        state.error = String(action.payload);
      });
  },
});

/*
 * Export reducer for store configuration.
 */
export const projectReducer = projectSlice.reducer;

/*
 * Export action creators to be dispatched. For use with the `useDispatch` hook.
 *
 * e.g.
 * ```
 * import React, { useEffect } from 'react';
 * import { useDispatch } from 'react-redux';
 *
 * // ...
 *
 * const dispatch = useDispatch();
 * useEffect(() => {
 *   dispatch(projectActions.add({ id: 1 }))
 * }, [dispatch]);
 * ```
 *
 * See: https://react-redux.js.org/next/api/hooks#usedispatch
 */
export const projectActions = projectSlice.actions;

/*
 * Export selectors to query state. For use with the `useSelector` hook.
 *
 * e.g.
 * ```
 * import { useSelector } from 'react-redux';
 *
 * // ...
 *
 * const entities = useSelector(selectAllProject);
 * ```
 *
 * See: https://react-redux.js.org/next/api/hooks#useselector
 */
const { selectAll, selectEntities } = projectAdapter.getSelectors();

export const getProjectState = (rootState: {
  [PROJECT_FEATURE_KEY]: ReduxProjectState;
}): ReduxProjectState => rootState[PROJECT_FEATURE_KEY];

export const selectAllProject = () => createSelector(getProjectState, selectAll);

export const selectCurrentProjectUid = () => createSelector(
  getProjectState,
  (state) => state.opened_project_uid
);

export const selectProjectEntities = () => createSelector(
  getProjectState,
  selectEntities
);

export const selectProjectLoadingStatus = () => createSelector(
  getProjectState,
  (state) => state.loading_status
);

export const selectProjectError = () => createSelector(
  getProjectState,
  (state) => state.error
);
