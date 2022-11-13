import { getGridShape } from '../app/data/data';
import { AnswerSet, AttributeDef, AttributeDetail, AttributeMatrix, CalculatedHint, CellObj, ComparisonHash, InfluenceRatio, InfluenceType, OrderDescription, SortComparison } from '../types';
import { RandFromArray, RandIdx, RandIdxFromArray } from './index';

// what % of the time the same/different hint ratio is checked and attempted to be balanced;
const INFLUENCE_CALC = .75; // desired that 75% of the hints are for "this IS that" comparisons
const DESCRIPTOR_CHANCE = .4;
const PRUNE_RATE = .5; // what % of the time a used attribute is added to a block list

  /*
    when prefix, for alias "swinging rat"
    The { alias } is not the first in line
    The { alias } is angry
    The { alias } is a monkey

    when suffix, for descriptor "has legs"
    The first in line { descriptor }
    The angry one { descriptor }
    The monkey { descriptor }

    orderDescription "is earlier in line than"
    orderDescription "is later in line than"
    orderDescription "was born before"
    orderDescription "was born after"
    The {alias} {orderDescription} the one that {descriptor}
  */

export const getPrefix = (attr: AttributeDetail) => {
  const alias = RandFromArray(attr.aliases);

  switch(attr.type){
    case 'thing': {
      if(alias) return `The ${alias}`;
      return `The ${attr.value}`;
    }
    case 'name': {
      if(alias) return `${alias}`;
      return `${attr.value}`;
    }
    case 'modifier': {
      if(alias) return `The ${alias} one`;
      return `The ${attr.value} one`;
    }
    case 'order': {
      if(alias) return `The ${alias}`;
      return `The ${attr.value}`;
    }
    default: {
      if(alias) return `The ${alias}`;
      return `The ${attr.value}`;
    }
  }
}

export const getSuffix = (attr: AttributeDetail, sameGroup: boolean, sortComparison: string | null) => {
  const alias = RandFromArray(attr.aliases);
  const descriptor = (Math.random() < DESCRIPTOR_CHANCE) ? null : RandFromArray(attr.descriptors);


  switch(attr.type){
    case 'thing': {
      if(sortComparison) {
        // 'THE_PREFIX {was born before} one that {has legs}'
        if(descriptor) return`${sortComparison} one that ${descriptor}`;
        // 'THE_PREFIX {was born before} the {monkey}'
        return `${sortComparison} the ${attr.value}`;
      } else if(descriptor && sameGroup){
        // 'THE_PREFIX {has legs}'
        return `${descriptor}`;
      }
      // 'THE_PREFIX {is:is not} a {monkey}'
      return `${sameGroup ? 'is' : 'is not'} a ${attr.value}`;
    }
    case 'name': {
      if(sortComparison) {
        // 'THE_PREFIX {was born before} the {fat loser}'
        if(descriptor) return`${sortComparison} the ${descriptor}`;
        // 'THE_PREFIX {was born before} {Tom}'
        return `${sortComparison} ${attr.value}`;
      } else if(descriptor && sameGroup){
        // 'THE_PREFIX {is a fat loser}'
        return `${descriptor}`;
      }
      // 'THE_PREFIX {is:is not} {Tom}'
      return `${sameGroup ? 'is' : 'is not'} ${attr.value}`;
    }
    case 'modifier': {
      if(sortComparison) {
        // 'THE_PREFIX {was born before} the {hot-headed} one'
        if(alias) return`${sortComparison} the ${alias} one`;
        // 'THE_PREFIX {was born before} the {angry} one'
        return `${sortComparison} the ${attr.value} one`;
      } else if(descriptor) {
        // 'THE_PREFIX {is:is not} {having a bad time}'
        return `${sameGroup ? 'is' : 'is not'} ${descriptor}`;
      }
      // 'THE_PREFIX {is:is not} {angry}'
      return `${sameGroup ? 'is' : 'is not'} ${attr.value}`;
    }
    case 'order': {
      // order will never have a sortComparison 
      if(descriptor) {
        // 'THE_PREFIX {is:is not} {near the end of the line}'
        return `${sameGroup ? 'is' : 'is not'} ${descriptor}`;
      }
      // 'THE_PREFIX {is:is not} the {first}'
      return `${sameGroup ? 'is' : 'is not'} the ${attr.value}`;
    }
    default: {
      if(sortComparison) {
        // 'THE_PREFIX {was born before} a {some kind of thing}'
        if(descriptor) return `${sortComparison} a ${descriptor}`;
        // 'THE_PREFIX {was born before} a {something}'
        return `${sortComparison} a ${attr.value}`;
      } else if(descriptor) {
        // 'THE_PREFIX {is: is not} a {some kind of thing}'
        return `${sameGroup ? 'is' : 'is not'} a ${descriptor}`;
      }
      // 'THE_PREFIX {is: is not} a {something}'
      return `${sameGroup ? 'is' : 'is not'} a ${attr.value}`;
    }
  }
}

// TODO, reach back out to data, find queues from group, pick one, get back sort order between group A and B, get value
export const getSortComparison = (attrA: AttributeDetail, attrB: AttributeDetail) => {
  // find sorty attribute from group A and group B
  // return if A > B
  
  // pick rand sort in list (in case there are birthdays and a.. line or something)
  const rcIdx = RandIdxFromArray(attrA.sortComparisons);
  if(rcIdx > -1){
    return attrA.sortComparisons[rcIdx].value < attrB.sortComparisons[rcIdx].value ? 
      attrA.sortComparisons[rcIdx].orderDescriptions[0]
      : attrA.sortComparisons[rcIdx].orderDescriptions[1];
  }

  return null;
}

export const constructAutoHintText = (attrA: AttributeDetail, attrB: AttributeDetail) => {
  const sameGroup = attrA.solutionIdx === attrB.solutionIdx;

  let sortComparison = null;
  if(!sameGroup && attrA.attributeIdx !== attrB.attributeIdx && attrA.type !== 'order' && attrB.type !== 'order'){
    sortComparison = getSortComparison(attrA, attrB);
  }

  const prefix = getPrefix(attrA);
  const suffix = getSuffix(attrB, sameGroup, sortComparison);

  return `${prefix} ${suffix}.`;
}

// when checking the 2nd attribute in a hint pair, you dont want to choose THE SAME attr/value combo
// that the 1st attribute had. This is not filtered out yet, so go ahead and give it a skip
export const filterUsedHints = (attrGroup: AttributeDetail[], reservedAttr?: AttributeDetail) => {
  if(!reservedAttr) return attrGroup;

  return attrGroup.filter(attrDetail => {
    // exact same comparison
    if(reservedAttr.id === attrDetail.id) {
      return false; // dont want to end up with "the animal:monkey is not the animal:monkey"
    }
    // same attribute comparison
    else if(reservedAttr.attributeIdx === attrDetail.attributeIdx) {
      if(reservedAttr.type === 'order'){ // if they have same attrIdx, they have the same type.
        return false; // dont want to end up with "the first is before the last"
      }

      // might want to experiment with keeping this, and later in the comparison stack, 
      // when attrA and attrB have same attribute, use "order" to make a unique clue?
      // where you can say "the monkey was born before the cat"
      return false; // dont want to end up with "the animal:monkey is the animal:cat".. or do you?
    }
    return true;
  });
}

// this needs a refactor, but it more or less can try to get more hints with an "IS" comparison vs "IS NOT"
export const influenceGroupIdx = (groupAttrs: AttributeDetail[][], reservedAttr?: AttributeDetail, influenceType?: InfluenceType) => {
  if(!reservedAttr || !influenceType) return null;

  const sameGroup = groupAttrs.find(attrDetails => 
    !!attrDetails.find(attrDetail => {
      if(influenceType === 'same') return attrDetail.solutionIdx === reservedAttr.solutionIdx
      return attrDetail.solutionIdx !== reservedAttr.solutionIdx // only other influenceType at this point is 'different'
    })
  );

  if(sameGroup){
    const filteredAttributes = filterUsedHints(sameGroup, reservedAttr);
    if(filteredAttributes.length > 0){
      return filteredAttributes;
    }
  }

  return null;
}

export const chooseAttribute = (groupAttrDetails: AttributeDetail[][], reservedAttr?: AttributeDetail, influenceType?: InfluenceType) => {
  // get an influence attribute if needed
  let filteredAttributes = influenceGroupIdx(groupAttrDetails, reservedAttr, influenceType);
  // otherwise, go the normal route
  if(!filteredAttributes){
    const group_idx = RandIdx(0, groupAttrDetails.length);
  
    const group = groupAttrDetails[group_idx];
  
    // just in case this is groupB, you dont want to match on the same attr/value that groupA had
    filteredAttributes = filterUsedHints(group, reservedAttr);
    if (!filteredAttributes || filteredAttributes.length === 0){
      console.log('ran out of valid hint material for group');
      return null;
    }
  }
  
  return filteredAttributes[RandIdx(0, filteredAttributes.length)];
} 

export const generateSingleHint = (groupAttrDetails: AttributeDetail[][], influenceType?: InfluenceType): CalculatedHint | null => {
  const attrA = chooseAttribute(groupAttrDetails);
  if(!attrA) return null;

  const attrB = chooseAttribute(groupAttrDetails, attrA, influenceType);
  if(!attrB) return null;

  const hintText = constructAutoHintText(attrA, attrB);

  return {
    text: hintText,
    used: [ attrA, attrB ]
  }
}

export const getSortComparisons = (attributes: AttributeDef[]) => {
  const sortComparisons: SortComparison[] = [];
  attributes.forEach((attr, idx) => {
    if(attr.type === 'order'){
      sortComparisons.push({
        attributeIdx: idx,
        orderDescriptions: attr.orderDescriptions as OrderDescription,
        value: -1 // to be filled in later
      })
    }
  });
  /*
    [
      {
        attributeIdx: 1,
        value: -1,
        orderDescriptions: ['before this'], ['after this']
      }
    ]
  */
  return sortComparisons;
}

export const convertSolutionsToAttributeDetails = (solutions: AnswerSet, attributes: AttributeDef[]) => {
  const rawSortComparisons = getSortComparisons(attributes);

  return solutions.map((solution, sIdx) => {
    const sortComparisons = rawSortComparisons.map(sC => ({...sC, value: solution[sC.attributeIdx]}));

    return solution.map((vIdx, aIdx) => ({
      type: attributes[aIdx].type,
      attribute: attributes[aIdx].id,
      attributeIdx: aIdx,
      value: attributes[aIdx].values[vIdx].id,
      valueIdx: vIdx,
      solutionIdx: sIdx,
      aliases: attributes[aIdx].values[vIdx].aliases,
      descriptors: attributes[aIdx].values[vIdx].descriptors,
      sortComparisons: sortComparisons,
      id: `${sIdx}-${aIdx}-${vIdx}`
    }));
  });
}

export const filterFromWorkingAttrs = (solutionDetails: AttributeDetail[][], usedAttributes: AttributeDetail[]) => {
  return solutionDetails.map(solution => 
    solution.filter(attrDetail => {
      if(usedAttributes.find(usedAttr => usedAttr.id === attrDetail.id)){
        return false;
      }
      return true;
    })
  ).filter(solution => solution.length > 0);
}

export const getInfluenceType = (curRatio: InfluenceRatio, influenceCalc: number): InfluenceType => {
  // why compare if you know the answer
  if(influenceCalc === 1) return 'same';
  if(influenceCalc === 0) return 'different';

  const ratioTotal = curRatio[0] + curRatio[1];
  const calcRatio = ratioTotal === 0 ? .5 : curRatio[0] / (ratioTotal); // avoid divide by zero
  return influenceCalc >= calcRatio ? 'same' : 'different';
}

export const generateHints = (solutions: AnswerSet, attributes: AttributeDef[], maxHints: number = 0) => {
  const attrDetails = convertSolutionsToAttributeDetails(solutions, attributes);
  const textHints = [];

  let workingAttrs = [...attrDetails];

  // prevents attribute/value pairs (as in "the monkey") from getting used more than once across the hints
  let usedAttributes: AttributeDetail[] = [];
  let yesNoRatio: InfluenceRatio = [0,0];

  let i = 0;

  while(textHints.length < maxHints && workingAttrs.length > 0){
    if(i > 20){
      console.error('overflow in hint generation');
      break;
    }
    i++;
    
    const influenceType = getInfluenceType(yesNoRatio, INFLUENCE_CALC);
    const generated = generateSingleHint(workingAttrs, influenceType);
    // sometimes when an attribute group is all used up, the loop ends early.
    // This is actually kinda nice for helping randomize the yes/no count and hint giver a bit
    if(!generated) continue;

    if(generated.used[0].solutionIdx === generated.used[1].solutionIdx){
      yesNoRatio[0]++;
    }else{
      yesNoRatio[1]++;
    }

    if(Math.random() < PRUNE_RATE){
      usedAttributes = usedAttributes.concat(generated.used);
      workingAttrs = filterFromWorkingAttrs(workingAttrs, usedAttributes);
    }

    textHints.push(generated.text);
  }

  return textHints;
}

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
export const isCellSolution = (answerSet: AnswerSet, attrMatrix: AttributeMatrix) => {
  for(let a = 0; a < answerSet.length; a++){
    if(attrMatrix.filter(attrPair => answerSet[a][attrPair[0]] === attrPair[1]).length === 2) return true;
  }

  return false;
}

// make a unique combination of each attribute/value, with no overlaps.
// This is the solution to the current truth table.
export const calcSolution = (numAnswers: number, numAttributes:number): AnswerSet => {
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

export const generateCellMatrix = (solutionSet: AnswerSet, numValues:number, numAttributes:number) => {
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