import { useCallback } from 'react';
import styled from 'styled-components';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { getColor } from '../../themes';
import { getHints, setActiveHint } from './slice';

const StyledContainer = styled.div`
  margin-left:2rem;
  height:8rem;
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

  /* border: .25rem solid white; */

  position: relative;
`;

type LilManProps = {
  imageUrl: string
};

const StyledLilMan = styled.div<LilManProps>`
  position:absolute;
  /* border: .25rem solid white; */
  width:100%;
  left:50%;
  transform: translateX(-50%);
  height:20rem;
  top:-5rem;
  background: url(${p => p.imageUrl}) no-repeat center;
  background-position:top;
  background-size:cover;
  cursor: pointer;

  &:hover{
    top:-9rem;
    width:130%;
    transition: top .2s ease-out, width .4s;
    filter: drop-shadow(0 0 .5rem #ffffff);
  }
  transition: top .2s ease-out, width .4s;
`;

export function Footer() {
  const hints = useAppSelector(getHints);

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
              imageUrl={'assets/fly.gif'}
              title={hint}
              onClick={() => onClickHint(idx)}
            /> 
          </StyledLilManContainer>
        ))}
      </ul>
    </StyledContainer>
  );
}
