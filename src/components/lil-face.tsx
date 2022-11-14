import styled from 'styled-components';
import { HintGiver } from '../types';

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
  left:50%;
  top:50%;
  transform: translate(-50%, -50%);
  bottom:-2rem;
  background: url(${p => p.imageUrl}) no-repeat center;
  background-position:center;
  background-size:contain;
`;

interface LilManProps {
  hintGiver: HintGiver,
  onClick?: Function,
  isTalking?: boolean,
  hideFace?: boolean
}

export function LilFace({hintGiver, onClick, isTalking = false, hideFace}: LilManProps) {
  // helps prevent showing images before transition is done
  if(hideFace) return null;
  return (
    <StyledLilManGif
      imageUrl={isTalking ? hintGiver.talkingImage : hintGiver.idleImage}
      onClick={(e) => onClick && onClick(e)}
    />
  );
}
