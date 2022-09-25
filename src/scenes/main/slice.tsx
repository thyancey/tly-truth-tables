import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import { AnswerSet, AttributeDef, AttributeMatrix, CellMatrix, CellObj, Hint, RawCell, RenderedHint, RoundData } from '../../types';
import { getGridShape, SAMPLE_ROUNDDATA, HINT_GIVERS } from '../../app/data/data';

export interface GridState {
  roundData: RoundData,
  cellMatrix: CellMatrix,
  hints: Hint[],
  activeHintIdx: number,
  solution: AnswerSet | null
}

const initialState: GridState = {
  roundData: SAMPLE_ROUNDDATA[0],
  cellMatrix: [],
  hints: [],
  activeHintIdx: -1,
  solution: null
};

export const gridSlice = createSlice({
  name: 'board',
  initialState,
  reducers: {
    resetMatrix: (state: GridState) => {
      if(state.roundData.attributes?.length > 0){
        const numAttributes = state.roundData.attributes?.length || 0;
        const numValues = state.roundData.valueSize;
        const boxSize = Math.pow(numValues, 2);

        if(numAttributes > 1 && numAttributes < 6){
          const solutionSet = calcSolution(numValues, numAttributes);

          const gridShape = getGridShape(numAttributes);
          const newMatrix = [];

          let idx = 0;
          for(let r = 0; r < gridShape.length; r++){
            for(let c = 0; c < gridShape[r].length; c ++){
              for(let bi = 0; bi < boxSize; bi++){
                // [ 0, 1 ] is comparing attr0 and attr1
                const attrPair = gridShape[r][c];
                const xVal = Math.floor((idx % boxSize) / numValues);
                const yVal = idx % numValues;

                const ansMatrix: AttributeMatrix = [ [ attrPair[0], xVal ], [attrPair[1], yVal ] ]
                const isSolution = isCellSolution(solutionSet, ansMatrix)

                newMatrix.push({
                  idx: idx++,
                  attrs: attrPair,
                  isSolution: isSolution,
                  status: 0
                } as CellObj)
              }
            }
          }

          state.solution = solutionSet;
          state.cellMatrix = newMatrix;
          state.hints = [
            {
              hintGiverIdx: Math.floor(Math.random() * HINT_GIVERS.length),
              text: 'The first one in line lives on land'
            },
            {
              hintGiverIdx: Math.floor(Math.random() * HINT_GIVERS.length),
              text: 'Ugh it\'s one of those creepy... sad clowns'
            },
            {
              hintGiverIdx: Math.floor(Math.random() * HINT_GIVERS.length),
              text: 'The dentist showed up after the firefighter'
            }
          ];
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
    setActiveHint: (state, action: PayloadAction<number>) => {
      if(action.payload > -1 && !state.hints[action.payload]) console.error(`cannot set invalid hint ${action.payload}`);
      state.activeHintIdx = action.payload;
    }
  }
});


// answer set is the raw attributes (in order) and their values
/// [1, 1, 1] would mean a valueIdx of 1 for attributes 0, 1, and 2

// attrMatrix is a 2d array of attrIdx and numberIdx, so [[0,0],[2,0]] compares the 1st val of attr[0] with the 1st value of attr[2]
export const isCellSolution = (answerSet: AnswerSet, attrMatrix: AttributeMatrix) => {
  for(let a = 0; a < answerSet.length; a++){
    if(attrMatrix.filter(attrPair => answerSet[a][attrPair[0]] === attrPair[1]).length === 2) return true;
  }

  return false;
}

// make a unique combination of each attribute/value, with no overlaps.
// This is the solution to the current truth table.
const calcSolution = (numAnswers: number, numAttributes:number): AnswerSet => {
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

  return generatedAnswer;
}

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

export const { resetMatrix, rotateCell, setActiveHint } = gridSlice.actions;

export const getCellMatrix = (state: RootState) => state.board.cellMatrix;
export const getRoundData = (state: RootState) => state.board.roundData;
export const getSolution = (state: RootState) => state.board.solution;
export const getHints = (state: RootState) => state.board.hints;
export const getActiveHintIdx = (state: RootState) => state.board.activeHintIdx;

export const renderHint = (hint: Hint) => ({
  hintGiver: HINT_GIVERS[hint.hintGiverIdx],
  text: hint.text
});

export const selectHints = createSelector(
  [getHints],
  (hints): RenderedHint[] => hints.map(h => renderHint(h))
);

export const selectActiveHint = createSelector(
  [getHints, getActiveHintIdx],
  (hints, activeHintIdx): RenderedHint | null => {
    if(activeHintIdx === -1){
      return null;
    }

    return renderHint(hints[activeHintIdx]);
  }
);

export const selectRoundAttributes = createSelector(
  [getRoundData],
  (roundData) => roundData.attributes
);

export const selectGridInfo = createSelector(
  [getRoundData],
  (roundData) => ({
    numAttributes: roundData.attributes.length,
    gridSize: roundData.valueSize
  })
);

export const selectGridLabels = createSelector(
  [selectRoundAttributes],
  (attributes): [ rows: AttributeDef[], cols: AttributeDef[] ] => {
    const gridShape = getGridShape(attributes.length);
    const rowAttributes = gridShape.map(r => r[0][0]);
    const colAttributes = gridShape[0].map(rc => rc[1]);

    return [
      rowAttributes.map(idx => attributes[idx]),
      colAttributes.map(idx => attributes[idx])
    ]
  }
);

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
);

const getAttributePairFromIndex = (attrPair: RawCell, attributes: AttributeDef[]) => {
  const attr = attributes[attrPair[0]];
  return {
    id: attr.id,
    value: attr.values[attrPair[1]]
  }
};

export const getRenderedAttributes = (attributeMatrix:AttributeMatrix, attributes: AttributeDef[]) => {
  return [
    getAttributePairFromIndex(attributeMatrix[0], attributes),
    getAttributePairFromIndex(attributeMatrix[1], attributes)
  ];
};

export const getBoxAttributes = (boxIdx: number, numAttributes: number) => {
  const gridShape = getGridShape(numAttributes);
  const flatGrid = gridShape.flat();
  return flatGrid[boxIdx];
};

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
};

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
);

// find solutions, return data.
export const selectAnswerMatrix = createSelector(
  [selectGridInfo, selectGreenCells],
  (gridInfo, greenCells) => {
    return greenCells.map(gc =>
      getAttributeMatrixForCellIndex(gc.idx, gridInfo.numAttributes, gridInfo.gridSize)
    );
  }
);

// if every "solution" cell has a 1 status, and there are not extra answers
export const checkIfSolved = createSelector(
  [getCellMatrix],
  (cellMatrix) => {
    const numExpected = cellMatrix.filter(cell => cell.isSolution).length;
    const answeredCells = cellMatrix.filter(cell => cell.status === 1);
    if(answeredCells.length !== numExpected) return false;

    const expectedCells = cellMatrix.filter(cell => cell.isSolution);
    for(let i = 0; i < expectedCells.length; i++){
      if(!answeredCells.find(aC => aC.idx === expectedCells[i].idx)){
        return false;
      }
    }
    return true;
  }
);

export default gridSlice.reducer;