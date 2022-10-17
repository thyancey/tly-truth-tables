import styled from 'styled-components';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { Button } from '../../components/button';
// import { getColor } from '../../../themes';
import { restartRound, selectSolution, setGameStatus, startNextRound, startRound } from '../../app/slice';

const StyledButtonContainer = styled.div`
  flex: 1;
  >div{
    margin:2rem;
  }
`;

const StyledBody = styled.div`
  margin-top:-1.5rem;
  margin-bottom: 2rem;
`;

const StyledContainer = styled.div`
  display:flex;
  flex-direction:column;

  padding:1.5rem;
  text-align:center;
`;

export function WinModal() {
  const dispatch = useAppDispatch();

  return (
    <StyledContainer>
      <StyledBody>
        <h2>{'YOU WIN!'}</h2>
      </StyledBody>
      <StyledButtonContainer>
        <Button text={'OK'} onClick={() => dispatch(startNextRound())} />
      </StyledButtonContainer>
    </StyledContainer>
  );
}

export function InvalidAnswerModal() {
  const dispatch = useAppDispatch();

  return (
    <StyledContainer>
      <StyledBody>
        <h2>{'INCORRECT!'}</h2>
        <p>{'Every green cell must match the solution'}</p>
      </StyledBody>
      <StyledButtonContainer>
        <Button buttonType={'positive'} text={'BACK!'} onClick={() => dispatch(setGameStatus('playing'))} />
        <Button buttonType={'special'} text={'RESTART!'} onClick={() => dispatch(restartRound())} />
        <Button buttonType={'negative'} text={'SKIP!'} onClick={() => dispatch(startNextRound())} />
      </StyledButtonContainer>
    </StyledContainer>
  );
}

export function SplashModal() {
  const dispatch = useAppDispatch();

  return (
    <StyledContainer>
      <StyledBody>
        <h2>{'TRUTH TABLES'}</h2>
        <p>{'Some kinda puzzle game'}</p>
      </StyledBody>
      <StyledButtonContainer>
        <Button text={'OK'} onClick={() => dispatch(startRound(0))} />
      </StyledButtonContainer>
    </StyledContainer>
  );
}

const StyledDebug = styled.div`
  margin: 2rem;

  li{
    list-style:none;
  }
`

const StyledInstructions = styled.ul`
  text-align:left;
`;

export function HelpModal() {
  const dispatch = useAppDispatch();
  const renderedSolution = useAppSelector(selectSolution);

  return (
    <StyledContainer>
      <h2>{'HELP!'}</h2>
      
      <StyledInstructions>
        <li><p>{'Click the characters at the bottom of the screen to reveal clues about the puzzle'}</p></li>
        <li><p>{'Click the grid cells to cycle between RED (no), GREEN (yes) and YELLOW (maybe?)'}</p></li>
        <li><p>{'After selecting all of the correct GREEN tiles, click SUBMIT to see if you have the answer correct'}</p></li>
        <li><p>{'The RED and YELLOW tiles do not have to be filled in to have a correct answer, they\'re there to help you rule out information'}</p></li>
        <li><p>{'Each attribute combination can only be used once'}</p></li>
        <li><p>{'You may have to iterate through the clues multiple times to arrive at an answer'}</p></li>
      </StyledInstructions>
      
      <StyledDebug>
        <p>{'DEBUG SOLUTION'}</p>
        <ul>
          {renderedSolution?.map((rS, idx) => (
            <li key={idx}><span>{`${rS.join(' | ')}`}</span></li>
          ))}
        </ul>
      </StyledDebug>
      <StyledButtonContainer>
        <Button text={'OK'} onClick={() => dispatch(setGameStatus('playing'))} />
      </StyledButtonContainer>
    </StyledContainer>
  );
}
