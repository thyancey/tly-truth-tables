 
/** User set status of a cell, defaults to 0
  * 0: inactive
  * 1: yes
  * 2: no
  * 3: maybe
  * */
export type CellStatus = 0 | 1 | 2 | 3;

/** normal row/col
  * */
export type RawCell = [
  row: number,
  column: number
]

/** Info needed to store cell
  * */
export type CellObj = {
  idx: number,
  status: CellStatus,
  isSolution?: boolean
};

/**
 * The entire board
 */
export type CellMatrix = CellObj[];

export type ValueDef = {
  id: string,
  aliases: string[],
  descriptors: string[]
}
export type OrderDescription = [
  lessThan: string,
  moreThan: string 
];
export type AttributeType = 'thing' | 'order' | 'modifier';
export type AttributeDef = {
  id: string,
  display?: string,
  type: AttributeType,
  orderDescriptions?: OrderDescription,
  values: ValueDef[]
};

// "color" attribute can keep a ref like this to know if it is before another group set
export type SortComparison = {
  attributeIdx: number,
  value: number,
  orderDescriptions: OrderDescription
};

export type AttributeDetail = {
  id: string, // combo of solution, attribute, and value ids, for easy identification ('1-1-1')
  type: AttributeType,
  attribute: string,
  attributeIdx: number,
  value: string,
  valueIdx: number,
  solutionIdx: number,
  aliases: string[],
  descriptors: string[],
  sortComparisons: SortComparison[]
};

export type RoundData = {
  title: string,
  description?: string,
  valueSize: number,
  attributes: AttributeDef[]
};

export type AttributeIdxPair = [ attributeIdx: number, valueIdx: number ]; 
export type AttributePair = [ attribute: string, value: string ]; 
export type RenderedBoard = {
  rows: AttributePair[],
  cols: AttributePair[]
};

/**
 * Index of value the AnswerIdx belongs to
 */
export type AnswerIdx = number;
/**
 * Index of attribute, based on provided roundData
 */
export type AnswerAttributes = AnswerIdx[];
export type AnswerData = AnswerAttributes[];

export type RenderedAnswer = {
  attributes: AttributePair[];
}

export type AnswerSet = number[][];

export type AttributeMatrix = RawCell[];

export type HintGiver = {
  name: string,
  thumbImage: string,
  largeImage: string
};

export type Hint = {
  hintGiverIdx: number,
  text: string
};

export type RenderedHint = {
  hintGiver: HintGiver,
  text: string
};

export type CalculatedHint = {
  text: string,
  used: AttributeDetail[]
};

export type RoundStatus = 'idle' | 'incorrect' | 'correct';
export type InfluenceType = null | 'same' | 'different';
export type InfluenceRatio = [
  yesCount: number,
  noCount: number
];