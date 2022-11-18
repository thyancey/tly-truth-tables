import { AnswerData, HintGiver, RawCell, RenderedAnswer, LevelData } from '../../types';

/**
 * The attributes that defined the thingies this level
 */
export const LEVELDATA: LevelData[] = [
  // 2x3
  {
    title: 'Simple matrix',
    description: 'Three animals are looking for jobs.',
    hardcoded:{
      answers:[
        [ 0, 2 ], // monkey clown
        [ 1, 0 ], // fish firefighter
        [ 2, 1 ]  // frog dentist
      ],
      hints:[ 
        `The fish hopes they get to use that trampoline at least once.`,
        `Everyone knows that clowns disintegrate when they touch water.`
      ]
    },
    attributes: [
      [ 'monkey', 'fish', 'frog' ],
      [ 'firefighter', 'dentist', 'clown' ]
    ]
  },
  // 3x3
  {
    title: 'Food Chain',
    description: 'A hiker, a camper, and a birder wandered in the woods. So did some apex predators. Who got eaten by what?',
    hardcoded:{
      answers:[
        [ 0, 2, 2 ], // hiker last bear 
        [ 1, 0, 0 ], // camper first lion 
        [ 2, 1, 1 ]  // birder second tiger
      ],
      hints:[ 
        `The camper loved cats, well.. used to love cats.`,
        `The mountain lion ate before the tiger.`,
        `The hiker walked past a tiger with a huge belly.`,
        `The bird lover was eaten right after the camper.`
      ]
    },
    attributes: [
      [ 'hiker', 'camper', 'birder' ],
      [ 'first meal', 'second feast', 'last dessert' ],
      [ 'mountain lion', 'escaped tiger', 'bear' ]
    ]
  },
  // 3x4
  {
    title: 'Pirate Predicament',
    description: 'A crew of pirates are trying to find the treasure they buried. Help them remember what they buried and how to find it',
    hardcoded:{
      answers:[
        [ 0, 2, 1 ],
        [ 1, 3, 0 ],
        [ 2, 1, 3 ],
        [ 3, 0, 2 ]
      ],
      hints:[ 
        `Blue Beard will not be happy with his treasure`,
        `The message in a bottle reads "yarrrr read me treasure and ye skin will melt off. just speakin' from experience"`,
        `The valuable treasures were not written down`,
        `Gravy bones is always drunk, it finally did something good for him`,
        `Stank tooths treasure has to do with uh, teeth.`
      ]
    },
    attributes: [
      [ 'Blue Beard', 'Carl the Skinless', 'Stank Tooth', 'Gravy Bones' ],
      [ 'Gold Doubloons', 'Skull with Gold Teeth', 'Just an Old Boot', 'A Book of Curses' ],
      [ 'Message in a Bottle', 'Treasure Map', 'Grog-induced Dream', 'A Sea Shanty' ]
    ]
  },
  // 4x3
  {
    title: '4 attributes, 3 values',
    description: 'this puzzle has 4 attributes with 3 values. It doesnt work yet.',
    hardcoded:{
      answers:[
        [ 0, 0, 0 ],
        [ 1, 1, 1 ],
        [ 2, 2, 2 ],
        [ 3, 3, 3 ]
      ],
      hints:[ 
        `A hint needs to be created here`,
        `A hint needs to be created here`,
        `A hint needs to be created here`,
        `A hint needs to be created here`
      ]
    },
    attributes: [
      [ 'monkey', 'frog', 'fish' ],
      [ 'first', 'second', 'last' ],
      [ 'happy', 'angry', 'sad' ],
      [ 'firefighter', 'dentist', 'clown' ]
    ]
  },
  // 4x4
  {
    title: '4 attributes, 4 values',
    description: 'this puzzle has 4 attributes with 4 values. It doesnt work yet.',
    hardcoded:{
      answers:[
        [ 0, 0, 0, 0 ],
        [ 1, 1, 1, 1 ],
        [ 2, 2, 2, 2 ],
        [ 3, 3, 3, 3 ]
      ],
      hints:[ 
        `A hint needs to be created here`,
        `A hint needs to be created here`,
        `A hint needs to be created here`,
        `A hint needs to be created here`
      ]
    },
    attributes: [
      [ 'monkey', 'frog', 'fish', 'crab' ],
      [ 'first', 'second', 'third', 'last' ],
      [ 'happy', 'angry', 'sad', 'bored' ],
      [ 'firefighter', 'dentist', 'clown', 'lawyer' ]
    ]
  }
]

export const HINT_GIVERS: HintGiver[] = [
  {
    id: 'skull',
    name: 'Skull Guy',
    bodyType: 'body1',
    idleImage: 'assets/hinters/faces/skull-static.gif',
    talkingImage: 'assets/hinters/faces/skull.gif',
  }
  ,{
    id: 'cactoid',
    name: 'Cactoid',
    bodyType: 'body2',
    idleImage: 'assets/hinters/faces/cactus-static.gif',
    talkingImage: 'assets/hinters/faces/cactus.gif',
  }
  ,{
    id: 'face1',
    name: 'Face 1',
    bodyType: 'body3',
    idleImage: 'assets/hinters/faces/face1-static.gif',
    talkingImage: 'assets/hinters/faces/face1.gif',
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
export const getGridShape = (size:number) => {
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