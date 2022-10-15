import { useCallback } from 'react';
import styled from 'styled-components';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { getColor } from '../../themes';
import { checkIfSolved, getRoundStatus, resetMatrix, selectSolution, setGameStatus, submitAnswer } from './slice';

const StyledContainer = styled.div`
  margin-left:2rem;
`;

const StyledDebug = styled.div`
  font-size:2rem;
  opacity:.25;

  li{
    list-style:none;
  }
`

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

const StyledSolvedStatus = styled(StyledStatus)`
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

export function Status() {
  const renderedSolution = useAppSelector(selectSolution);
  const solved = useAppSelector(checkIfSolved);
  const roundStatus = useAppSelector(getRoundStatus);

  const dispatch = useAppDispatch();
  const onSubmitGame = useCallback((solved:boolean, forceWin?: boolean) => {
    dispatch(submitAnswer(forceWin || solved));
  }, [ dispatch ]);

  return (
    <StyledContainer>
      <StyledDebug>
        <p>{'DEBUG SOLUTION'}</p>
        <ul>
          {renderedSolution?.map((rS, idx) => (
            <li key={idx}>{`[ ${rS.join(' | ')} ]`}</li>
          ))}
        </ul>
      </StyledDebug>

      
      <StyledStatusContainer>
        <p>{roundStatus}</p>
        <StyledResetButton onClick={() => dispatch(resetMatrix())}>{'RESET'}</StyledResetButton>
        <StyledSolvedStatus onClick={() => onSubmitGame(solved)}>{'SUBMIT'}</StyledSolvedStatus>
        <StyledSolvedStatus onClick={() => onSubmitGame(solved, true)}>{'CHEAT!'}</StyledSolvedStatus>
        <StyledHelpButton onClick={() => dispatch(setGameStatus('help'))}>{'HELP?'}</StyledHelpButton>
      </StyledStatusContainer>
    </StyledContainer>
  );
}
