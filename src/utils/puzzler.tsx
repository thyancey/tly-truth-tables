import { AnswerSet, AttributeDef, AttributeDetail, CalculatedHint, HintGiver, InfluenceRatio, InfluenceType } from '../types';
import { RandIdx } from './index';

// what % of the time the same/different hint ratio is checked and attempted to be balanced;
const INFLUENCE_CALC = .75; // desired that 75% of the hints are for "this IS that" comparisons

export const generateHintText = (attrA: AttributeDetail, attrB: AttributeDetail) => {
  const fromSameGroup = attrA.solutionIdx === attrB.solutionIdx;

  let prefix = '';
  let suffix = '';

  switch(attrA.type){
    case 'modifier': prefix = `The ${attrA.value} one`;
      break;
    case 'order': prefix = `The ${attrA.value} ${attrA.attributeDisplay}`;
      break;
    default: prefix = `The ${attrA.value}`;
  }

  switch(attrB.type){
    case 'thing': suffix = `${fromSameGroup ? 'is' : 'is not'} a ${attrB.value}`;
      break;
    case 'modifier': suffix = `${fromSameGroup ? 'is' : 'is not'} ${attrB.value}`;
      break;
    case 'order': suffix = `${fromSameGroup ? 'is' : 'is not'} the ${attrB.value} ${attrB.attributeDisplay}`;
      break;
    default: suffix = `${fromSameGroup ? 'is' : 'is not'} a ${attrB.value}`;
  }

  return `${prefix} ${suffix}.`;
}

// when checking the 2nd attribute in a hint pair, you dont want to choose THE SAME attr/value combo
// that the 1st attribute had. This is not filtered out yet, so go ahead and give it a skip
export const filterUsedHints = (attrGroup: AttributeDetail[], reservedAttr?: AttributeDetail) => {
  if(!reservedAttr) return attrGroup;

  return attrGroup.filter(attrDetail => {
    if(reservedAttr.id === attrDetail.id) {
      return false; // dont want to end up with "the monkey is the monkey"
    } else if(reservedAttr.attributeIdx === attrDetail.attributeIdx && 
      reservedAttr.type === 'order' && attrDetail.type === 'order'){
      return false; // dont want to end up with "the first is before the last"
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

export const chooseAttribute = (attrDetails: AttributeDetail[][], reservedAttr?: AttributeDetail, influenceType?: InfluenceType) => {
  // get an influence attribute if needed
  let filteredAttributes = influenceGroupIdx(attrDetails, reservedAttr, influenceType);
  // otherwise, go the normal route
  if(!filteredAttributes){
    const group_idx = RandIdx(0, attrDetails.length);
  
    const group = attrDetails[group_idx];
  
    // just in case this is groupB, you dont want to match on the same attr/value that groupA had
    filteredAttributes = filterUsedHints(group, reservedAttr);
    if (!filteredAttributes || filteredAttributes.length === 0){
      console.log('ran out of valid hint material for group');
      return null;
    }
  }
  
  return filteredAttributes[RandIdx(0, filteredAttributes.length)];
} 

export const generateSingleHint = (attrDetails: AttributeDetail[][], influenceType?: InfluenceType): CalculatedHint | null => {
  const attrA = chooseAttribute(attrDetails);
  if(!attrA) return null;

  const attrB = chooseAttribute(attrDetails, attrA, influenceType);
  if(!attrB) return null;

  const hintText = generateHintText(attrA, attrB);

  return {
    text: hintText,
    used: [ attrA, attrB ]
  }
}

export const convertSolutionsToAttributeDetails = (solutions: AnswerSet, attributes: AttributeDef[]) => {
  return solutions.map((solution, sIdx) => 
    solution.map((vIdx, aIdx) => ({
      type: attributes[aIdx].type,
      attribute: attributes[aIdx].id,
      attributeDisplay: attributes[aIdx].display || attributes[aIdx].id,
      attributeIdx: aIdx,
      value: attributes[aIdx].values[vIdx],
      valueIdx: vIdx,
      solutionIdx: sIdx,
      id: `${sIdx}-${aIdx}-${vIdx}`
    }))
  );
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

export const generateHints = (solutions: AnswerSet, attributes: AttributeDef[], hintGivers: HintGiver[], maxHints: number = 0) => {
  const attrDetails = convertSolutionsToAttributeDetails(solutions, attributes);
  const hints = [];

  let workingAttrs = [...attrDetails];

  // prevents attribute/value pairs (as in "the monkey") from getting used more than once across the hints
  let usedAttributes: AttributeDetail[] = [];
  let yesNoRatio: InfluenceRatio = [0,0];

  let i = 0;
  let hgIdx = Math.floor(Math.random() * hintGivers.length);

  while(hints.length < maxHints && workingAttrs.length > 0){
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

    usedAttributes = usedAttributes.concat(generated.used);
    workingAttrs = filterFromWorkingAttrs(workingAttrs, usedAttributes);

    hints.push({
      hintGiverIdx: (hgIdx + i) % hintGivers.length,
      text: generated.text
    });

  }

  console.log('yesNoRatio is', yesNoRatio);

  return hints;
}