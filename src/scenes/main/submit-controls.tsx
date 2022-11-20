import { useCallback } from 'react';
import styled from 'styled-components';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { getColor } from '../../themes';
import { checkIfSolved, setGameStatus, submitAnswer } from '../../app/board-slice';

const StyledButton = styled.div`
  border: .75rem solid ${getColor('brown_dark')};
  box-shadow: 0.0rem 0.4rem 0.1rem 0.1rem ${getColor('brown')};
  border-radius: 1.5rem;
  margin: .5rem;
  padding: .5rem 2rem;
  font-weight:500;
  font-size:4rem;
  cursor: pointer;
  
  &:active{
    transform: translateY(.5rem);
    box-shadow: 0.0rem 0.0rem 0.0rem 0.0rem ${getColor('brown')};
  }
`;

const StyledSolvedButton = styled(StyledButton)`
  color: ${getColor('brown_dark')};
  border-color: ${getColor('brown_dark')};
  background-color: ${getColor('green')};  
  box-shadow: 0.0rem 0.6rem 0.1rem -0.1rem ${getColor('green')};
  border-radius: 0 1.5rem 1.5rem 0;

  z-index:999;
  
  &:hover{
    background-color: ${getColor('green_light')};  
  }
`;

const StyledHelpButton = styled(StyledButton)`
  padding: .5rem;
  margin-right: -1.25rem;
  color: ${getColor('brown_dark')};
  border-color: ${getColor('brown_dark')};
  background-color: ${getColor('yellow')};  
  box-shadow: 0.0rem 0.6rem 0.1rem -0.1rem ${getColor('green')};
  border-radius: 1.5rem 0 0 1.5rem;
  
  &:hover{
    background-color: ${getColor('yellow_light')};  
  }
`;

const StyledContainer = styled.div`
  position:absolute;
  right:1rem;
  bottom: calc(100% + 1rem);
  text-align:center;

  >${StyledButton}{
    display:inline-block;
  }
`;

export function SubmitControls() {
  const solved = useAppSelector(checkIfSolved);

  const dispatch = useAppDispatch();
  const onSubmitGame = useCallback((solved:boolean, forceWin?: boolean) => {
    dispatch(submitAnswer(forceWin || solved));
  }, [ dispatch ]);

  return (
    <StyledContainer>
      <StyledHelpButton onClick={() => dispatch(setGameStatus('help'))}>{'?'}</StyledHelpButton>
      <StyledSolvedButton onClick={() => onSubmitGame(solved)}>{'SUBMIT'}</StyledSolvedButton>
    </StyledContainer>
  );
}
