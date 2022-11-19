import { getGridShape } from '../app/data/data';
import { SolutionSet, AttributeMatrix, CellObj, ComparisonHash, SimpleAttributeDef } from '../types';

// make a hash of all unique attribute:attribute combinations
export const createComparisonHash = (numAttributes: number, numValues: number): ComparisonHash => {
  const hash: ComparisonHash = {};
  /**
   * makes a flat hash of every unique attribute:value relationship to be used when script is iteratively
   * "solving" to create hints. This can get quite large
   * {
   *  0:0|1:0,
   *  0:0|1:1,
   *  0:0|1:2,
   *  0:0|2:0,
   *  ...
   * }
   */
  for(let i = 0; i < numAttributes-1; i++){
    for(let j = 0; j < numValues; j++){
      for(let k = i + 1; k < numAttributes; k++){
        for(let l = 0; l < numValues; l++){
          hash[`${i}:${j}|${k}:${l}`] = -1;
        }
      }
    }
  }

  return hash;
}

// answer set is the raw attributes (in order) and their values
/// [1, 1, 1] would mean a valueIdx of 1 for attributes 0, 1, and 2

// attrMatrix is a 2d array of attrIdx and numberIdx, so [[0,0],[2,0]] compares the 1st val of attr[0] with the 1st value of attr[2]
export const isCellSolution = (answerSet: SolutionSet, attrMatrix: AttributeMatrix) => {
  for(let a = 0; a < answerSet.length; a++){
    if(attrMatrix.filter(attrPair => answerSet[a][attrPair[0]] === attrPair[1]).length === 2) return true;
  }

  return false;
}

// make a unique combination of each attribute/value, with no overlaps.
// This is the solution to the current truth table.
export const calcSolution = (numAnswers: number, numAttributes:number): SolutionSet => {
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

export const generateCellMatrix = (solutionSet: SolutionSet, attributes:SimpleAttributeDef[]) => {
  const numAttributes = attributes.length || 0;
  const numValues = attributes[0].length;

  if(numAttributes < 2 || numAttributes > 5){
    console.error('invalid data, must use between 2 and 5 attributes');
  }
  
  const boxSize = Math.pow(numValues, 2);
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

  return newMatrix;
}