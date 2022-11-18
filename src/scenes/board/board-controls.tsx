import { useCallback } from 'react';
import styled from 'styled-components';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { getColor } from '../../themes';
import { checkIfSolved, setGameStatus, submitAnswer } from '../../app/board-slice';

const StyledButton = styled.div`
  border-radius: 1rem;
  border: .4rem solid ${getColor('brown')};
  cursor: pointer;
  transition: background-color .1s, border-color .2s, box-shadow .15s, transform .15s;
  text-align:center;
  font-size:2.5rem;
  padding: .5rem .5rem;
  
  &:active{
    transform: translate(.35rem, .35rem);
  }
`;

const StyledSolvedButton = styled(StyledButton)`
  padding: 1.5rem .5rem;

  color: ${getColor('white')};
  background-color:${getColor('green')};
  border-color: ${getColor('green_light')};
  box-shadow: 0.4rem 0.4rem 0 0.1rem ${getColor('green_light')};

  &:hover{
    border-color: ${getColor('white')};
  }
`;

const StyledHelpButton = styled(StyledButton)`
  padding: 0.25rem .5rem;
  color: ${getColor('brown_dark')};
  background-color:${getColor('yellow')};
  border-color: ${getColor('yellow_light')};
  box-shadow: 0.4rem 0.4rem 0 0.1rem ${getColor('yellow_light')};
  
  &:hover{
    border-color: ${getColor('white')};
  }
  &:active{
    background-color: ${getColor('yellow')};
    border-color: ${getColor('yellow_light')};
    box-shadow: 0.1rem 0.1rem 0 0.3rem ${getColor('yellow_light')};
  }
`;

const StyledProgressButton = styled(StyledButton)`
  padding: 0.25rem .5rem;
  color: ${getColor('purple')};
  background-color:${getColor('brown_dark')};
  border-color: ${getColor('purple')};
  box-shadow: 0.4rem 0.4rem 0 0.1rem ${getColor('purple')};
  
  &:hover{
    color: ${getColor('pink')};
    border-color: ${getColor('pink')};
  }
  &:active{
    color: ${getColor('purple')};
    background-color: ${getColor('brown_dark')};
    border-color: ${getColor('purple')};
    box-shadow: 0.1rem 0.1rem 0 0.3rem ${getColor('purple')};
  }
`;

const StyledContainer = styled.div`
  ${StyledButton}{
    margin:1rem;
  }
`;

export function BoardControls() {
  const solved = useAppSelector(checkIfSolved);

  const dispatch = useAppDispatch();
  const onSubmitGame = useCallback((solved:boolean, forceWin?: boolean) => {
    dispatch(submitAnswer(forceWin || solved));
  }, [ dispatch ]);

  return (
    <StyledContainer>
      <StyledProgressButton onClick={() => dispatch(setGameStatus('progress'))}>{'progress'}</StyledProgressButton>
      <StyledHelpButton onClick={() => dispatch(setGameStatus('debug'))}>{'debug'}</StyledHelpButton>
      <StyledHelpButton onClick={() => dispatch(setGameStatus('help'))}>{'HELP!'}</StyledHelpButton>
      <StyledSolvedButton onClick={() => onSubmitGame(solved)}>{'SUBMIT'}</StyledSolvedButton>
    </StyledContainer>
  );
}
