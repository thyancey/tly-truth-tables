import styled from 'styled-components';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { Button } from '../../../components/button';
// import { getColor } from '../../../themes';
import { selectSolution, setGameStatus, startNextRound, startRound } from '../slice';

const StyledButtonContainer = styled.div`
  
`;

const StyledContainer = styled.div`
  position:absolute;
  left:0;
  top:0;
  right:0;
  bottom:0;
  padding:3rem;

  text-align:center;

  ${StyledButtonContainer}{
    position:absolute;
    bottom: 1rem;
    left:10%;
    right:10%;
  }
`;

export function WinModal() {
  const dispatch = useAppDispatch();

  return (
    <StyledContainer>
      <h1>{'YOU WIN!'}</h1>
      <StyledButtonContainer>
        <Button text={'OK'} onClick={() => dispatch(startNextRound())} />
      </StyledButtonContainer>
    </StyledContainer>
  );
}

export function SplashModal() {
  const dispatch = useAppDispatch();

  return (
    <StyledContainer>
      <h1>{'TOOTH TABLES'}</h1>
      <h3>{'Some kinda puzzle game'}</h3>
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
      <h1>{'HELP!'}</h1>
      
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
