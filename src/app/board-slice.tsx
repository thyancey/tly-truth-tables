import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from './store';
import { SolutionSet, AttributeMatrix, CellMatrix, CellObj, GameStatus, HintGiver, RawCell, RenderedHint, LevelData, LevelInfo, RenderedMenuGroup, SolvedType, GridLabels } from '../types';
import { getGridShape, LEVELDATA, HINT_GIVERS, LEVELMENU } from './data/data';
import { generateCellMatrix } from '../utils/puzzler';
import { STORE_SCHEMA } from '../utils/localstorage';

export interface GridState {
  storeSchema: number,
  cellMatrix: CellMatrix,
  hintGivers: number[],
  prevGameStatus: GameStatus,
  gameStatus: GameStatus,
  levelIdx: number,
  hintIdx: number,
  progression: number[],
  gameReady: boolean
}

const initialState: GridState = {
  storeSchema: STORE_SCHEMA,
  cellMatrix: [],
  hintGivers: [],
  prevGameStatus: 'start',
  gameStatus: 'start',
  levelIdx: -1,
  hintIdx: -1,
  progression: [],
  gameReady: false
};

type ResetType = {
  levelData: LevelData,
  resume?: boolean
}
export const getHintIdxById = (id:string) => {
  const foundIdx = HINT_GIVERS.findIndex(hg => hg.id === id);
  if(foundIdx === -1) console.error(`could not find hintgiver with id "${id}"`);
  return foundIdx;
};

export const boardSlice = createSlice({
  name: 'board',
  initialState,
  reducers: {
    resetMatrix: (state: GridState, action: PayloadAction<ResetType>) => {
      const levelData = action.payload.levelData;
      if(action.payload.resume && state.cellMatrix.length > 0){
        state.hintIdx = -1;
        state.gameStatus = 'playing';
        state.gameReady = true;
      }else{
        if(levelData.attributes?.length > 0){
          state.cellMatrix = generateCellMatrix(levelData.solution, levelData.attributes);
  
          let hintGivers: number[] = [];
          levelData.hints.forEach((hint, hIdx) => {
            if(hint[1]){
              const foundIdx = getHintIdxById(hint[1]);
              if(foundIdx !== -1) hintGivers.push(foundIdx);
            }else{
              hintGivers.push(Math.floor(Math.random() * HINT_GIVERS.length));
            }
          });

          state.hintGivers = hintGivers;
          state.hintIdx = -1;
          state.gameStatus = 'playing';
          state.gameReady = true;
  
        } else {
          state.cellMatrix = [];
        }
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
      if(action.payload === true){
        if(!state.progression.includes(state.levelIdx)){
          state.progression.push(state.levelIdx)
        }
        state.gameStatus = 'roundWin';
      }else{
        state.gameStatus = 'invalidAnswer';
      }
    },
    setGameStatus: (state, action: PayloadAction<GameStatus>) => {
      if(action.payload !== state.prevGameStatus && state.gameStatus !== state.prevGameStatus){
        state.prevGameStatus = state.gameStatus;
      }
      state.gameStatus = action.payload;
    },
    resumeLevel: (state, action: PayloadAction<number>) => {
      state.gameReady = false;
      state.gameStatus = 'loadingResume';
      state.levelIdx = action.payload;
    },
    startLevel: (state, action: PayloadAction<number>) => {
      state.gameReady = false;
      state.gameStatus = 'loading';
      state.levelIdx = action.payload;
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

export const { resetMatrix, rotateCell, setActiveHint, submitAnswer, startLevel, resumeLevel, startNextLevel, restartLevel, setGameStatus } = boardSlice.actions;



// answer set is the raw attributes (in order) and their values
/// [1, 1, 1] would mean a valueIdx of 1 for attributes 0, 1, and 2

// attrMatrix is a 2d array of attrIdx and numberIdx, so [[0,0],[2,0]] compares the 1st val of attr[0] with the 1st value of attr[2]
export const isCellSolution = (answerSet: SolutionSet, attrMatrix: AttributeMatrix) => {
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
export const getPrevGameStatus = (state: RootState) => state.board.prevGameStatus;
export const getLevelIdx = (state: RootState) => state.board.levelIdx;
export const getGameReady = (state: RootState) => state.board.gameReady;
export const getProgression = (state: RootState) => state.board.progression;
// export const getProgression = (state: RootState) => [0,1];

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

export const selectLevelInfo = createSelector(
  [selectLevelData, getLevelIdx, getProgression],
  (levelData, levelIdx, progression): LevelInfo | null => {
    if(!levelData) return null;
    return {
      title: levelData.title,
      description: levelData.description,
      layout: levelData.layout,
      completed: progression.includes(levelIdx),
      current: true,
      level: levelIdx
    };
  }
);

export const getLevelMenu = (state: RootState) => LEVELMENU;


// eventually, merge in saved progress
export const selectAllLevelInfo = createSelector(
  [getProgression, getLevelMenu, getLevelIdx],
  (progression, levelMenu, levelIdx): RenderedMenuGroup[] => {
    const levels = LEVELDATA.map((levelData, idx) => ({
      title: levelData.title,
      description: levelData.description,
      layout: levelData.layout,
      completed: progression.includes(idx),
      current: idx === levelIdx,
      level: idx
    }));

    return levelMenu.map(menuGroup => ({
      title: menuGroup.title,
      levels: menuGroup.levels.map(lId => levels[lId])
    })).filter(levelMenu => levelMenu.levels.length > 0);
  }
);

export const selectHints = createSelector(
  [getHintGivers, selectLevelData],
  (hintGivers, levelData): RenderedHint[] => {
    if(!levelData) return [];
    return levelData.hints.map((h, hIdx) => renderHint(hintGivers[hIdx], h[0]));
  }
);

export const selectActiveHint = createSelector(
  [getActiveHintIdx, selectLevelData, getHintGivers],
  (activeHintIdx, levelData, hintGivers): RenderedHint | null => {
    if(!levelData || activeHintIdx === -1){
      return null;
    }
    // hack, otherwise when clue 3 is active, and switching to a level with 2 hints, errors out
    if(activeHintIdx > levelData.hints.length){
      return null;
    }

    return renderHint(hintGivers[activeHintIdx], levelData.hints[activeHintIdx][0]);
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
export const selectAttributeLabels = createSelector(
  [selectLevelData],
  (levelData) => levelData.attributeLabels
);

export const selectGridInfo = createSelector(
  [selectLevelData],
  (levelData) => ({
    numAttributes: levelData.attributes.length,
    numValues: levelData.attributes[0].length
  })
);

export const selectGridLabels = createSelector(
  [selectAttributes, selectAttributeLabels],
  (attributes, attributeLabels): GridLabels => {
    const gridShape:RawCell[][] = getGridShape(attributes.length);
    const rowAttributes = gridShape.map(r => r[0][0]);
    const colAttributes = gridShape[0].map(rc => rc[1]);

    return {
      rows:{
        attributes:rowAttributes.map(idx => attributes[idx]),
        labels:rowAttributes.map(idx => attributeLabels[idx])
      },
      cols:{
        attributes:colAttributes.map(idx => attributes[idx]),
        labels:colAttributes.map(idx => attributeLabels[idx])
      }
    }
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
  (levelData) => levelData?.solution || null
)

export const selectRenderedSolution = createSelector(
  [selectSolution, selectAttributes],
  (solution, attributes) => solution?.map(solution => {
    return solution.map((vIdx,sIdx) => 
      attributes[sIdx][vIdx]
    )
  })
);

export const selectAnsweredCells = createSelector(
  [getCellMatrix],
  (cellMatrix): CellObj[] => cellMatrix.filter(cell => cell.status === 1)
);
export const selectSolutionCells = createSelector(
  [getCellMatrix],
  (cellMatrix): CellObj[] => cellMatrix.filter(cell => cell.isSolution)
);

// if every "solution" cell has a 1 status, and there are not extra answers
export const checkIfSolved = createSelector(
  [selectAnsweredCells, selectSolutionCells],
  (answeredCells, solutionCells): SolvedType => {
    const numExpected = solutionCells.length;
    if(answeredCells.length > numExpected) {
      return 'incorrect';
    } else if(answeredCells.length < numExpected) {
      return 'incomplete';
    }

    for(let i = 0; i < solutionCells.length; i++){
      if(!answeredCells.find(aC => aC.idx === solutionCells[i].idx)){
        return 'incorrect';
      }
    }
    return 'correct';
  }
);

export default boardSlice.reducer;