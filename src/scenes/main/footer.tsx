import { useCallback } from 'react';
import styled from 'styled-components';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { selectHints, setActiveHint } from './slice';

const StyledContainer = styled.div`
  margin-left:2rem;
  height:2rem;
  border-top: .25rem solid white;

  h4{
    margin-top:-4rem;
  }
  ul{
    padding-left:10rem;
    height:100%;
  }
`;

const StyledLilManContainer = styled.div`
  display:inline-block;
  width:20rem;
  height:100%;
  vertical-align:top;
  margin-left: 2rem;
  margin-right: 2rem;
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
  height:20rem;
  top:-12rem;
  background: url(${p => p.imageUrl}) no-repeat center;
  background-position:top;
  background-size:cover;
  cursor: pointer;

  &:hover{
    top:-16rem;
    width:130%;
    transition: top .2s ease-out, width .4s;
    filter: drop-shadow(0 0 .5rem #ffffff);
  }
  transition: top .2s ease-out, width .4s;
`;

export function Footer() {
  const hints = useAppSelector(selectHints);

  const dispatch = useAppDispatch();
  const onClickHint = useCallback((hintIdx) => {
    dispatch(setActiveHint(hintIdx));
  }, [ dispatch ]);

  return (
    <StyledContainer>
      <h4>{'Hints:'}</h4>
      <ul>
        {hints?.map((hint, idx) => (
          <StyledLilManContainer key={idx}>
            <StyledLilMan 
              imageUrl={hint.hintGiver.thumbImage}
              title={hint.text}
              onClick={() => onClickHint(idx)}
            /> 
          </StyledLilManContainer>
        ))}
      </ul>
    </StyledContainer>
  );
}
