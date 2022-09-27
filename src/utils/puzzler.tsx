import { AnswerSet, AttributeDef, AttributeDetail, CalculatedHint, HintGiver } from '../types';
import { RandIdx } from './index';

export const generateHintText = (attrA: AttributeDetail, attrB: AttributeDetail) => {
  const fromSameGroup = attrA.solutionIdx === attrB.solutionIdx;


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

export const chooseAttribute = (attrDetails: AttributeDetail[][], reservedAttr?: AttributeDetail) => {
  const group_idx = RandIdx(0, attrDetails.length);
  const group = attrDetails[group_idx];

  // just in case this is groupB, you dont want to match on the same attr/value that groupA had
  const filteredAttributes = filterUsedHints(group, reservedAttr);
  if (filteredAttributes.length === 0){
    console.log('ran out of valid hint material for group');
    return null;
  }
  
  return filteredAttributes[RandIdx(0, filteredAttributes.length)];
} 

export const generateSingleHint = (attrDetails: AttributeDetail[][]): CalculatedHint | null => {
  const attrA = chooseAttribute(attrDetails);
  if(!attrA) return null;

  const attrB = chooseAttribute(attrDetails, attrA);
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

export const generateHints = (solutions: AnswerSet, attributes: AttributeDef[], hintGivers: HintGiver[], maxHints: number = 0) => {
  // console.log('solutions', solutions);
  // console.log('attributes', attributes.map(a => a));

  const attrDetails = convertSolutionsToAttributeDetails(solutions, attributes);
  // console.log('attrDetails', attrDetails);
  const hints = [];

  let workingAttrs = [...attrDetails];

  // prevents attribute/value pairs (as in "the monkey") from getting used more than once across the hints
  let usedAttributes: AttributeDetail[] = [];

  for(let i = 0; i < maxHints && workingAttrs.length > 0; i++){
    const generated = generateSingleHint(workingAttrs);
    if(!generated) continue;

    usedAttributes = usedAttributes.concat(generated.used);
    workingAttrs = filterFromWorkingAttrs(workingAttrs, usedAttributes);

    hints.push({
      hintGiverIdx: Math.floor(Math.random() * hintGivers.length),
      text: generated.text
    });
  }

  return hints;
}