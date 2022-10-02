import styled from 'styled-components';
import { MouseEventHandler } from 'hoist-non-react-statics/node_modules/@types/react';
import { HintGiver } from '../types';
import Spritesheet from 'react-responsive-spritesheet';
import { getColor } from '../themes';

export const ScButton = styled.div`
  padding: 2rem;
`;

interface StyledLilManProps {
  imageUrl: string
};

export const StyledLilMan = styled.div<StyledLilManProps>`
  position:absolute;
  width:100%;
  height:100%;
  top:0rem;
  background: url(${p => p.imageUrl}) no-repeat center;
  background-position:center;
  background-size:contain;
  filter: drop-shadow(0 0 7rem ${getColor('brown')});
`;

interface LilManProps {
  hintGiver: HintGiver,
  onClick?: Function
}

export function LilMan({hintGiver, onClick}: LilManProps) {
  if(hintGiver.imageType === 'spritesheet'){
    return (
      <Spritesheet
        image={hintGiver.largeImage}
        widthFrame={56}
        heightFrame={56}
        startAt={13}
        endAt={14}
        steps={20}
        fps={5}
        direction={'forward'}
        loop={true}
        backgroundPosition={'center bottom'}
        onClick={(e) => onClick && onClick(e)}
      />
    )
  } else{
    return (
      <StyledLilMan
        imageUrl={hintGiver.largeImage}
        onClick={(e) => onClick && onClick(e)}
      />
    );
  }
}
