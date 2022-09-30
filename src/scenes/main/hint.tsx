import { useCallback } from 'react';
import styled from 'styled-components';
import Spritesheet from 'react-responsive-spritesheet';

import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { getColor, mixinFontFamily } from '../../themes';
import { HintText } from './hinttext';
import { selectActiveHint, setActiveHint } from './slice';
import { HintGiver } from '../../types';
import { produceWithPatches } from 'immer';

const StyledContainer = styled.div`
  position:fixed;
  z-index:1;
  left:10%;
  right:10%;
  height:50%;
  min-height:40rem;
  top:20%;
  padding: 2rem;

  display:grid;
  grid-template-columns: 25% 75%;
  grid-template-rows: 3rem 2rem auto 10rem;
`;

const StyledLilManContainer = styled.div`
  grid-column: 1 / span 1;
  grid-row: 2 / span 2;
  position:relative;
`;

const StyledHintBox = styled.div`
  grid-column: 2 / span 1;
  grid-row: 3 / span 1;
  padding: 2rem;

  p{
    ${mixinFontFamily('speech')};
    font-size:5rem;
  }
`;

const StyledHintHeader = styled.div`
  grid-column: 1 / span 2;
  grid-row: 1 / span 2;

  text-align:left;
  font-size: 3rem;
  margin-top: -2rem;
  
  >*{
    font-size: 8rem;
    color: ${getColor('black')};
    opacity: .5;
  }
`;


const StyledControls = styled.div`
  grid-column: 1 / span 3;
  grid-row: 4 / span 1;
  padding: 0rem;

  button{
    border-radius: 1rem;
    width: 100%;
    height: 100%;
    background-color: ${getColor('brown_light')};
    color: ${getColor('brown_dark')};
    border: .5rem solid ${getColor('brown_dark')};
    
    font-size: 5rem;

    cursor: pointer;

    &:hover{
      color: ${getColor('brown')};
      border-color: ${getColor('brown')};
    }
  }
`;

const LovelyFeud = styled.div`
  position:fixed;
  left:0;
  right:0;
  top:0;
  bottom:0;
  z-index:-2;

  background-image: linear-gradient(to bottom, rgba(255,0,0,0), rgba(0,0,0,1));
`;

const StyledBg = styled.div`
  position:absolute;
  left:0;
  right:0;
  top:0;
  bottom:0;
  z-index: -1;

  border-radius: 1rem;
  background-color: ${getColor('white')};
  border: .5rem solid ${getColor('brown_dark')};
`;

type LilManProps = {
  imageUrl: string
};


const StyledLilMan = styled.div<LilManProps>`
  position:absolute;
  width:100%;
  height:100%;
  top:0rem;
  background: url(${p => p.imageUrl}) no-repeat center;
  background-position:center;
  background-size:contain;
  filter: drop-shadow(0 0 7rem ${getColor('brown')});
`;


const renderLilMan = (hintGiver: HintGiver) => {
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
    />
  )
} else{
    return (
      <StyledLilMan
        imageUrl={hintGiver.largeImage}
        title={hintGiver.name}
      />
    );
  }
}

export function Hint() {
  const hint = useAppSelector(selectActiveHint);

  const dispatch = useAppDispatch();
  const onCloseHint = useCallback(() => {
    dispatch(setActiveHint(-1));
  }, [ dispatch ]);

  if(!hint) return null;

  return (
    <StyledContainer>
      <StyledHintHeader>
        <p>{hint.hintGiver.name}</p>
      </StyledHintHeader>
      <StyledLilManContainer>
        { renderLilMan(hint.hintGiver) }
      </StyledLilManContainer>
      <StyledHintBox>
        <HintText hintText={hint.text} />
      </StyledHintBox>
      <StyledControls>
        <button onClick={() => onCloseHint()}>{'CLOSE'}</button>
      </StyledControls>
      <StyledBg />
      <LovelyFeud />
    </StyledContainer>
  );
}
