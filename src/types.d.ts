 
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
  status: CellStatus
  idx: number
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


export type GridShapes = '2' | '3' | '4' | '5';