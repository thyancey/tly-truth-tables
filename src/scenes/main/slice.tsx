import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import { AttributeDef, CellMatrix, CellObj, RoundData } from '../../types';
import { GRIDSHAPES, SAMPLE_ROUNDDATA } from '../../app/data/data';


export interface GridState {
  roundData: RoundData,
  cellMatrix: CellMatrix
}

const initialState: GridState = {
  roundData: SAMPLE_ROUNDDATA[0],
  cellMatrix: []
};

export const gridSlice = createSlice({
  name: 'board',
  initialState,
  reducers: {
    resetMatrix: (state: GridState) => {
      if(state.roundData.attributes?.length > 0){
        const numAttributes = state.roundData.attributes?.length || 0;
        const boxSize = Math.pow(state.roundData.valueSize, 2);
        if(numAttributes > 1 && numAttributes < 6){
          const gridShape = GRIDSHAPES[numAttributes.toString()];
          const newMatrix = [];

          let idx = 0;
          for(let r = 0; r < gridShape.length; r++){
            for(let c = 0; c < gridShape[r].length; c ++){
              for(let bi = 0; bi < boxSize; bi++){
                newMatrix.push({
                  idx: idx++,
                  status: 0
                } as CellObj)
              }

            }
          }
          state.cellMatrix = newMatrix;
        } else{
          console.error('must have between 2 and 5 attributes');
          state.cellMatrix = [];
        }
      } else {
        state.cellMatrix = [];
      }
    },
    rotateCell: (state, action: PayloadAction<number>) => {
      if(state.cellMatrix){
        const nextStatus = getNextStatus(state.cellMatrix[action.payload]);
        state.cellMatrix[action.payload].status = nextStatus;
      }
    },
  }
});

const getNextStatus = (cellObj: CellObj) => {
  try{
    switch(cellObj.status){
      case 0: return 1;
      case 1: return 2;
      case 2: return 0;
    }
  } catch(e){
    console.error('unexpected lookup for cellObj', cellObj)
  }

  return 0;
}

export const { resetMatrix, rotateCell } = gridSlice.actions;

export const getCellMatrix = (state: RootState) => state.board.cellMatrix;
export const getRoundData = (state: RootState) => state.board.roundData;

// export const getGridBox = (state: RootState) => 

const getGridShape = (numAttributes = 0) => {
  if(numAttributes < 2 || numAttributes > 5){
    console.error('getGridShape(): must have between 2 and 5 attributes');
  } else {
    return GRIDSHAPES[numAttributes.toString()];
  }

  return [];
}

export const selectGridBox = createSelector(
  [getRoundData, getCellMatrix],
  (roundData, cellMatrix) => {
    const gridShape = getGridShape(roundData.attributes?.length);
    let r = 0;
    let c = 0;
    let idx = 0;
    const boxSize = Math.pow(roundData.valueSize, 2);
    return gridShape?.map((row, rIdx) => {
      return row.map(cell => {
        console.log('cell', cell)
        let boxArr = [];
        for(let i = 0; i < boxSize; i++){
          boxArr.push(
            cellMatrix[idx++]
          )
        }
        return boxArr;
        // return 'hi'
      })
    })
  }
)

export const selectGridLabels = createSelector(
  [getRoundData],
  (roundData): [ rows: AttributeDef[], cols: AttributeDef[] ] => {
    const gridShape = getGridShape(roundData.attributes?.length);
    const rowAttributes = gridShape.map(r => r[0][0]);
    const colAttributes = gridShape[0].map(rc => rc[1]);

    return [
      rowAttributes.map(idx => roundData.attributes[idx]),
      colAttributes.map(idx => roundData.attributes[idx])
    ]
  }
);

export const selectCellMatrix = createSelector(
  [getCellMatrix, getRoundData],
  (cellMatrix, roundData): CellMatrix => {
    return cellMatrix
  }
);

export default gridSlice.reducer;