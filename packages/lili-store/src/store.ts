// redux store
// Path: packages/website/store/index.ts
import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { projectSlice } from './lib/project.slice';
import { missionSlice } from './lib/mission.slice';
import { coreSlice } from './lib/core.slice';
import { authSlice } from './lib/auth.slice';

export const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    project: projectSlice.reducer,
    mission: missionSlice.reducer,
    core: coreSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
