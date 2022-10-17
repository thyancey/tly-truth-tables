import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from './store';
import { AnswerSet, AttributeDef, AttributeMatrix, CellMatrix, CellObj, GameStatus, Hint, HintGiver, RenderedHint, RoundData, RoundInfo } from '../types';
import { getGridShape, SAMPLE_ROUNDDATA, HINT_GIVERS } from './data/data';
import { generateHints, parseRoundData } from '../utils/puzzler';

const MAX_HINTS = 8;

export interface GridState {
  roundData: RoundData | null,
  cellMatrix: CellMatrix,
  hints: Hint[],
  activeHintIdx: number,
  solution: AnswerSet | null,
  gameStatus: GameStatus,
  roundIdx: number,
  gameReady: boolean
}

const initialState: GridState = {
  roundData: null,
  cellMatrix: [],
  hints: [],
  activeHintIdx: -1,
  solution: null,
  gameStatus: 'start',
  roundIdx: -1,
  gameReady: false
};


export const gridSlice = createSlice({
  name: 'board',
  initialState,
  reducers: {
    resetMatrix: (state: GridState, action: PayloadAction<RoundData>) => {
      const roundData = action.payload;
      if(roundData.attributes?.length > 0){
        const numAttributes = roundData.attributes.length || 0;
        const numValues = roundData.attributes[0].values.length;
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
          state.gameReady = true;
          state.gameStatus = 'playing';
          state.activeHintIdx = 0;
          state.hints = generateHints(solutionSet, roundData.attributes, HINT_GIVERS, MAX_HINTS);
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
    },
    submitAnswer: (state, action: PayloadAction<boolean>) => {
      console.log('submitAnswer', action.payload);
      if(action.payload === true){
        state.gameStatus = 'roundWin';
      }else{
        state.gameStatus = 'invalidAnswer';
      }
    },
    setGameStatus: (state, action: PayloadAction<GameStatus>) => {
      state.gameStatus = action.payload;
    },
    startRound: (state, action: PayloadAction<number>) => {
      state.gameReady = false;
      state.gameStatus = 'loading';
      state.roundIdx = getNextRoundIdx(action.payload - 1);
    },
    restartRound: (state) => {
      state.gameReady = false;
      state.gameStatus = 'loading';
      state.roundIdx = getNextRoundIdx(state.roundIdx - 1);
    },
    startNextRound: (state) => {
      state.gameReady = false;
      state.gameStatus = 'loading';
      state.roundIdx = getNextRoundIdx(state.roundIdx);
    },
  } 
});

export const { resetMatrix, rotateCell, setActiveHint, submitAnswer, startRound, startNextRound, restartRound, setGameStatus } = gridSlice.actions;



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

// blank > no > yes > maybe > blank
const getNextStatus = (cellObj: CellObj) => {
  try{
    switch(cellObj.status){
      case 0: return 2;
      case 2: return 1;
      case 1: return 3;
      case 3: return 0;
    }
  } catch(e){
    console.error('unexpected lookup for cellObj', cellObj)
  }

  return 0;
}


export const getCellMatrix = (state: RootState) => state.board.cellMatrix;
export const getSolution = (state: RootState) => state.board.solution;
export const getHints = (state: RootState) => state.board.hints;
export const getActiveHintIdx = (state: RootState) => state.board.activeHintIdx;
export const getGameStatus = (state: RootState) => state.board.gameStatus;
export const getRoundIdx = (state: RootState) => state.board.roundIdx;
export const getGameReady = (state: RootState) => state.board.gameReady;

export const renderHint = (hint: Hint) => ({
  hintGiver: HINT_GIVERS[hint.hintGiverIdx],
  text: hint.text
});

export const getNextRoundIdx = (curIdx: number) => {
  if(curIdx + 1 < SAMPLE_ROUNDDATA.length){
    return curIdx + 1;
  }

  // for now, just start over!
  return 0;
};

export const selectRoundData = createSelector(
  [getRoundIdx],
  (roundIdx): RoundData => {
    return parseRoundData(SAMPLE_ROUNDDATA[roundIdx])
  }
);

export const selectRoundInfo = createSelector(
  [selectRoundData, getRoundIdx],
  (roundData, roundIdx): RoundInfo | null => {
    if(!roundData) return null;
    return {
      title: roundData.title,
      description: roundData.description,
      level: roundIdx + 1
    }
  }
);

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

export const selectActiveHintGiver = createSelector(
  [selectActiveHint],
  (activeHint): HintGiver | null => activeHint && activeHint.hintGiver || null
);

export const selectAttributes = createSelector(
  [selectRoundData],
  (roundData) => roundData.attributes
);

export const selectGridInfo = createSelector(
  [selectRoundData],
  (roundData) => ({
    numAttributes: roundData.attributes.length,
    gridSize: roundData.attributes[0].values.length
  })
);

export const selectGridLabels = createSelector(
  [selectAttributes],
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
  [selectRoundData, getCellMatrix],
  (roundData, cellMatrix) => {
    const gridShape = getGridShape(roundData.attributes.length);
    const numValues = roundData.attributes[0].values.length;
    let idx = 0;
    const gridSize = gridShape[0].length;

    const boxSize = Math.pow(numValues, 2);
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

export const selectSolution = createSelector(
  [getSolution, selectAttributes],
  (solution, attributes) => solution?.map(solution => 
    solution.map((vIdx,sIdx) => 
      attributes[sIdx].values[vIdx].id
    )
  )
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