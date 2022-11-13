import { AnswerData, HintGiver, RawCell, RenderedAnswer, RoundData } from '../../types';

/**
 * The attributes that defined the thingies this round
 */
export const SAMPLE_ROUNDDATA: RoundData[] = [
  // 2x3
  {
    title: '2 attributes, 3 values',
    description: 'this puzzle has 2 attributes with 3 values each',
    hardcoded:{
      answers:[
        [ 0, 1 ], // monkey dentist
        [ 1, 0 ], // frog firefighter
        [ 2, 2 ]  // fish clown
      ],
      hints:[ 
        `I think there was a movie about this type of fish`,
        `The dentist is very good with their fingers`
      ]
    },
    attributes: [
      [ 'monkey', 'frog', 'fish' ],
      [ 'firefighter', 'dentist', 'clown' ]
    ],
    attributesMeta:[
      {
        id: 'animal',
        type: 'thing',
        values: [
          {
            id: 'monkey',
            aliases: [ 'swinging rat' ],
            descriptors: [ 'has legs', 'rhymes with "funky"' ]
          },
          {
            id: 'frog',
            aliases: [ 'croaky boi' ],
            descriptors: [ 'loves the water', 'eats flies' ]
          },
          {
            id: 'fish',
            aliases: [ 'one with gills' ],
            descriptors: [ 'loves the water', 'eats flies' ]
          }
        ]
      },
      {
        id: 'occupation',
        type: 'thing',
        values: [
          {
            id: 'firefighter',
            aliases: [],
            descriptors: [ 'uses a trampoline' ]
          },
          {
            id: 'dentist',
            aliases: [],
            descriptors: []
          },
          {
            id: 'clown',
            aliases: [],
            descriptors: [ 'uses a trampoline' ]
          }
        ]
      }
    ]
  },
  // 3x3
  {
    title: '3 attributes, 3 values',
    description: 'this puzzle has 3 attributes with 3 values each',
    hardcoded:{
      answers:[
        [ 0, 1, 0 ], // monkey second firefighter
        [ 1, 0, 2 ], // frog first clown
        [ 2, 2, 1 ]  // fish last dentist
      ],
      hints:[ 
        `The second in line is the bravest fish I've ever met`,
        `The frog showed up before the dentist`
      ]
    },
    attributes: [
      [ 'monkey', 'frog', 'fish' ],
      [ 'first', 'second', 'last' ],
      [ 'firefighter', 'dentist', 'clown' ]
    ],
    attributesMeta:[
      {
        id: 'animal',
        type: 'thing',
        values: [
          {
            id: 'monkey',
            aliases: [ 'swinging rat' ], // ALIASES HAVE TO BE DISTINCT
            descriptors: [ 'has legs', 'rhymes with "funky"' ] // DESCRIPTORS CAN BE SHARED FOR AN ATTRIBUTE
          },
          {
            id: 'frog',
            aliases: [ 'croaky boi' ],
            descriptors: [ 'loves the water', 'eats flies' ]
          },
          {
            id: 'fish',
            aliases: [ 'one with gills' ],
            descriptors: [ 'loves the water', 'eats flies' ]
          }
        ]
      },
      {
        id: 'queue',
        type: 'order',
        orderDescriptions: [ 'is earlier in line than', 'is later in line than' ],
        values: [
          {
            id: 'first',
            aliases: [ 'first to arrive' ],
            descriptors: [ 'one of the first two to arrive' ]
          },
          {
            id: 'second',
            aliases: [ 'second in line' ],
            descriptors: [ 'one of the first two to arrive', 'near the end of the line' ]
          },
          {
            id: 'last',
            aliases: [ 'last to show up' ],
            descriptors: [ 'near the end of the line' ]
          }
        ]
      },
      {
        id: 'occupation',
        type: 'thing',
        values: [
          {
            id: 'firefighter',
            aliases: [],
            descriptors: [ 'uses a trampoline' ]
          },
          {
            id: 'dentist',
            aliases: [],
            descriptors: []
          },
          {
            id: 'clown',
            aliases: [],
            descriptors: [ 'uses a trampoline' ]
          }
        ]
      }
    ]
  },
  // 3x4
  {
    title: '3 attributes, 4 values',
    description: 'this puzzle has 3 attributes with 4 values each',
    attributes: [
      [ 'monkey', 'frog', 'fish', 'crab' ],
      [ 'first', 'second', 'third', 'last' ],
      [ 'firefighter', 'dentist', 'clown', 'lawyer' ]
    ],
    attributesMeta:[
      {
        id: 'animal',
        type: 'thing',
        values: [
          {
            id: 'monkey',
            aliases: [ 'swinging rat' ],
            descriptors: [ 'has legs', 'rhymes with "funky"' ]
          },
          {
            id: 'frog',
            aliases: [ 'croaky boi' ],
            descriptors: [ 'loves the water', 'eats flies' ]
          },
          {
            id: 'fish',
            aliases: [ 'one with gills' ],
            descriptors: [ 'loves the water', 'eats flies' ]
          },
          {
            id: 'crab',
            aliases: [ 'pinchy boi' ],
            descriptors: [ 'loves the water' ]
          }
        ]
      },
      {
        id: 'queue',
        type: 'order',
        orderDescriptions: [ 'is earlier in line than', 'is later in line than' ],
        values: [
          {
            id: 'first',
            // the $
            aliases: [ 'first to arrive' ],
            // [is, is not] the $
            descriptors: [ 'first to arrive' ]
          },
          {
            id: 'second',
            aliases: [],
            descriptors: [ 'in the middle of the line' ]
          },
          {
            id: 'third',
            aliases: [],
            descriptors: [ 'in the middle of the line' ]
          },
          {
            id: 'last',
            aliases: [ 'last to show up' ],
            descriptors: [ 'last to show up' ]
          }
        ]
      },
      {
        id: 'occupation',
        type: 'thing',
        values: [
          {
            id: 'firefighter',
            // the $
            aliases: [],
            // $ (only IS comparison) 
            descriptors: [ 'uses a trampoline' ]
          },
          {
            id: 'dentist',
            aliases: [],
            descriptors: [ 'makes a lot of money' ]
          },
          {
            id: 'clown',
            aliases: [],
            descriptors: [ 'uses a trampoline' ]
          },
          {
            id: 'lawyer',
            aliases: [],
            descriptors: [ 'makes a lot of money' ]
          }
        ]
      }
    ]
  },
  // 4x3
  {
    title: '4 attributes, 3 values',
    description: 'this puzzle has 4 attributes with 3 values each',
    attributes: [
      [ 'monkey', 'frog', 'fish' ],
      [ 'first', 'second', 'last' ],
      [ 'happy', 'angry', 'sad' ],
      [ 'firefighter', 'dentist', 'clown' ]
    ],
    attributesMeta:[
      {
        id: 'animal',
        type: 'thing',
        values: [
          {
            id: 'monkey',
            aliases: [ 'swinging rat' ], // ALIASES HAVE TO BE DISTINCT
            descriptors: [ 'has legs', 'rhymes with "funky"' ] // DESCRIPTORS CAN BE SHARED FOR AN ATTRIBUTE
          },
          {
            id: 'frog',
            aliases: [ 'croaky boi' ],
            descriptors: [ 'loves the water', 'eats flies' ]
          },
          {
            id: 'fish',
            aliases: [ 'one with gills' ],
            descriptors: [ 'loves the water', 'eats flies' ]
          }
        ]
      },
      {
        id: 'queue',
        type: 'order',
        orderDescriptions: [ 'is earlier in line than', 'is later in line than' ],
        values: [
          {
            id: 'first',
            aliases: [ 'first to arrive' ],
            descriptors: [ 'first to arrive' ]
          },
          {
            id: 'second',
            aliases: [ 'second in line' ],
            descriptors: [ 'second in line' ]
          },
          {
            id: 'last',
            aliases: [ 'last to show up' ],
            descriptors: [ 'last to show up' ]
          }
        ]
      },
      {
        id: 'emotion',
        type: 'modifier',
        values: [
          {
            id: 'happy',
            // the $ one
            aliases: [],
            // [is, is not] $
            descriptors: []
          },
          {
            id: 'angry',
            aliases: [ 'FUMING' ],
            descriptors: [ 'really angry', 'having a bad time', 'screaming at everyone' ]
          },
          {
            id: 'sad',
            aliases: [ 'mopey' ],
            descriptors: [ 'having a bad time' ]
          }
        ]
      },
      {
        id: 'occupation',
        type: 'thing',
        values: [
          {
            id: 'firefighter',
            // the $
            aliases: [],
            // $ (only IS comparison) 
            descriptors: [ 'uses a trampoline' ]
          },
          {
            id: 'dentist',
            aliases: [],
            descriptors: []
          },
          {
            id: 'clown',
            aliases: [],
            descriptors: [ 'uses a trampoline' ]
          }
        ]
      }
    ]
  },
  // 4x4
  {
    title: '4 attributes, 4 values',
    description: 'this puzzle has 4 attributes with 4 values each',
    attributes: [
      [ 'monkey', 'frog', 'fish', 'crab' ],
      [ 'first', 'second', 'third', 'last' ],
      [ 'happy', 'angry', 'sad', 'bored' ],
      [ 'firefighter', 'dentist', 'clown', 'lawyer' ]
    ],
    attributesMeta:[
      {
        id: 'animal',
        type: 'thing',
        values: [
          {
            id: 'monkey',
            aliases: [ 'swinging rat' ],
            descriptors: [ 'has legs', 'rhymes with "funky"' ]
          },
          {
            id: 'frog',
            aliases: [ 'croaky boi' ],
            descriptors: [ 'loves the water', 'eats flies' ]
          },
          {
            id: 'fish',
            aliases: [ 'one with gills' ],
            descriptors: [ 'loves the water', 'eats flies' ]
          },
          {
            id: 'crab',
            aliases: [ 'pinchy boi' ],
            descriptors: [ 'loves the water' ]
          }
        ]
      },
      {
        id: 'queue',
        type: 'order',
        orderDescriptions: [ 'is earlier in line than', 'is later in line than' ],
        values: [
          {
            id: 'first',
            // the $
            aliases: [ 'first to arrive' ],
            // [is, is not] the $
            descriptors: [ 'first to arrive' ]
          },
          {
            id: 'second',
            aliases: [],
            descriptors: [ 'in the middle of the line' ]
          },
          {
            id: 'third',
            aliases: [],
            descriptors: [ 'in the middle of the line' ]
          },
          {
            id: 'last',
            aliases: [ 'last to show up' ],
            descriptors: [ 'last to show up' ]
          }
        ]
      },
      {
        id: 'emotion',
        type: 'modifier',
        values: [
          {
            id: 'happy',
            // the $ one
            aliases: [],
            // [is, is not] $
            descriptors: []
          },
          {
            id: 'angry',
            aliases: [ 'FUMING' ],
            descriptors: [ 'having a bad time', 'screaming at everyone' ]
          },
          {
            id: 'sad',
            aliases: [ 'mopey', 'pretty blue' ],
            descriptors: [ 'having a bad time' ]
          },
          {
            id: 'bored',
            aliases: [],
            descriptors: [ 'having a bad time', 'twiddling their thumbs' ]
          }
        ]
      },
      {
        id: 'occupation',
        type: 'thing',
        values: [
          {
            id: 'firefighter',
            // the $
            aliases: [],
            // $ (only IS comparison) 
            descriptors: [ 'uses a trampoline' ]
          },
          {
            id: 'dentist',
            aliases: [],
            descriptors: [ 'makes a lot of money' ]
          },
          {
            id: 'clown',
            aliases: [],
            descriptors: [ 'uses a trampoline' ]
          },
          {
            id: 'lawyer',
            aliases: [],
            descriptors: [ 'makes a lot of money' ]
          }
        ]
      }
    ]
  }
]

export const HINT_GIVERS: HintGiver[] = [
  {
    id: 'fiveflys',
    name: 'Fly Cook',
    idleImage: 'assets/hinters/fiveflys-static.gif',
    talkingImage: 'assets/hinters/fiveflys.gif',
  },
  {
    id: 'eyetower',
    name: 'Eye Tower',
    idleImage: 'assets/hinters/eyetower-static.gif',
    talkingImage: 'assets/hinters/eyetower.gif',
  },
  {
    id: 'businessbobcat',
    name: 'Business Bobcat',
    imageType: 'spritesheet',
    idleImage: 'assets/hinters/businesscat-static.gif',
    talkingImage: 'assets/hinters/businesscat.gif',
    ssData:{
      idle:{
        startAt: 2,
        endAt: 4,
        fps: 1,
      },
      talking:{
        startAt: 1,
        endAt: 2,
        fps: 4,
      }
    },
    spritesheetData: {
      image: 'assets/hinters/sprites/bobcat.png',
      widthFrame: 400,
      heightFrame: 600,
      startAt: 1,
      endAt: 4,
      steps: 4,
      fps: 5
    }
  },
  {
    id: 'fridgey',
    name: 'Fridgey',
    idleImage: 'assets/hinters/fridgey-static.gif',
    talkingImage: 'assets/hinters/fridgey.gif',
  },
  {
    id: 'mothman',
    name: 'Mothman',
    idleImage: 'assets/hinters/mothman-static.gif',
    talkingImage: 'assets/hinters/mothman.gif',
  },
  {
    id: 'raincat',
    name: 'Rain Cat',
    idleImage: 'assets/hinters/raincat-static.gif',
    talkingImage: 'assets/hinters/raincat.gif',
    bottomBoost: 10,
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