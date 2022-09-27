import { AnswerSet, AttributeDef, AttributeDetail, AttributeIdxPair, AttributeMatrix, CalculatedHint, HintGiver } from '../types';
import { RandIdx } from './index';

const NUM_HINTS = 6;

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

export const generateHints = (solutions: AnswerSet, attributes: AttributeDef[], hintGivers: HintGiver[], maxHints: number = 0) => {
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

  for(let i = 0; i < maxHints; i++){
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
}