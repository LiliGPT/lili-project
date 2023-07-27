import {
  createAsyncThunk,
  createEntityAdapter,
  createSelector,
  createSlice,
  PayloadAction,
} from '@reduxjs/toolkit';
import { ReduxError, ReduxLoadingStatus } from "./redux.types";
import { ReduxTgMode, ReduxTgState } from "./tg.types";
import { refreshTokenThunk } from './auth.slice';
import { PrompterClient } from '../services/prompter/prompter.client';
import { RootState } from '../store';
import { TgCategories, TgCategory, TgComponent } from '../services/prompter/prompter.types';
import { getTgCategories } from '../services/prompter/tg_categories';

// Tailwind Generator (tg)
export const TG_FEATURE_KEY = 'tg';

// --- Initial State

export const tgComponentAdapter = createEntityAdapter<TgComponent>({
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
    selected_category: TgCategories.Cards,
    components: tgComponentAdapter.getInitialState(),
  },
};


// --- Slice

export const tgSlice = createSlice({
  name: TG_FEATURE_KEY,
  initialState: initialTgState,
  reducers: {
    setTgCurrentMode: (state, action: PayloadAction<ReduxTgMode>) => {
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
        currentMode: ReduxTgMode.Creation,
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
    setTgCreationLoading(state) {
      return {
        ...state,
        creation: {
          ...state.creation,
          loading_status: ReduxLoadingStatus.Loading,
          error_message: '',
        },
      };
    },
    setTgCreationCategories(state, action: PayloadAction<TgCategories[]>) {
      return {
        ...state,
        creation: {
          ...state.creation,
          component: {
            ...state.creation.component,
            categories: action.payload,
          },
        },
      };
    },
    setTgCreationName(state, action: PayloadAction<string>) {
      return {
        ...state,
        creation: {
          ...state.creation,
          component: {
            ...state.creation.component,
            name: action.payload,
          },
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
    setTgLibraryLoading(state) {
      return {
        ...state,
        library: {
          ...state.library,
          loading_status: ReduxLoadingStatus.Loading,
          error_message: '',
        },
      };
    },
    setTgLibrarySelectedCategory(state, action: PayloadAction<TgCategories>) {
      return {
        ...state,
        library: {
          ...state.library,
          selected_category: action.payload,
        },
      };
    },
    setTgLibraryComponents(state, action: PayloadAction<TgComponent[]>) {
      tgComponentAdapter.setAll(state.library.components, action.payload);
    },
    resetTgCreation(state, action: PayloadAction<void>) {
      let name = 'Untitled 0';
      if (state.creation.component.name.startsWith('Untitled')) {
        const number = parseInt(state.creation.component.name.split(' ')[1], 10) || 0;
        name = `Untitled ${number + 1}`;
      }
      return {
        ...state,
        creation: {
          ...state.creation,
          loading_status: ReduxLoadingStatus.Idle,
          error_message: '',
          message: '',
          component: {
            ...state.creation.component,
            _id: '',
            name,
            training_description: '',
            categories: [],
            source_code: '<div></div>',
          },
        },
      };
    },
  },
});

// --- Actions

export const {
  setTgCurrentMode,
  setTgCreationMessage,
  setTgCreationSourceCode,
  setTgCreationError,
  setTgCreationLoading,
  setTgLibraryError,
  setTgLibraryLoading,
  setTgLibrarySelectedCategory,
  setTgLibraryComponents,
  resetTgCreation,
  setTgCreationCategories,
  setTgCreationName,
} = tgSlice.actions;

// --- Selectors

const { selectAll } = tgComponentAdapter.getSelectors();

export const selectTgState = (rootState: {
  [TG_FEATURE_KEY]: ReduxTgState;
}): ReduxTgState => rootState[TG_FEATURE_KEY];

export const selectTgCurrentMode = () => createSelector(
  selectTgState,
  (state) => state.currentMode,
);

export const selectTgCreation = () => createSelector(
  selectTgState,
  (state) => state.creation,
);

export const selectTgLibrary = () => createSelector(
  selectTgState,
  (state) => state.library,
);

export const selectTgCategories = () => createSelector(
  selectTgState,
  (state) => state.categories,
);

export const selectLibraryComponents = () => createSelector(
  selectTgState,
  (state) => selectAll(state.library.components),
);

// --- Thunks

export const tgAskThunk = createAsyncThunk(
  `${TG_FEATURE_KEY}/tgAskThunk`,
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

export const tgCreationSaveThunk = createAsyncThunk(
  `${TG_FEATURE_KEY}/tgCreationSaveThunk`,
  async (_, { dispatch, getState }) => {
    dispatch(setTgCreationLoading());
    await dispatch(refreshTokenThunk());
    const state = getState() as RootState;
    const creation = state.tg.creation;
    const {
      name,
      categories,
      source_code,
      training_description,
    } = creation.component;
    PrompterClient.tgCreateComponent(name, training_description, categories, source_code)
      .then((response) => {
        console.log(`[tgCreationSaveThunk] response: ${JSON.stringify(response)}`);
        // dispatch(setTgCurrentMode(ReduxTgMode.Library));
        dispatch(resetTgCreation());
      })
      .catch((error) => {
        const errorMessage = error.message || String(error);
        dispatch(setTgCreationError(errorMessage));
      });
  },
);

export const tgLibraryListComponentsThunk = createAsyncThunk(
  `${TG_FEATURE_KEY}/tgLibraryListComponentsThunk`,
  async (_, { dispatch, getState }) => {
    console.log(`[tgLibraryListComponentsThunk]`);
    dispatch(setTgLibraryLoading());
    await dispatch(refreshTokenThunk());
    const state = getState() as RootState;
    const selected_category = state.tg.library.selected_category;
    PrompterClient.tgListComponents(selected_category)
      .then((response) => {
        console.log(`[tgLibraryListComponentsThunk] response: ${JSON.stringify(response)}`, selected_category);
        dispatch(setTgLibraryComponents(response));
      })
      .catch((error) => {
        console.log(`[tgLibraryListComponentsThunk] error: ${JSON.stringify(error)}`);
        const parsedError: ReduxError = {
          error_code: '',
          error_description: error.message || String(error),
        };
        dispatch(setTgLibraryError(parsedError));
      });
  }
);
