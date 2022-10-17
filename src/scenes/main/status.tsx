import { useCallback } from 'react';
import styled from 'styled-components';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { getColor } from '../../themes';
import { checkIfSolved, selectRoundInfo, setGameStatus, submitAnswer } from '../../app/slice';

const StyledContainer = styled.div`
  margin-left:2rem;
`;

const StyledStatusContainer = styled.div`
  position:absolute;
  right:0;
  top:0;
  color: ${getColor('brown_dark')};
  text-align:center;
`;

const StyledStatus = styled.div`
  border: .3rem solid ${getColor('brown_dark')};
  box-shadow: 0.0rem 0.4rem 0.1rem 0.1rem ${getColor('brown')};
  border-radius: 1.5rem;
  margin: .75rem;

  padding: .5rem 1rem;

  font-weight:500;
  font-size:2rem;

  cursor: pointer;
  
  &:active{
    color: ${getColor('yellow')};
    transform: translateY(.5rem);
    box-shadow: 0.0rem 0.0rem 0.0rem 0.0rem ${getColor('brown')};
  }
`;

const StyledResetButton = styled(StyledStatus)`
  background-color: ${getColor('pink')};  
  color: ${getColor('brown_dark')};
  border-color: ${getColor('brown_dark')};
  box-shadow: 0.0rem 0.4rem 0.1rem 0.1rem ${getColor('brown')};
  
  &:hover{
    color: ${getColor('yellow')};
  }
`

const StyledSolvedButton = styled(StyledStatus)`
  background-color: ${getColor('green')};  
  
  &:hover{
    color: ${getColor('yellow')};
  }
`;

const StyledHelpButton = styled(StyledStatus)`
  background-color: ${getColor('yellow')};  
  color: ${getColor('brown_dark')};
  border-color: ${getColor('brown_dark')};
  box-shadow: 0.0rem 0.4rem 0.1rem 0.1rem ${getColor('brown')};
  
  &:hover{
    background-color: ${getColor('green_light')};
  }
`;

const StyledPuzzlePrompt = styled.div`
  p {
    font-size: 3rem;
  }

  padding-right:10rem;
`;

export function Status() {
  const solved = useAppSelector(checkIfSolved);
  const roundInfo = useAppSelector(selectRoundInfo);

  const dispatch = useAppDispatch();
  const onSubmitGame = useCallback((solved:boolean, forceWin?: boolean) => {
    dispatch(submitAnswer(forceWin || solved));
  }, [ dispatch ]);

  return (
    <StyledContainer>
      {roundInfo && (
        <StyledPuzzlePrompt>
          <p>{`Level ${roundInfo.level}: ${roundInfo.title}`}</p>
          {roundInfo.description && (
            <p>{roundInfo.description}</p>
          )}
        </StyledPuzzlePrompt>
      )}
      <StyledStatusContainer>
        <StyledSolvedButton onClick={() => onSubmitGame(solved)}>{'SUBMIT'}</StyledSolvedButton>
        <StyledResetButton onClick={() => onSubmitGame(solved, true)}>{'CHEAT!'}</StyledResetButton>
        <StyledHelpButton onClick={() => dispatch(setGameStatus('help'))}>{'HELP?'}</StyledHelpButton>
      </StyledStatusContainer>
    </StyledContainer>
  );
}
