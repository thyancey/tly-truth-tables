 
/** User set status of a cell, defaults to 0
  * 0: inactive
  * 1: yes
  * 2: no
  * */
export type CellStatus = 0 | 1 | 2;

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
}
/**
 * The entire board
 */
export type CellMatrix = CellObj[];

export type AttributeType = 'normal' | 'order';
export type AttributeDef = {
  id: string,
  type: AttributeType,
  values: string[]
}

export type RoundData = {
  title: string,
  description?: string,
  valueSize: number,
  attributes: AttributeDef[]
}

export type AttributePair = [ attribute: string, value: string ]; 
export type RenderedBoard = {
  rows: AttributePair[],
  cols: AttributePair[]
}

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