import styled from 'styled-components';
import { HintGiver, SpritesheetOverride } from '../types';
import Spritesheet from 'react-responsive-spritesheet';
import { useMemo } from 'react';

export const ScButton = styled.div`
  padding: 2rem;
`;

interface StyledLilManProps {
  imageUrl: string
};

export const StyledLilManGif = styled.div<StyledLilManProps>`
  position:absolute;
  width:100%;
  height:100%;
  bottom:-2rem;
  background: url(${p => p.imageUrl}) no-repeat center;
  background-position:center;
  background-size:contain;
`;

export const StyledLilManSpritesheet = styled.div`
  position:absolute;
  width:100%;
  bottom:0;
`;

interface LilManProps {
  hintGiver: HintGiver,
  onClick?: Function,
  isTalking?: boolean,
}

export function LilMan({hintGiver, onClick, isTalking = false}: LilManProps) {
  const ssOverride = useMemo((): SpritesheetOverride | undefined => {
    if(!hintGiver) return undefined;
    return isTalking ? hintGiver.ssData?.talking : hintGiver.ssData?.idle;
  }, [ hintGiver, isTalking ])

  
  if(hintGiver.imageType === 'spritesheet'){
    if(!hintGiver || !hintGiver.spritesheetData || !ssOverride) return null;

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
        imageUrl={isTalking ? hintGiver.talkingImage : hintGiver.idleImage}
        onClick={(e) => onClick && onClick(e)}
      />
    );
  }
}
