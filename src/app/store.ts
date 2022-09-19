import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import boardReducer from '../scenes/main/slice';

export const store = configureStore({
  reducer: {
    board: boardReducer
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
