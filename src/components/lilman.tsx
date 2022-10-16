import styled from 'styled-components';
import { HintGiver, SpritesheetData, SpritesheetOverride } from '../types';
import Spritesheet from 'react-responsive-spritesheet';
import { getColor } from '../themes';

export const ScButton = styled.div`
  padding: 2rem;
`;

interface StyledLilManProps {
  imageUrl: string
};

export const StyledLilManGif = styled.div<StyledLilManProps>`
  position:absolute;
  width:100%;
  height:calc(100% + 2rem);
  bottom:-2rem;
  background: url(${p => p.imageUrl}) no-repeat center;
  background-position:center;
  background-size:contain;
  filter: drop-shadow(0 0 7rem ${getColor('brown')});
`;

export const StyledLilManSpritesheet = styled.div`
  position:absolute;
  width:100%;
  height:100%;
`;

interface LilManProps {
  hintGiver: HintGiver,
  onClick?: Function,
  ssOverride?: SpritesheetOverride,
  isTalking?: boolean,
}

export function LilMan({hintGiver, onClick, isTalking = false, ssOverride = {} as SpritesheetData}: LilManProps) {
  if(hintGiver.imageType === 'spritesheet'){
    if(!hintGiver || !hintGiver.spritesheetData) return null;

    return (
      <StyledLilManSpritesheet>
        <Spritesheet
          image={hintGiver.spritesheetData.image}
          widthFrame={hintGiver.spritesheetData.widthFrame}
          heightFrame={hintGiver.spritesheetData.heightFrame}
          startAt={ssOverride.startAt !== undefined ? ssOverride.startAt : hintGiver.spritesheetData.startAt}
          endAt={ssOverride.endAt !== undefined ? ssOverride.endAt : hintGiver.spritesheetData.endAt}
          fps={ssOverride.fps !== undefined ? ssOverride.fps : hintGiver.spritesheetData.fps}
          steps={hintGiver.spritesheetData.steps}
          direction={'forward'}
          loop={true}
          backgroundPosition={'center bottom'}
          onClick={(e) => onClick && onClick(e)}
        />
      </StyledLilManSpritesheet>
    )
  } else{
    return (
      <StyledLilManGif
        imageUrl={isTalking ? hintGiver.largeImage : hintGiver.thumbImage}
        onClick={(e) => onClick && onClick(e)}
      />
    );
  }
}
