import { HintGiver, RawCell, LevelData, LevelMenuGroup, TutorialData } from '../../types';

export const LEVELMENU: LevelMenuGroup[] = [
  {
    title: 'tutorial',
    levels: [ 0 ]
  },
  {
    title: 'easy',
    levels: [ 1 ]
  },
  {
    title: 'medium',
    levels: [ 2, 3 ]
  },
  {
    title: 'hard',
    levels: [4]
  }
]
/**
 * The attributes that defined the thingies this level
 */
export const LEVELDATA: LevelData[] = [
  {
    title: 'Basic Tutorial',
    description: 'Goldilocks did some breaking and entering, now it\'s time for soup.',
    layout: '2x3',
    attributes: [
      [ 'papa bear', 'mama bear', 'baby bear' ],
      [ 'too hot', 'too cold', 'just right' ]
    ],
    solution:[
      [ 0, 0 ],
      [ 1, 1 ],
      [ 2, 2 ]
    ],
    hints:[
      ['The parent\'s porridge wasn\'t good enough for golidlocks.', 'face1'],
      ['Mama bear eats her food straight from the fridge.', 'skull']
    ],
  },
  {
    title: 'Animals Doing People Jobs',
    description: 'Three animals are looking for jobs.',
    layout: '2x3',
    attributes: [
      [ 'monkey', 'fish', 'frog' ],
      [ 'firefighter', 'dentist', 'clown' ]
    ],
    solution:[
      [ 0, 2 ], // monkey clown
      [ 1, 0 ], // fish firefighter
      [ 2, 1 ]  // frog dentist
    ],
    hints:[
      // ['The **fish** hopes they get to use that *trampoline* at least once.', 'skull'],
      ['The fish hopes they get to use that trampoline at least once.', 'skull'],
      ['Everyone knows that clowns disintegrate when they touch water.', 'cactoid']
    ],
  },
  {
    title: 'Food Chain',
    description: 'A hiker, a camper, and a birder wandered in the woods. So did some apex predators. Who got eaten by what?',
    layout: '3x3',
    attributes: [
      [ 'hiker', 'camper', 'birder' ],
      [ 'first meal', 'second feast', 'last dessert' ],
      [ 'mountain lion', 'escaped tiger', 'bear' ]
    ],
    solution:[
      [ 0, 2, 2 ], // hiker last bear 
      [ 1, 0, 0 ], // camper first lion 
      [ 2, 1, 1 ]  // birder second tiger
    ],
    hints:[ 
      ['The camper loved cats, well.. used to love cats.'],
      ['The mountain lion ate before the tiger.'],
      ['The hiker walked past a tiger with a huge belly.'],
      ['The bird lover was eaten right after the camper.']
    ],
  },
  {
    title: 'Pirate Predicament',
    description: 'A crew of pirates are trying to find the treasure they buried, they don\'t even remember how they did it!',
    layout: '3x4',
    attributes: [
      [ 'Bluebeard', 'Carl the Skinless', 'Stank Tooth', 'Gravy Bones' ],
      [ 'Gold Doubloons', 'Skull with Gold Teeth', 'Just an Old Boot', 'A Book of Curses' ],
      [ 'Message in a Bottle', 'Treasure Map', 'Grog-induced Dream', 'A Sea Shanty' ]
    ],
    solution:[
      [ 0, 2, 1 ],
      [ 1, 3, 0 ],
      [ 2, 1, 3 ],
      [ 3, 0, 2 ]
    ],
    hints:[ 
      ['Bluebeard will not be happy with his treasure', 'face1_pirate'],
      [`The message in a bottle reads "yarrrr read me treasure and ye skin will melt off. just speakin' from experience"`, 'skull_pirate'],
      ['Carl can\'t read, fortunately for him.', 'face1_pirate'],
      ['The valuable treasures were not written down', 'skull_pirate'],
      ['Gravy bones is always drunk, it finally did something good for him', 'face1_pirate'],
      ['Stank tooths treasure has to do with uh, teeth.', 'face1_pirate']
    ],
  },
  {
    title: 'What the Elf?',
    description: 'Three elves made three toys for three differnt boys. The elves forgot which color wrapping paper they used, and forgot to put names on them. Help them figure it out!',
    layout: '4x3',
    attributes: [
      [ 'hermey', 'marcus', 'buddy' ],
      [ 'train', 'fire engine', 'teddy bear' ],
      [ 'red', 'silver', 'gold' ],
      [ 'ralphie', 'charlie', 'kevin' ]
    ],
    solution:[
      [ 2, 0, 1, 1 ],
      [ 1, 2, 2, 0 ],
      [ 0, 1, 0, 2 ]
    ],
    hints:[ 
      ['The train was wrapped in metallic wrapping paper'],
      ['Both Hermey and Buddy made toys with wheels'],
      ['Kevin wants to be a firefighter when he grows up'],
      ['Charlie asked for a train'],
      ['Marcus only uses gold wrapping paper'],
      ['Buddy made a gift for Charlie'],
    ],
  },
  {
    title: '4 attributes, 4 values',
    description: 'this puzzle has 4 attributes with 4 values. It doesnt work yet.',
    layout: '4x4',
    attributes: [
      [ 'monkey', 'frog', 'fish', 'crab' ],
      [ 'first', 'second', 'third', 'last' ],
      [ 'happy', 'angry', 'sad', 'bored' ],
      [ 'firefighter', 'dentist', 'clown', 'lawyer' ]
    ],
    solution:[
      [ 0, 0, 0, 0 ],
      [ 1, 1, 1, 1 ],
      [ 2, 2, 2, 2 ],
      [ 3, 3, 3, 3 ]
    ],
    hints:[ 
      ['A hint needs to be created here'],
      ['A hint needs to be created here'],
      ['A hint needs to be created here'],
      ['A hint needs to be created here']
    ],
  }
]

export const HINT_GIVERS: HintGiver[] = [
  {
    id: 'skull',
    name: 'Skull Guy',
    bodyType: 'body1',
    idleImage: 'assets/hinters/faces/skull-s.gif',
    talkingImage: 'assets/hinters/faces/skull-t.gif',
  },{
    id: 'skull_pirate',
    name: 'Skull Guy Pirate',
    bodyType: 'body1',
    idleImage: 'assets/hinters/faces/skull-pirate-s.gif',
    talkingImage: 'assets/hinters/faces/skull-pirate-t.gif',
  },{
    id: 'cactoid',
    name: 'Cactoid',
    bodyType: 'body2',
    idleImage: 'assets/hinters/faces/cactus-s.gif',
    talkingImage: 'assets/hinters/faces/cactus-t.gif',
  },{
    id: 'face1',
    name: 'Face 1',
    bodyType: 'body3',
    idleImage: 'assets/hinters/faces/face1-s.gif',
    talkingImage: 'assets/hinters/faces/face1-t.gif',
  },{
    id: 'face1_pirate',
    name: 'Face 1 Pirate',
    bodyType: 'body3',
    idleImage: 'assets/hinters/faces/face1-pirate-s.gif',
    talkingImage: 'assets/hinters/faces/face1-pirate-t.gif',
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

export const TUTORIAL:TutorialData[] = [
  {
    text: 'Your goal is to use deductive logic to solve each puzzle.',
    image: 'assets/hinters/faces/face1-t.gif'
  },
  {
    text: 'Click the clues at the bottom of the screen to reveal information about the puzzle.',
    image: 'assets/tutorials/clues-1.gif'
  },
  {
    text: 'Using the information in the clue, click the grid cells to cycle between FALSE (red) and TRUE (green).',
    image: 'assets/tutorials/buttons.gif'
  },
  {
    text: 'Based on the provided clue, we can infer that mama and papa bear did not have porridge that was "just right" for goldilocks.',
    image: 'assets/tutorials/clues-2.gif'
  },
  {
    text: 'Only one attribute per row can be TRUE (green), so when all of the other items are FALSE (red), you can fill in the remaining pieces.',
    image: 'assets/tutorials/deduction.gif'
  },
  {
    text: 'Some clues won\'t give you a direct answer, you\'ll have to understand the subtext in the hint.',
    image: 'assets/tutorials/clues-3.gif'
  },
  {
    text: 'Using deductive logic, you can solve the rest of the puzzle.',
    image: 'assets/tutorials/deduction-2.gif'
  },
  {
    text: 'After selecting all of the correct TRUE (green) tiles, click SUBMIT to see if you have the answer correct. FALSE (red) tiles are optional.',
    image: 'assets/tutorials/solve-01.gif'
  },
  {
    text: 'The puzzles will get bigger and more difficult. When using multiple rows and columns, use the grid to help figure it out!',
    image: 'assets/tutorials/grid-deduction-1.gif'
  },
  {
    text: 'Since "HIKER" is "FIRST MEAL" and not "MOUNTAIN LION", you can also mark false where "MOUNTAIN LION" intersects the "FIRST MEAL" column.',
    image: 'assets/tutorials/grid-deduction-1.gif'
  },
  {
    text: 'You can change levels and reset your progress using the "PROGRESS" button.',
    image: 'assets/tutorials/progress.gif'
  },
  {
    text: 'If the board doesn\'t fit in your screen, use the zoom and pan controls to move it around. Click the labels to reset. If you\'re using a mobile device, you can pan and zoom using two fingers.',
    image: 'assets/tutorials/zoom-pan.gif'
  }
];