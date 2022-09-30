import { useCallback } from 'react';
import styled from 'styled-components';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { HintGiver } from '../../types';
import { RandBetween } from '../../utils';
import { selectHints, setActiveHint } from './slice';
import Spritesheet from 'react-responsive-spritesheet';

const StyledContainer = styled.div`
  height:5rem;
  padding-left:2rem;

  h4{
    padding-top:1rem;
  }
  ul{
    padding-left:10rem;
    height:100%;
  }
`;

const StyledLilManContainer = styled.div`
  display:inline-block;
  min-width: 20rem;
  height:100%;
  vertical-align:top;
  position: relative;
`;

type LilManProps = {
  imageUrl: string
};

const StyledLilMan = styled.div<LilManProps>`
  position:absolute;
  width:100%;
  left:50%;
  transform: translateX(-50%);
  height:30rem;
  top:-20rem;
  background: url(${p => p.imageUrl}) no-repeat center;
  background-position:top;
  background-size:cover;
  cursor: pointer;

  &:hover{
    top:-24rem;
    width:130%;
    transition: top .2s ease-out, width .4s;
    filter: drop-shadow(0 0 .5rem #ffffff);
  }
  transition: top .2s ease-out, width .4s;
`;

const getRandomPlacement = (idx: number, topRange: number[], widthRange: number[], leftRange: number[]) => {
  return {
    // marginLeft: idx === 0 ? `-10rem` : `${RandBetween(leftRange[0], leftRange[1])}rem`,
    marginLeft: idx === 0 ? `-10rem` : `${RandBetween(leftRange[0], leftRange[1])}rem`,
    marginTop: `${RandBetween(topRange[0], topRange[1])}rem`,
    width: `${RandBetween(widthRange[0], widthRange[1])}px`
  }
}

const StyledSpritesheet = styled.div`
  width:100%;
  height:100%;
  cursor:pointer;

  >*{
    position: absolute;
    bottom:-4rem;
    width:100%;

    transform-origin:center;
    transition: bottom .2s ease-out, transform .4s  ease-out;
  }

  &:hover {
    >*{
      transform-origin:center;
      transform: scale(1.2);
      bottom:0rem;
      transition: bottom .2s ease-out, transform .4s  ease-out;
      filter: drop-shadow(0 0 .5rem #ffffff);
    }
  }
`;

const renderLilMan = (hintGiver: HintGiver, hintText: string, onClickHint: Function) => {
  if(hintGiver.imageType === 'spritesheet'){
   return (
      <StyledSpritesheet>
        <Spritesheet
          image={hintGiver.largeImage}
          widthFrame={56}
          heightFrame={56}
          startAt={15}
          endAt={16}
          steps={20}
          fps={5}
          direction={'forward'}
          isResponsive={true}
          loop={true}
          onClick={() => onClickHint()}
          backgroundPosition={'center bottom'}
        />
     </StyledSpritesheet>
   )
 } else{
     return (
      <StyledLilMan 
        imageUrl={hintGiver.thumbImage}
        title={hintText}
        onClick={() => onClickHint()}
      /> 
     );
   }
 }
 

export function Footer() {
  const hints = useAppSelector(selectHints);

  const dispatch = useAppDispatch();
  const onClickHint = useCallback((hintIdx) => {
    dispatch(setActiveHint(hintIdx));
  }, [ dispatch ]);

  return (
    <StyledContainer>
      <ul>
        {hints?.map((hint, idx) => (
          <StyledLilManContainer key={idx} style={getRandomPlacement(idx, [-1, 3], [120, 170], [-7, -2])} >
            { renderLilMan(hint.hintGiver, hint.text, () => onClickHint(idx))}
          </StyledLilManContainer>
        ))}
      </ul>
    </StyledContainer>
  );
}
