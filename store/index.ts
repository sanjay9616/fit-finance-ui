import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import loaderReducer from './slices/loaderSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    loader: loaderReducer,
  },
});

// Types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
