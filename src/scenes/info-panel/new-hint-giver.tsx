import styled from 'styled-components';

import { useAppSelector } from '../../app/hooks';
import { LilFace } from '../../components/lil-face';
import { selectActiveHintGiver } from '../../app/board-slice';
import { getColor } from '../../themes';
import { useCallback, useEffect, useRef, useState } from 'react';


const StyledHintGiver = styled.div`
  position:absolute;
  bottom:-1rem;
  width:100%;
  height:100%;
  left:10%;
  transition: width .25s ease-in, height .5s ease-in-out, left 1s ease-out, background-color .5s, color .5s, border-radius .5s;
  border-radius: 3rem 3rem 0 0;

  &.hg-body1, &.hg-body2, &.hg-body3 {

    >div{
      opacity: 1;
      transition: opacity .25s;
      transition-delay: .25s;
      >div{
        width:100%;
        height:100%;
        transition: width .25s cubic-bezier(0.6, 1.47, 1, 1.06), height .25s cubic-bezier(0.6, 1.47, 1, 1.06);
        transition-delay: .25s;
      }
    }
  }

  &.hg-none{
    background-color: ${getColor('brown')};
    border: var(--bordersize) solid ${getColor('brown_light')};
    height: 5rem;
    width: 80%;
    left: 10%;
  }

  &.hg-body1 {
    background-color: ${getColor('brown_dark')};
    border: var(--bordersize) solid ${getColor('brown')};
    height: 60%;
    width: 90%;
    left: 5%;
  }

  &.hg-body2 {
    background-color: ${getColor('green_dark')};
    border: var(--bordersize) solid ${getColor('green')};
    border-radius: var(--bordersize) 12rem 0 0;
    height: 100%;
    width: 70%;
    left: 15%;
  }

  &.hg-body3 {
    border-radius: var(--roundedradius) var(--roundedradius) 0 0;
    background-color: ${getColor('brown')};
    border: var(--bordersize) solid ${getColor('brown_light')};
    height: 90%;
    width: 80%;
    left: 10%;
  }

  &.transitioning {
    >div{
      opacity: 0;
      transition: opacity 0s;

      >div{
        width:50%;
        height:50%;
        transition: width 0s, height 0s;
        transition-delay: 0s;
      }
    }
  }

`;

const StyledLilManContainer = styled.div`
  position: absolute;
  width:100%;
  height:100%;
  left:50%;
  top:50%;
  transform: translate(-50%, -50%);
`;

interface HintGiverProps {
  isTalking?: boolean,
  align?: 'bottom' | 'top'
}


export function NewHintGiver({ isTalking, align = 'bottom' }: HintGiverProps) {
  const hintGiver = useAppSelector(selectActiveHintGiver);
  const [ bodyType, setBodyType ] = useState('');
  const [ transition, setTransition ] = useState(false);
  const transitionTimer: { current: NodeJS.Timeout | null } = useRef(null);

  const startTransition = useCallback(() => {
    setTransition(true);
    transitionTimer.current = global.setTimeout(() => {
      setTransition(false);
    }, 250);
  }, []);

  useEffect(() => {
    if(hintGiver && hintGiver.bodyType){
      if(bodyType !== hintGiver.bodyType){
        setBodyType(hintGiver.bodyType);
        startTransition();
      }
    }
  }, [ hintGiver, bodyType, transition, startTransition ]);

  useEffect(() => {
    global.clearTimeout(transitionTimer.current as NodeJS.Timeout);
  }, []);

  if (!hintGiver || !bodyType) {
    return (
      <StyledHintGiver className={'hg-none'} >
      </StyledHintGiver>
    );
  }

  const hideFace = hintGiver.bodyType !== bodyType;
  const bodyClass = transition ? `hg-${bodyType} transitioning` : `hg-${bodyType}`;

  return (
    <StyledHintGiver className={bodyClass} >
      <StyledLilManContainer>
        <LilFace
          isTalking={isTalking}
          hintGiver={hintGiver}
          hideFace={hideFace}
        />
      </StyledLilManContainer>
    </StyledHintGiver>
  );
}
