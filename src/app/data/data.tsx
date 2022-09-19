import { AnswerData, GridShapes, RawCell, RenderedAnswer, RenderedBoard, RoundData } from '../../types';

/**
 * The attributes that defined the thingies this round
 */
export const SAMPLE_ROUNDDATA: RoundData[] = [
  {
    title: 'round1',
    description: 'something about this round',
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
  }
]

// TODO, generate this
export const renderedBoard: RenderedBoard = {
  rows: [
    [ 'animal', 'monkey' ],
    [ 'animal', 'frog' ],
    [ 'animal', 'fish' ],
    [ 'emotion', 'happy' ],
    [ 'emotion', 'angry' ],
    [ 'emotion', 'sad' ]
  ],
  cols: [
    [ 'queue', 'first' ],
    [ 'queue', 'second' ],
    [ 'queue', 'last' ],
    [ 'occupation', 'firefighter' ],
    [ 'occupation', 'dentist' ],
    [ 'occupation', 'clown' ]
  ]
}

type GridShapeDef = {
  [key: string]: RawCell[][]
}
// I'm sure this can be done with math but I can't figure it out right now.
export const GRIDSHAPES: GridShapeDef = {
  '2': [
    [[0, 1]],
  ],
  '3': [
    [[0, 1], [ 0, 2 ]],
    [[2, 1]],
  ],
  '4': [
    [[0, 1], [ 0, 2 ], [ 0, 3 ]],
    [[3, 1], [ 3, 2 ]],
    [[2, 1]]
  ],
  '5': [
    [[0, 1], [ 0, 2 ], [ 0, 3 ], [ 0, 4 ]],
    [[4, 1], [ 4, 2 ], [ 4, 3 ]],
    [[3, 1], [ 3, 2 ]],
    [[2, 1]]
  ]
}

// TODO, generate this
// export const SAMPLE_CELLMATRIX: CellMatrix = [
//   [0,0,0],[0,1,0],[0,2,0],[0,3,0],[0,4,0],[0,5,0],
//   [1,0,0],[1,1,0],[1,2,0],[1,3,0],[1,4,0],[1,5,0],
//   [2,0,0],[2,1,0],[2,2,0],[2,3,0],[2,4,0],[2,5,0],
//   [3,0,0],[3,1,0],[3,2,0],[3,3,0],[3,4,0],[3,5,0],
//   [4,0,0],[4,1,0],[4,2,0],[4,3,0],[4,4,0],[4,5,0],
//   [5,0,0],[5,1,0],[5,2,0],[5,3,0],[5,4,0],[5,5,0]
// ];

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