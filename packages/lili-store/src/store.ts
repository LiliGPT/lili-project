// redux store
// Path: packages/website/store/index.ts
import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { projectSlice } from './lib/project.slice';
import { missionSlice } from './lib/mission.slice';

export const store = configureStore({
  reducer: {
    project: projectSlice.reducer,
    mission: missionSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
