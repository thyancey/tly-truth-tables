import styled from 'styled-components';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { Button } from '../../components/button';
import { restartRound, selectAttributes, selectGridInfo, selectSolution, setGameStatus, startNextRound, startRound } from '../../app/slice';
import { getColor } from '../../themes';
import { createComparisonHash } from '../../utils/puzzler';

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

const StyledWebsiteLink = styled.a`
  font-size: 3rem;
  color: ${getColor('black')};

  &:hover{
    color: ${getColor('white')};
  }
`

export function WinModal() {
  const dispatch = useAppDispatch();

  return (
    <StyledContainer>
      <StyledBody>
        <h2>{'CORRECT!'}</h2>
      </StyledBody>
      <StyledButtonContainer>
        <Button text={'NEXT LEVEL'} onClick={() => dispatch(startNextRound())} />
        <Button buttonType={'special'} text={'REPLAY LEVEL'} onClick={() => dispatch(startNextRound())} />
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
        <Button buttonType={'positive'} text={'KEEP TRYING'} onClick={() => dispatch(setGameStatus('playing'))} />
        <Button buttonType={'special'} text={'RESET LEVEL'} onClick={() => dispatch(restartRound())} />
        <Button buttonType={'negative'} text={'SKIP TO NEXT LEVEL!'} onClick={() => dispatch(startNextRound())} />
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

const StyledSolution = styled.div`
  margin-top: 2rem;

  table{
    width:100%;
    border-collapse: collapse;
    tr{
      border: 2px solid ${getColor('white')};
    }
    th, td{
      padding:.5rem;
      text-align:center;
      border: 2px solid ${getColor('white')};
    }
  }
`
const StyledInstructions = styled.ul`
  text-align:left;
`;

export function HelpModal() {
  const dispatch = useAppDispatch();

  return (
    <StyledContainer>
      <h2>{'HELP!'}</h2>
      
      <StyledInstructions>
        <li><p>{'Click the characters at the bottom of the screen to reveal clues about the puzzle'}</p></li>
        <li><p>{'Click the grid cells to cycle between RED (no) and GREEN (yes)'}</p></li>
        <li><p>{'After selecting all of the correct GREEN tiles, click SUBMIT to see if you have the answer correct'}</p></li>
        <li><p>{'The RED tiles do not need to be filled in to solve the puzzle, but they can be used to help you rule out information!'}</p></li>
        <li><p>{'Each attribute combination can only be used once'}</p></li>
        <li><p>{'You may have to iterate through the clues multiple times to arrive at an answer'}</p></li>
      </StyledInstructions>
      
      <StyledDebug>
      </StyledDebug>
      <StyledButtonContainer>
        <Button text={'OK'} onClick={() => dispatch(setGameStatus('playing'))} />
        <StyledWebsiteLink href="https://www.thomasyancey.com" target="_blank" title="see some of my other stuff">{'thomasyancey.com'}</StyledWebsiteLink>
      </StyledButtonContainer>
    </StyledContainer>
  );
}

export function DebugModal() {
  const dispatch = useAppDispatch();
  const renderedSolution = useAppSelector(selectSolution);
  const attributes = useAppSelector(selectAttributes);
  const gridInfo = useAppSelector(selectGridInfo);

  const comparisonHash = createComparisonHash(gridInfo.numAttributes, gridInfo.numValues);
  console.log('comparisonHash: ', comparisonHash);

  return (
    <StyledContainer>
      <h3>{'debug info'}</h3>
      <StyledSolution>
        <p>{'DEBUG SOLUTION'}</p>
        <table>
          <thead>
            <tr>
              {attributes.map((attr, idx) => (
                <th key={idx}><span>{`group ${idx + 1}`}</span></th>
              ))}
            </tr>
          </thead>
          <tbody>
            {renderedSolution?.map((rS, idx) => (
              <tr key={idx}>
                {rS.map((rSe, rSeIdx) => (
                  <td key={`${idx}-${rSeIdx}`}><span>{rSe}</span></td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </StyledSolution>
      <StyledButtonContainer>
        <Button text={'OK'} onClick={() => dispatch(setGameStatus('playing'))} />
      </StyledButtonContainer>
    </StyledContainer>
  );
}
