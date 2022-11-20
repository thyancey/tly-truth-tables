import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import { loadState } from '../utils/localstorage';
import boardReducer from './board-slice';
import uiReducer from './ui-slice';

export const store = configureStore({
  reducer: {
    board: boardReducer,
    ui: uiReducer
  },
  preloadedState: loadState()
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
