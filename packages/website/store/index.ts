// redux store
// Path: packages/website/store/index.ts
import { configureStore } from '@reduxjs/toolkit';
import { projectSlice } from '@lili-project/lili-store';
import { useDispatch } from 'react-redux';

export const store = configureStore({
  reducer: {
    project: projectSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();