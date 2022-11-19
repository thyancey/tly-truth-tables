import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from './store';
import { AnswerSet, AttributeMatrix, CellMatrix, CellObj, GameStatus, HintGiver, RawCell, RenderedHint, LevelData, LevelInfo, SimpleAttributeDef, RenderedMenuGroup } from '../types';
import { getGridShape, LEVELDATA, HINT_GIVERS, LEVELMENU } from './data/data';
import { generateCellMatrix } from '../utils/puzzler';

export interface GridState {
  cellMatrix: CellMatrix,
  hintGivers: number[],
  gameStatus: GameStatus,
  levelIdx: number,
  hintIdx: number,
  gameReady: boolean
}

const initialState: GridState = {
  cellMatrix: [],
  hintGivers: [],
  gameStatus: 'start',
  levelIdx: -1,
  hintIdx: -1,
  gameReady: false
};


export const boardSlice = createSlice({
  name: 'board',
  initialState,
  reducers: {
    resetMatrix: (state: GridState, action: PayloadAction<LevelData>) => {
      const levelData = action.payload;
      if(levelData.attributes?.length > 0){
        const numAttributes = levelData.attributes.length || 0;
        const numValues = levelData.attributes[0].length;
        if(numAttributes < 2 || numAttributes > 5){
          console.error('invalid data, must use between 2 and 5 attributes');
        }

        state.cellMatrix = generateCellMatrix(levelData.hardcoded.answers, numValues, numAttributes);

        let hgIdx = Math.floor(Math.random() * HINT_GIVERS.length);
        state.hintGivers = levelData.hardcoded.hints.map((hT, i) => (hgIdx + i) % HINT_GIVERS.length);

        state.hintIdx = -1;
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
      state.hintIdx = action.payload;
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
    startLevel: (state, action: PayloadAction<number>) => {
      state.gameReady = false;
      state.gameStatus = 'loading';
      state.levelIdx = getNextLevelIdx(action.payload - 1);
    },
    restartLevel: (state) => {
      state.gameReady = false;
      state.gameStatus = 'loading';
      state.levelIdx = getNextLevelIdx(state.levelIdx - 1);
    },
    startNextLevel: (state) => {
      state.gameReady = false;
      state.gameStatus = 'loading';
      state.levelIdx = getNextLevelIdx(state.levelIdx);
    },
  } 
});

export const { resetMatrix, rotateCell, setActiveHint, submitAnswer, startLevel, startNextLevel, restartLevel, setGameStatus } = boardSlice.actions;



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
export const getHintGivers = (state: RootState) => state.board.hintGivers;
export const getActiveHintIdx = (state: RootState) => state.board.hintIdx;
export const getGameStatus = (state: RootState) => state.board.gameStatus;
export const getLevelIdx = (state: RootState) => state.board.levelIdx;
export const getGameReady = (state: RootState) => state.board.gameReady;

export const renderHint = (hintGiverIdx: number, text: string) => ({
  hintGiver: HINT_GIVERS[hintGiverIdx],
  text: text
});

export const getNextLevelIdx = (curIdx: number) => {
  if(curIdx + 1 < LEVELDATA.length){
    return curIdx + 1;
  }

  // for now, just start over!
  return 0;
};

export const selectLevelData = createSelector(
  [getLevelIdx],
  (levelIdx): LevelData => {
    return LEVELDATA[levelIdx]
  }
);

export const selectHardcodedHints = createSelector(
  [selectLevelData],
  (levelData): string[] => levelData.hardcoded.hints
);

export const selectLevelInfo = createSelector(
  [selectLevelData, getLevelIdx],
  (levelData, levelIdx): LevelInfo | null => {
    if(!levelData) return null;
    return {
      title: levelData.title,
      description: levelData.description,
      level: levelIdx
    };
  }
);

// export const getCompletedLevels = (state: RootState) => [0, 2];
export const getCompletedLevels = (state: RootState): number[] => [];
export const getLevelMenu = (state: RootState) => LEVELMENU;


// eventually, merge in saved progress
export const selectAllLevelInfo = createSelector(
  [getCompletedLevels, getLevelMenu],
  (completedLevels, levelMenu): RenderedMenuGroup[] => {
    const levels = LEVELDATA.map((levelData, idx) => ({
      title: levelData.title,
      description: levelData.description,
      layout: levelData.layout,
      completed: completedLevels.includes(idx),
      level: idx
    }));

    return levelMenu.map((menuGroup, idx) => ({
      title: menuGroup.title,
      levels: menuGroup.levels.map(lId => levels[lId])
    })).filter(levelMenu => levelMenu.levels.length > 0);
  }
);

export const selectHints = createSelector(
  [getHintGivers, selectLevelData],
  (hintGivers, levelData): RenderedHint[] => {
    if(!levelData) return [];
    return hintGivers.map(hIdx => renderHint(hIdx, levelData.hardcoded.hints[hIdx]))
  }
);

export const selectActiveHint = createSelector(
  [getActiveHintIdx, selectLevelData, getHintGivers],
  (activeHintIdx, levelData, hintGivers): RenderedHint | null => {
    if(!levelData || activeHintIdx === -1){
      return null;
    }

    return renderHint(hintGivers[activeHintIdx], levelData.hardcoded.hints[activeHintIdx]);
  }
);

export const selectActiveHintGiver = createSelector(
  [selectActiveHint],
  (activeHint): HintGiver | null => activeHint?.hintGiver || null
);

export const selectAttributes = createSelector(
  [selectLevelData],
  (levelData) => levelData.attributes
);

export const selectGridInfo = createSelector(
  [selectLevelData],
  (levelData) => ({
    numAttributes: levelData.attributes.length,
    numValues: levelData.attributes[0].length
  })
);

export const selectGridLabels = createSelector(
  [selectAttributes],
  (attributes): [ rows: SimpleAttributeDef[], cols: SimpleAttributeDef[] ] => {
    const gridShape:RawCell[][] = getGridShape(attributes.length);
    const rowAttributes = gridShape.map(r => r[0][0]);
    const colAttributes = gridShape[0].map(rc => rc[1]);

    return [
      rowAttributes.map(idx => attributes[idx]),
      colAttributes.map(idx => attributes[idx])
    ];
  }
);

export const selectGridBox = createSelector(
  [getCellMatrix, selectGridInfo],
  (cellMatrix, gridInfo) => {
    const gridShape: RawCell[][] = getGridShape(gridInfo.numAttributes);
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
  [selectLevelData],
  (levelData) => levelData?.hardcoded.answers || null
)

export const selectRenderedSolution = createSelector(
  [selectSolution, selectAttributes],
  (solution, attributes) => solution?.map(solution => {
    console.log(solution, attributes);

    return solution.map((vIdx,sIdx) => 
      attributes[sIdx][vIdx]
    )
  })
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

export default boardSlice.reducer;