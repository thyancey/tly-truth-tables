import { AnswerData, RawCell, RenderedAnswer, RenderedBoard, RoundData } from '../../types';

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