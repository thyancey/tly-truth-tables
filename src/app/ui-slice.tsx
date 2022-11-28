import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from './store';
import { Coordinate } from '../types';
import { clamp } from '../utils';

export interface UiState {
  zoom: number;
  zoomDelta: number;
  positionDelta: Coordinate;
  position: Coordinate;
}

const initialState: UiState = {
  zoom: 0.4,
  zoomDelta: 0.0,
  position: [0, -25],
  positionDelta: [0, 0]
};

export type DeltaValues = {
  zoom: number;
  position: Coordinate;
}

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setZoom: (state: UiState, action: PayloadAction<number>) => {
      state.zoom = action.payload;
    },
    setDeltaValues: (state: UiState, action: PayloadAction<DeltaValues>) => {
      state.zoomDelta = action.payload.zoom;
      state.positionDelta = action.payload.position;
    },
    setZoomDelta: (state: UiState, action: PayloadAction<number>) => {
      state.zoomDelta = action.payload;
    },
    releaseDeltas: (state: UiState) => {
      state.zoom = clamp(state.zoom + state.zoomDelta, .15, 1);
      state.zoomDelta = 0;

      state.position = [
        clamp(state.position[0] + state.positionDelta[0], -50, 50),
        clamp(state.position[1] + state.positionDelta[1], -50, 50)
      ];
      state.positionDelta = [0, 0];
    },
    setPosition: (state, action: PayloadAction<Coordinate>) => {
      state.position = action.payload;
    },
    resetZoom: (state: UiState) => {
      state.zoom = initialState.zoom;
    },
    resetPosition: (state: UiState) => {
      state.position = initialState.position;
    }
  } 
});

export const { setDeltaValues, releaseDeltas, setZoom, setZoomDelta, setPosition, resetZoom, resetPosition } = uiSlice.actions;

export const getZoom = (state: RootState) => state.ui.zoom;
export const getZoomDelta = (state: RootState) => state.ui.zoomDelta;
export const getPosition = (state: RootState) => state.ui.position;
export const getPositionDelta = (state: RootState) => state.ui.positionDelta;

export const selectZoom = createSelector(
  [getZoom, getZoomDelta], 
  (zoom, zoomDelta) => {
    return clamp(zoom + zoomDelta, .15, 1);
  }
);

export const selectPosition = createSelector(
  [getPosition, getPositionDelta], 
  (position, positionDelta) => [
    clamp(position[0] + positionDelta[0], -50, 50),
    clamp(position[1] + positionDelta[1], -50, 50)
  ]
);
export default uiSlice.reducer;