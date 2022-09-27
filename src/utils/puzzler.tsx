import { AnswerSet, AttributeDef, AttributeDetail, AttributeIdxPair, AttributeMatrix, CalculatedHint, HintGiver } from '../types';
import { RandIdx } from './index';

export const generateHintText = (attrA: AttributeDetail, attrB: AttributeDetail) => {
  const fromSameGroup = attrA.solutionIdx === attrB.solutionIdx;
  // if both are order.. do soemthing special
  if(attrA.attributeIdx === attrB.attributeIdx && attrA.type === 'order'){
    // this is a bad comparison
    return '(TODO: ignore order vs order comparisons)';
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

export const filterUsedHints = (attrGroup: AttributeDetail[], usedCombos: AttributeDetail[]) => {
  return attrGroup.filter(attrDetail => {
    if(usedCombos.find(usedCombo => 
      usedCombo.attributeIdx === attrDetail.attributeIdx &&
      usedCombo.valueIdx === attrDetail.valueIdx &&
      usedCombo.solutionIdx === attrDetail.solutionIdx
    )){
      return false;
    }
    return true;
  });
}

export const chooseAttribute = (attrDetails: AttributeDetail[][], usedCombos: AttributeDetail[]) => {
  const group_idx = RandIdx(0, attrDetails.length);
  const group = attrDetails[group_idx];
  const filteredAttributes = filterUsedHints(group, usedCombos);
  if (filteredAttributes.length === 0){
    console.log('ran out of valid hint material for group');
    return null;
  }
  
  return filteredAttributes[RandIdx(0, filteredAttributes.length)];
} 

export const generateSingleHint = (attrDetails: AttributeDetail[][], usedCombos: AttributeDetail[]): CalculatedHint | null => {
  console.log('usedCombos', usedCombos)
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
    let newUsed = [...usedCombos];

    const attrA = chooseAttribute(attrDetails, newUsed);
    if(!attrA) return null;
    newUsed.push(attrA);

    const attrB = chooseAttribute(attrDetails, newUsed);
    if(!attrB) return null;
    newUsed.push(attrB);

    const hintText = generateHintText(attrA, attrB);

    return {
      text: hintText,
      used: newUsed
    }
}

export const convertSolutionsToAttributeDetails = (solutions: AnswerSet, attributes: AttributeDef[]) => {
  return solutions.map((solution, sIdx) => 
    solution.map((vIdx, aIdx) => ({
      type: attributes[aIdx].type,
      attribute: attributes[aIdx].id,
      attributeIdx: aIdx,
      value: attributes[aIdx].values[vIdx],
      valueIdx: vIdx,
      solutionIdx: sIdx 
    }))
  );
}

export const generateHints = (solutions: AnswerSet, attributes: AttributeDef[], hintGivers: HintGiver[], maxHints: number = 0) => {
  console.log('solutions', solutions);
  console.log('attributes', attributes.map(a => a));

  const attrDetails = convertSolutionsToAttributeDetails(solutions, attributes);
  console.log('attrDetails', attrDetails);
  const hints = [];

  // use this to not have so many hints on the same attributes?
  let usedCombos: AttributeDetail[] = [];

  for(let i = 0; i < maxHints; i++){
    const generated = generateSingleHint(attrDetails, usedCombos);
    if(!generated) continue;
    usedCombos = generated.used;
    console.log('after generation, usedCombos is ', usedCombos.length);

    hints.push({
      hintGiverIdx: Math.floor(Math.random() * hintGivers.length),
      text: generated.text
    });
  }

  return hints;
}