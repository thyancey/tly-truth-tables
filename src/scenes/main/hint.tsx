import { useCallback } from 'react';
import styled from 'styled-components';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { getColor, mixinFontFamily } from '../../themes';
import { selectActiveHint, setActiveHint } from './slice';


const StyledContainer = styled.div`
  position:fixed;
  z-index:1;
  left:10%;
  right:10%;
  height:50%;
  top:25%;
  padding: 2rem;

  border-radius: 1rem;
  border: .5rem solid ${getColor('white')};
  background-color: ${getColor('black')};

  display:grid;
  grid-template-columns: 33% 67%;
  grid-template-rows: 5rem auto 10rem;
`;

const StyledLilManContainer = styled.div`
  grid-column: 1 / span 1;
  grid-row: 2 / span 1;
  position:relative;
`;

const StyledHintBox = styled.div`
  grid-column: 2 / span 1;
  grid-row: 2 / span 1;
  padding: 2rem;

  p{
    ${mixinFontFamily('speech')};
    font-size:5rem;
  }
`;

const StyledHintHeader = styled.div`
  grid-column: 2 / span 1;
  grid-row: 1 / span 1;

  text-align:right;
  font-size: 3rem;
  margin-right: 1rem;
  margin-top: 0.5rem;
`;


const StyledControls = styled.div`
  grid-column: 1 / span 3;
  grid-row: 3 / span 1;
  padding: 2rem;

  button{
    border-radius: 1.5rem;
    width: 100%;
    height: 100%;
    background-color: ${getColor('purple')};
    color: ${getColor('white')};
    
    font-size: 3rem;

    cursor: pointer;
  }
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
`;

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
        <StyledLilMan 
          imageUrl={hint.hintGiver.largeImage}
          title={hint.hintGiver.name}
        /> 
      </StyledLilManContainer>
      <StyledHintBox>
        <p>{hint.text}</p>
      </StyledHintBox>
      <StyledControls>
        <button onClick={() => onCloseHint()}>{'Close'}</button>
      </StyledControls>
    </StyledContainer>
  );
}
