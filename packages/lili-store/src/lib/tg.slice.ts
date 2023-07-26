import {
  createAsyncThunk,
  createEntityAdapter,
  createSelector,
  createSlice,
  PayloadAction,
} from '@reduxjs/toolkit';
import { ReduxError, ReduxLoadingStatus } from "./redux.types";
import { ReduxTgCategory, ReduxTgComponent, ReduxTgMode, ReduxTgState } from "./tg.types";
import { refreshTokenThunk } from './auth.slice';
import { PrompterClient } from '../services/prompter/prompter.client';
import { RootState } from '../store';

// Tailwind Generator (tg)
export const TG_FEATURE_KEY = 'tg';

// --- Initial State

export const tgComponentAdapter = createEntityAdapter<ReduxTgComponent>({
  selectId: (component) => component._id,
});

export const initialTgState: ReduxTgState = {
  currentMode: ReduxTgMode.Creation,
  creation: {
    loading_status: ReduxLoadingStatus.Idle,
    error_message: '',
    message: '',
    component: {
      _id: '',
      name: 'Untitled 0',
      training_description: '',
      categories: [],
      source_code: '<div></div>',
    },
  },
  categories: getTgCategories(),
  library: {
    loading_status: ReduxLoadingStatus.Idle,
    error_message: '',
    selected_category: '',
    components: tgComponentAdapter.getInitialState(),
  },
};

function getTgCategories(): ReduxTgCategory[] {
  return [
    {
      _id: 'cat1',
      name: 'Cards',
      slug: 'cards',
    },
    {
      _id: 'cat2',
      name: 'Buttons',
      slug: 'buttons',
    },
    {
      _id: 'cat3',
      name: 'General Purpose',
      slug: 'general',
    },
  ];
};

// --- Slice

export const tgSlice = createSlice({
  name: TG_FEATURE_KEY,
  initialState: initialTgState,
  reducers: {
    setTgMode: (state, action: PayloadAction<ReduxTgMode>) => {
      return {
        ...state,
        currentMode: action.payload,
      };
    },
    setTgCreationMessage(state, action: PayloadAction<string>) {
      return {
        ...state,
        creation: {
          ...state.creation,
          message: action.payload,
          error_message: '',
        },
      };
    },
    setTgCreationSourceCode(state, action: PayloadAction<string>) {
      return {
        ...state,
        creation: {
          ...state.creation,
          loading_status: ReduxLoadingStatus.Success,
          component: {
            ...state.creation.component,
            source_code: action.payload,
          },
        },
      };
    },
    setTgCreationError(state, action: PayloadAction<string>) {
      return {
        ...state,
        creation: {
          ...state.creation,
          loading_status: ReduxLoadingStatus.Error,
          error_message: action.payload,
        },
      };
    },
    setTgCreationLoading(state, action: PayloadAction<void>) {
      return {
        ...state,
        creation: {
          ...state.creation,
          loading_status: ReduxLoadingStatus.Loading,
          error_message: '',
        },
      };
    },
    setTgLibraryError(state, action: PayloadAction<ReduxError>) {
      return {
        ...state,
        library: {
          ...state.library,
          loading_status: ReduxLoadingStatus.Error,
          error_message: action.payload.error_description,
        },
      };
    },
    setTgLibraryLoading(state, action: PayloadAction<void>) {
      return {
        ...state,
        library: {
          ...state.library,
          loading_status: ReduxLoadingStatus.Loading,
          error_message: '',
        },
      };
    },
    setTgLibrarySelectedCategory(state, action: PayloadAction<string>) {
      return {
        ...state,
        library: {
          ...state.library,
          selected_category: action.payload,
        },
      };
    },
    setTgLibraryComponents(state, action: PayloadAction<ReduxTgComponent[]>) {
      tgComponentAdapter.setAll(state.library.components, action.payload);
    },
  },
});

// --- Actions

export const {
  setTgMode,
  setTgCreationMessage,
  setTgCreationSourceCode,
  setTgCreationError,
  setTgCreationLoading,
  setTgLibraryError,
  setTgLibraryLoading,
  setTgLibrarySelectedCategory,
  setTgLibraryComponents,
} = tgSlice.actions;

// --- Selectors

const { selectAll } = tgComponentAdapter.getSelectors();

export const selectTgState = (rootState: {
  [TG_FEATURE_KEY]: ReduxTgState;
}): ReduxTgState => rootState[TG_FEATURE_KEY];

export const selectTgCreation = () => createSelector(
  selectTgState,
  (state) => state.creation,
);

export const selectTgLibrary = () => createSelector(
  selectTgState,
  (state) => state.library,
);

// --- Thunks

export const tgCreationSaveThunk = createAsyncThunk(
  `${TG_FEATURE_KEY}/tgCreationSaveThunk`,
  async (_, { dispatch, getState }) => {
    dispatch(setTgCreationLoading());
    await dispatch(refreshTokenThunk());
    const state = getState() as RootState;
    const creation = state.tg.creation;
    PrompterClient.askTailwindGenerator(creation.component.source_code, creation.message)
      .then((response) => {
        dispatch(setTgCreationSourceCode(response));
      })
      .catch((error) => {
        dispatch(setTgCreationError(error.message));
      });
  },
);
