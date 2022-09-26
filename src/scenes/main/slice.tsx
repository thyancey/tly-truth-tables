import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import { AnswerSet, AttributeDef, AttributeDetail, AttributeIdxPair, AttributeMatrix, CalculatedHint, CellMatrix, CellObj, Hint, HintGiver, RawCell, RenderedHint, RoundData, RoundStatus } from '../../types';
import { getGridShape, SAMPLE_ROUNDDATA, HINT_GIVERS } from '../../app/data/data';
import { RandIdx } from '../../utils';

const NUM_HINTS = 6;
const ROUND_IDX = 0;


export interface GridState {
  roundData: RoundData,
  cellMatrix: CellMatrix,
  hints: Hint[],
  activeHintIdx: number,
  solution: AnswerSet | null,
  roundStatus: RoundStatus
}

const initialState: GridState = {
  roundData: SAMPLE_ROUNDDATA[ROUND_IDX],
  cellMatrix: [],
  hints: [],
  activeHintIdx: -1,
  solution: null,
  roundStatus: 'idle'
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
          state.hints = generateHints(solutionSet, state.roundData.attributes, HINT_GIVERS);
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
        state.roundStatus = 'correct';
      }else{
        state.roundStatus = 'incorrect';
      }
    }
  } 
});

export const { resetMatrix, rotateCell, setActiveHint, submitAnswer } = gridSlice.actions;

// answer set is the raw attributes (in order) and their values
/// [1, 1, 1] would mean a valueIdx of 1 for attributes 0, 1, and 2

// attrMatrix is a 2d array of attrIdx and numberIdx, so [[0,0],[2,0]] compares the 1st val of attr[0] with the 1st value of attr[2]
export const isCellSolution = (answerSet: AnswerSet, attrMatrix: AttributeMatrix) => {
  for(let a = 0; a < answerSet.length; a++){
    if(attrMatrix.filter(attrPair => answerSet[a][attrPair[0]] === attrPair[1]).length === 2) return true;
  }

  return false;
}

export const generateHint = (attrDetails: AttributeDetail[][], usedCombos: AttributeIdxPair[]): CalculatedHint | null => {

  /*
    - pick random attribute/value A
    - pick random attribute/value B

    - determine conditionals based on attrB and attrA
      - are they from the same group?
      - what are the attribute types? (normal, time, order)
      - how to compare? (is, is not, is [before, after, first, last])

    - "{attrA} {conditional} {attrB}"

    - "The {animal: monkey} is not the {job: doctor}"
    >>> "The monkey is not the doctor"
    - "The {animal: monkey} is the {queue: first}"
    >>> "The monkey is the first one"
  */
    let reserved = [];
    const groupA_idx = RandIdx(0, attrDetails.length);
    const groupB_idx = RandIdx(0, attrDetails.length);
    
    const groupA = attrDetails[groupA_idx];
    const groupB = attrDetails[groupB_idx];

    // const valA_used = usedCombos.filter(used => used[0] === groupA_idx);

    /*
    const filteredA = groupA.filter(attrDetail => {
      // attr already used once
      if(usedCombos.find(usedCombo => usedCombo[0] === attrDetail.attributeIdx)){
        return false;
      }
      return true;
      // attrDetail.attributeIdx !== attrA_idx
    });
    if (filteredA.length === 0){
      console.log('ran out of valid hint material');
      return null;
    }
    */
   const filteredA = groupA;

    const attrA_idx = RandIdx(0, filteredA.length);
    const attrA = filteredA[attrA_idx];

    const filteredB = groupB.filter(attrDetail => attrDetail.attributeIdx !== attrA_idx);
    const attrB_idx = RandIdx(0, filteredB.length);
    const attrB = filteredB[attrB_idx];

    const hintText = generateHintText(attrA, attrB, groupA_idx === groupB_idx);

    // console.log('text: ', hintText)
    // console.log('---------')
    return {
      text: hintText,
      used: [
        [ attrA.attributeIdx, attrA.valueIdx ],
        [ attrB.attributeIdx, attrB.valueIdx ]
      ]
    }
}

export const generateHintText = (attrA: AttributeDetail, attrB: AttributeDetail, fromSameGroup?:boolean) => {
  // if both are order.. do soemthing special
  if(attrA.attributeIdx === attrB.attributeIdx && attrA.type === 'order'){
    // this is a bad comparison
    return '(bad comparison)';
  }
  let prefix = '';
  let suffix = '';

  switch(attrA.type){
    case 'modifier': prefix = `The ${attrA.value} one`;
      break;
    case 'order': prefix = `The ${attrA.value} one`;
      break;
    default: prefix = `The ${attrA.value}`;
  }

  switch(attrB.type){
    case 'thing': suffix = `${fromSameGroup ? 'is' : 'is not'} a ${attrB.value}`;
      break;
    case 'modifier': suffix = `${fromSameGroup ? 'is' : 'is not'} ${attrB.value}`;
      break;
    case 'order': suffix = `${fromSameGroup ? 'is' : 'is not'} the ${attrB.value} one`;
      break;
    default: suffix = `${fromSameGroup ? 'is' : 'is not'} a ${attrB.value}`;
  }

  return `${prefix} ${suffix}.`;
}

export const generateHints = (solutions: AnswerSet, attributes: AttributeDef[], hintGivers: HintGiver[]) => {
  console.log('solutions', solutions);
  console.log('attributes', attributes.map(a => a));

  const attrDetails: AttributeDetail[][] = [];
  solutions.forEach(solution => {
    attrDetails.push(solution.map((vIdx, aIdx) => ({
      type: attributes[aIdx].type,
      attribute: attributes[aIdx].id,
      attributeIdx: aIdx,
      value: attributes[aIdx].values[vIdx],
      valueIdx: vIdx
    })));
  })

  console.log('attrDetails', attrDetails);
  const hints = [];

  // use this to not have so many hints on the same attributes?
  let usedCombos: AttributeIdxPair[] = [];

  for(let i = 0; i < NUM_HINTS; i++){
    const generated = generateHint(attrDetails, usedCombos);
    if(!generated) continue;
    // console.log('used', generated.used);
    generated.used.forEach(used => {
      if(usedCombos.find(uC => uC[0] === used[0] && uC[1] === used[1])){
        // duplicate, skip it
        return;
      }
      usedCombos.push(used);
    });
    // console.log('usedCombos', usedCombos);
    hints.push({
      hintGiverIdx: Math.floor(Math.random() * hintGivers.length),
      text: generated.text
    });
  }

  return hints;
  /*
  return [
    {
      hintGiverIdx: Math.floor(Math.random() * hintGivers.length),
      text: 'The first one in line lives on land'
    },
    {
      hintGiverIdx: Math.floor(Math.random() * hintGivers.length),
      text: 'Ugh it\'s one of those creepy... sad clowns'
    },
    {
      hintGiverIdx: Math.floor(Math.random() * hintGivers.length),
      text: 'The dentist showed up after the firefighter'
    }
  ];*/
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
export const getRoundData = (state: RootState) => state.board.roundData;
export const getSolution = (state: RootState) => state.board.solution;
export const getHints = (state: RootState) => state.board.hints;
export const getActiveHintIdx = (state: RootState) => state.board.activeHintIdx;
export const getRoundStatus = (state: RootState) => state.board.roundStatus;

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

export const selectAttributes = createSelector(
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

export const selectSolution = createSelector(
  [getSolution, selectAttributes],
  (solution, attributes) => solution?.map(solution => 
    solution.map((vIdx,sIdx) => 
      attributes[sIdx].values[vIdx]
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


/* unused stuff below here */


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
export const getAttributePairFromIndex = (attrPair: RawCell, attributes: AttributeDef[]) => {
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

// find solutions, return data.
export const selectAnswerMatrix = createSelector(
  [selectGridInfo, selectGreenCells],
  (gridInfo, greenCells) => {
    return greenCells.map(gc =>
      getAttributeMatrixForCellIndex(gc.idx, gridInfo.numAttributes, gridInfo.gridSize)
    );
  }
);

export default gridSlice.reducer;