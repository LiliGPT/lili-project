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
          state.opened_project_uid = action.payload.project_uid;
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

export const projectActions = projectSlice.actions;

const { selectAll, selectEntities } = projectAdapter.getSelectors();

export const getProjectState = (rootState: {
  [PROJECT_FEATURE_KEY]: ReduxProjectState;
}): ReduxProjectState => rootState[PROJECT_FEATURE_KEY];

export const selectAllProject = () => createSelector(getProjectState, selectAll);

export const selectOpenedProjects = () => createSelector(
  getProjectState,
  (state) => selectAll(state).filter((project) => {
    const is_project_uid = project.project_uid === state.opened_project_uid;
    const is_parent_project_uid = project.parent_project_uid === state.opened_project_uid;
    return is_project_uid || is_parent_project_uid;
  }),
);

export const selectOpenedRootProject = () => createSelector(
  getProjectState,
  (state) => selectAll(state).find((project) => project.project_uid === state.opened_project_uid),
);

export const selectCurrentProjectUid = () => createSelector(
  getProjectState,
  (state) => state.opened_project_uid
);

export const selectProjectEntities = () => createSelector(
  getProjectState,
  selectEntities
);

export const selectProject =
  (project_id: string) =>
    createSelector(
      getProjectState,
      (state) => selectEntities(state)[project_id] as ReduxCodeProject | undefined,
    );

export const selectProjectLoadingStatus = () => createSelector(
  getProjectState,
  (state) => state.loading_status
);

export const selectProjectError = () => createSelector(
  getProjectState,
  (state) => state.error
);

// --- Thunks

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

