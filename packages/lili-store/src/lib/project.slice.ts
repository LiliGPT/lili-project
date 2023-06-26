import {
  createAsyncThunk,
  createEntityAdapter,
  createSelector,
  createSlice,
  EntityState,
  PayloadAction,
} from '@reduxjs/toolkit';
import { CodeProjectEntity } from '../types/code-projects.types';

export const PROJECT_FEATURE_KEY = 'project';

/*
 * Update these interfaces according to your requirements.
 */
// export interface CodeProjectEntity {
//   id: number;
// }

export type ReduxLoadingStatus = 'not loaded' | 'loading' | 'loaded' | 'error';

export interface ProjectState extends EntityState<CodeProjectEntity> {
  loadingStatus: ReduxLoadingStatus,
  error?: string | null;
}

export const projectAdapter = createEntityAdapter<CodeProjectEntity>();

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
export const fetchProject = createAsyncThunk<CodeProjectEntity[]>(
  'project/fetchStatus',
  async (_, thunkAPI) => {
    /**
     * Replace this with your custom fetch call.
     * For example, `return myApi.getProjects()`;
     * Right now we just return an empty array.
     */
    // return Promise.resolve([]);
    return new Promise((resolve, reject) => {
      setTimeout(() => resolve([

      ]), 2000);
    });
  }
);

export const initialProjectState: ProjectState = projectAdapter.getInitialState(
  {
    loadingStatus: 'not loaded',
    error: null,
  }
);

export const projectSlice = createSlice({
  name: PROJECT_FEATURE_KEY,
  initialState: initialProjectState,
  reducers: {
    add: projectAdapter.addOne,
    remove: projectAdapter.removeOne,
    setLoadingStatus(state, action: PayloadAction<ReduxLoadingStatus>) {
      return {
        ...state,
        loadingStatus: action.payload,
      };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProject.pending, (state: ProjectState) => {
        state.loadingStatus = 'loading';
      })
      .addCase(
        fetchProject.fulfilled,
        (state: ProjectState, action: PayloadAction<CodeProjectEntity[]>) => {
          projectAdapter.setAll(state, action.payload);
          state.loadingStatus = 'loaded';
        }
      )
      .addCase(fetchProject.rejected, (state: ProjectState, action) => {
        state.loadingStatus = 'error';
        state.error = action.error.message;
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
  [PROJECT_FEATURE_KEY]: ProjectState;
}): ProjectState => rootState[PROJECT_FEATURE_KEY];

export const selectAllProject = () => createSelector(getProjectState, selectAll);

export const selectProjectEntities = () => createSelector(
  getProjectState,
  selectEntities
);

export const selectProjectLoadingStatus = () => createSelector(
  getProjectState,
  (state) => state.loadingStatus
);

export const selectProjectError = () => createSelector(
  getProjectState,
  (state) => state.error
);
