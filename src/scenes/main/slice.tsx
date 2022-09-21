import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import { AnswerSet, AttributeDef, AttributeMatrix, CellMatrix, CellObj, RawCell, RoundData } from '../../types';
import { GRIDSHAPES, SAMPLE_ROUNDDATA } from '../../app/data/data';

export interface GridState {
  roundData: RoundData,
  cellMatrix: CellMatrix,
  solution: AnswerSet | null
}

const initialState: GridState = {
  roundData: SAMPLE_ROUNDDATA[1],
  cellMatrix: [],
  solution: null
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
        // const numAttributes = state.roundData.attributes?.length || 0;
        // const valueSize = state.roundData.valueSize
        // const attrMatrix = getAttributeMatrixForCellIndex(action.payload, numAttributes, valueSize);
        // const renderedAnswer = getRenderedAttributes(attrMatrix, state.roundData.attributes);
        // console.log('debug: clicked cell with', ...renderedAnswer);

        const nextStatus = getNextStatus(state.cellMatrix[action.payload]);
        state.cellMatrix[action.payload].status = nextStatus;
      }
    },
    // make a unique combination of each attribute/value, with no overlaps.
    // This is the solution to the current truth table.
    generateSolution: (state) => {
      const numAnswers = state.roundData.valueSize;
      const numAttributes = state.roundData.attributes.length;

      const availableAttributes = [];
      for(let i = 0; i < numAttributes; i++){
        availableAttributes.push(Array.from(Array(numAnswers).keys()))
      }
  
      let generatedAnswer = [];
      for(let i = 0; i < numAnswers; i++){
        let answerAttrs = [];
        for(let i = 0; i < availableAttributes.length; i++){
          const randIdx = Math.floor(Math.random() * availableAttributes[i].length);
          answerAttrs.push(availableAttributes[i][randIdx]);
          availableAttributes[i].splice(randIdx, 1);
        }
        generatedAnswer.push(answerAttrs)
      }

      console.log('generated solution: ', generatedAnswer)
      state.solution = generatedAnswer;
    }
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

export const { resetMatrix, rotateCell, generateSolution } = gridSlice.actions;

export const getCellMatrix = (state: RootState) => state.board.cellMatrix;
export const getRoundData = (state: RootState) => state.board.roundData;
export const getSolution = (state: RootState) => state.board.solution;
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
    let idx = 0;
    const gridSize = gridShape[0].length;

    const boxSize = Math.pow(roundData.valueSize, 2);
    return gridShape?.map((row, rIdx) => {
      return [...Array(gridSize)].map((_, cIdx) => {
        let boxArr: CellObj[] = [];
        if(!gridShape[rIdx][cIdx]){
          // handles empty cells in larger maps
          return boxArr;
        }

        for(let i = 0; i < boxSize; i++){
          boxArr.push(
            cellMatrix[idx++]
          )
        }
        return boxArr;
      })
    })
  }
)

export const selectGridInfo = createSelector(
  [getRoundData],
  (roundData) => ({
    numAttributes: roundData.attributes.length,
    gridSize: roundData.valueSize
  })
);

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

const getAttributePairFromIndex = (attrPair: RawCell, attributes: AttributeDef[]) => {
  const attr = attributes[attrPair[0]];
  return {
    id: attr.id,
    value: attr.values[attrPair[1]]
  }
}

export const getRenderedAttributes = (attributeMatrix:AttributeMatrix, attributes: AttributeDef[]) => {
  return [
    getAttributePairFromIndex(attributeMatrix[0], attributes),
    getAttributePairFromIndex(attributeMatrix[1], attributes)
  ];
}

export const getBoxAttributes = (boxIdx: number, numAttributes: number) => {
  const gridShape = GRIDSHAPES[numAttributes.toString()];
  const flatGrid = gridShape.flat();
  return flatGrid[boxIdx];
}

export const getAttributeMatrixForCellIndex = (cellIndex: number, numAttributes: number, numValues: number) => {
  const boxSize = Math.pow(numValues, 2);
  const boxIdx = Math.floor(cellIndex / boxSize);
  const boxAttrs = getBoxAttributes(boxIdx, numAttributes);

  const rowIdx = Math.floor((cellIndex % boxSize) / numValues);
  const colIdx = cellIndex % numValues;

  const attrMatrix: AttributeMatrix = [
    [boxAttrs[0], rowIdx],
    [boxAttrs[1], colIdx],
  ]

  return attrMatrix;
}

export const selectCurrentAnswer = createSelector(
  [getRoundData, getCellMatrix, getSolution],
  (roundData, cellMatrix, solution) => ({
    roundData: roundData,
    cellMatrix: cellMatrix,
    solution: solution
  })
);

export const selectGreenCells = createSelector(
  [getCellMatrix],
  (cellMatrix) => {
    return cellMatrix.filter(c => c.status === 1);
  }
);
  
export const selectSolution = createSelector(
  [getSolution, getRoundData],
  (solution, roundData) => solution?.map(solution => 
    solution.map((vIdx,sIdx) => 
      roundData.attributes[sIdx].values[vIdx]
    )
  )
)

export const selectAnswerStuff = createSelector(
  [getRoundData, selectGridInfo, selectGreenCells],
  (roundData, gridInfo, greenCells) => {
    // find solution, return data.
    return greenCells.map(gc => {
      const attrMatrix = getAttributeMatrixForCellIndex(gc.idx, gridInfo.numAttributes, gridInfo.gridSize);
      return getRenderedAttributes(attrMatrix, roundData.attributes);
    });
  }
);

export default gridSlice.reducer;