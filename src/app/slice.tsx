import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from './store';
import { AnswerSet, AttributeMatrix, CellMatrix, CellObj, GameStatus, HintDef, HintGiver, RenderedHint, RoundData, RoundInfo, SimpleAttributeDef } from '../types';
import { getGridShape, SAMPLE_ROUNDDATA, HINT_GIVERS } from './data/data';
import { calcSolution, generateCellMatrix } from '../utils/puzzler';
import { generateHints } from '../utils/hint-generator';

const MAX_HINTS = 8;

export interface GridState {
  roundData: RoundData | null,
  cellMatrix: CellMatrix,
  hints: HintDef[],
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
        const numValues = roundData.attributes[0].length;
        if(numAttributes < 2 || numAttributes > 5){
          console.error('invalid data, must use between 2 and 5 attributes');
        }

        const solutionSet = roundData.hardcoded?.answers ? 
          roundData.hardcoded?.answers
          : calcSolution(numValues, numAttributes);

        state.solution = solutionSet;
        state.cellMatrix = generateCellMatrix(solutionSet, numValues, numAttributes);

        const textHints = roundData.hardcoded?.hints ? 
          roundData.hardcoded?.hints
          : generateHints(solutionSet, roundData.attributesMeta, MAX_HINTS);

        let hgIdx = Math.floor(Math.random() * HINT_GIVERS.length);
        state.hints = textHints.map((hT, i) => ({
          hintGiverIdx: (hgIdx + i) % HINT_GIVERS.length,
          text: hT
        }));

        state.activeHintIdx = 0;
        state.gameStatus = 'playing';
        state.gameReady = true;

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



// blank > no > yes > maybe > blank
const getNextStatus = (cellObj: CellObj) => {
  try{
    switch(cellObj.status){
      case 0: return 2;
      case 2: return 1;
      case 1: return 0;
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

export const renderHint = (hintDef: HintDef) => ({
  hintGiver: HINT_GIVERS[hintDef.hintGiverIdx],
  text: hintDef.text
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
    return SAMPLE_ROUNDDATA[roundIdx]
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
  (activeHint): HintGiver | null => activeHint?.hintGiver || null
);

export const selectAttributes = createSelector(
  [selectRoundData],
  (roundData) => roundData.attributes
);

export const selectGridInfo = createSelector(
  [selectRoundData],
  (roundData) => ({
    numAttributes: roundData.attributes.length,
    numValues: roundData.attributes[0].length
  })
);

export const selectGridLabels = createSelector(
  [selectAttributes],
  (attributes): [ rows: SimpleAttributeDef[], cols: SimpleAttributeDef[] ] => {
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
  [getCellMatrix, selectGridInfo],
  (cellMatrix, gridInfo) => {
    const gridShape = getGridShape(gridInfo.numAttributes);
    let idx = 0;
    const gridSize = gridShape[0].length;
    const boxSize = Math.pow(gridInfo.numValues, 2);
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
      attributes[sIdx][vIdx]
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