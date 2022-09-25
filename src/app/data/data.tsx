import { AnswerData, RawCell, RenderedAnswer, RoundData } from '../../types';

/**
 * The attributes that defined the thingies this round
 */
export const SAMPLE_ROUNDDATA: RoundData[] = [
  {
    title: '3 attributes, 3 values',
    description: 'this puzzle has 4 attributes with 3 values each',
    valueSize: 3,
    attributes:[
      {
        id: 'animal',
        type: 'normal',
        values:[ 'monkey', 'frog', 'fish' ]
      },
      {
        id: 'queue',
        type: 'order',
        values: [ 'first', 'second', 'last' ]
      },
      {
        id: 'emotion',
        type: 'normal',
        values: [ 'happy', 'angry', 'sad' ]
      },
      {
        id: 'occupation',
        type: 'normal',
        values: [ 'firefighter', 'dentist', 'clown' ]
      }
    ]
  },{
    title: '3 attributes, 4 values',
    description: 'this puzzle has 4 attributes with 4 values each',
    valueSize: 4,
    attributes:[
      {
        id: 'animal',
        type: 'normal',
        values:[ 'monkey', 'frog', 'fish', 'crab' ]
      },
      {
        id: 'queue',
        type: 'order',
        values: [ 'first', 'second', 'third', 'last' ]
      },
      {
        id: 'emotion',
        type: 'normal',
        values: [ 'happy', 'angry', 'sad', 'bored' ]
      },
      {
        id: 'occupation',
        type: 'normal',
        values: [ 'firefighter', 'dentist', 'clown', 'lawyer' ]
      }
    ]
  }
]

export const HINT_GIVERS = [
  {
    id: 'flyman',
    name: 'fly man',
    thumbImage: 'assets/fly.gif',
    largeImage: 'assets/fly.gif'
  },
  {
    id: 'thumbNun',
    name: 'thumb nun',
    thumbImage: 'assets/thumb-nun.gif',
    largeImage: 'assets/thumb-nun.gif'
  }
]

type GridShapeDef = {
  [key: string]: RawCell[][]
}


/*
  Making this stupid data structure that I wanna get rid of
  its the row/column of each attribute
  4 ->  [
          [[0, 1], [ 0, 2 ], [ 0, 3 ]],
          [[3, 1], [ 3, 2 ]],
          [[2, 1]]
        ],
*/
export const generateGridShape = (size: number) => {
  let gridShape = [];
  for(let gsRow = 0; gsRow < size - 1; gsRow++){
    let gridRow = [];
    let rowIdx = gsRow === 0 ? 0 : size - gsRow;
    for(let gsCol = 0; gsCol < size - 1 - gsRow; gsCol++){
      gridRow.push([ rowIdx, gsCol + 1 ])
    }
    gridShape.push(gridRow);
  }
  return gridShape as RawCell[][];
}

const generatedGrids: GridShapeDef = {};
export const getGridShape = (size:number)  => {
  if(!generatedGrids[size]){
    generatedGrids[size] = generateGridShape(size);
  }
  return generatedGrids[size];
}

// TODO, generate this
export const sampleAnswerData: AnswerData = [
  [ 0, 0, 1, 0 ],
  [ 2, 1, 2, 1 ],
  [ 1, 2, 0, 2 ]
]

// TODO, generate this
export const RenderedAnswers: RenderedAnswer[] = [
  {
    attributes:[
      ['animal', 'monkey'],
      ['queue', 'first'],
      ['emotion', 'angry'],
      ['occupation', 'firefighter']
    ]
  },
  {
    attributes:[
      ['animal', 'frog'],
      ['queue', 'last'],
      ['emotion', 'happy'],
      ['occupation', 'clown']
    ]
  },
  {
    attributes:[
      ['animal', 'fish'],
      ['queue', 'second'],
      ['emotion', 'sad'],
      ['occupation', 'dentist']
    ]
  }
]