import { useCallback } from 'react';
import styled from 'styled-components';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { RandBetween } from '../../utils';
import { selectHints, setActiveHint } from './slice';
import { LilMan, StyledLilMan } from '../../components/lilman';

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

  ${StyledLilMan}{
    height: 30rem;
    top:-20rem;
    left:50%;
    transform: translateX(-50%);
    background-position:top;
    background-size:cover;
    cursor: pointer;
    &:hover{
      top:-24rem;
      width:130%;
      transition: top .2s ease-out, width .4s;
      filter: drop-shadow(0 0 .5rem #ffffff);
    }
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
            {/* { renderLilMan(hint.hintGiver, hint.text, () => onClickHint(idx))}*/}
            <LilMan hintGiver={hint.hintGiver} onClick={() => onClickHint(idx)}/> 
          </StyledLilManContainer>
        ))}
      </ul>
    </StyledContainer>
  );
}
