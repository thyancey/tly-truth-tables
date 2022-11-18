import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from './store';
import { Coordinate } from '../types';

export interface UiState {
  zoom: number,
  position: Coordinate
}

const initialState: UiState = {
  zoom: 0.4,
  position: [0, -50]
};

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setZoom: (state: UiState, action: PayloadAction<number>) => {
      state.zoom = action.payload;
    },
    setPosition: (state, action: PayloadAction<Coordinate>) => {
      state.position = action.payload;
    },
    resetZoom: (state: UiState) => {
      state.zoom = initialState.zoom;
    },
    resetPosition: (state: UiState) => {
      state.position = initialState.position;
    },
  } 
});

export const { setZoom, setPosition, resetZoom, resetPosition } = uiSlice.actions;

export const getZoom = (state: RootState) => state.ui.zoom;
export const getPosition = (state: RootState) => state.ui.position;

export default uiSlice.reducer;