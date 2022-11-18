import styled from 'styled-components';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { Button } from '../../../components/button';
import { restartLevel, selectAttributes, selectGridInfo, selectSolution, setGameStatus, startNextLevel, startLevel } from '../../../app/board-slice';
import { getColor } from '../../../themes';
import { createComparisonHash } from '../../../utils/puzzler';

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
        <h2>{'CORRECT!'}</h2>
      </StyledBody>
      <StyledButtonContainer>
        <Button text={'NEXT LEVEL'} onClick={() => dispatch(startNextLevel())} />
        <Button buttonType={'special'} text={'REPLAY LEVEL'} onClick={() => dispatch(startNextLevel())} />
      </StyledButtonContainer>
    </StyledContainer>
  );
}

export function LoseModal() {
  const dispatch = useAppDispatch();

  return (
    <StyledContainer>
      <StyledBody>
        <h2>{'INCORRECT!'}</h2>
        <p>{'Every green cell must match the solution'}</p>
      </StyledBody>
      <StyledButtonContainer>
        <Button buttonType={'positive'} text={'KEEP TRYING'} onClick={() => dispatch(setGameStatus('playing'))} />
        <Button buttonType={'special'} text={'RESET LEVEL'} onClick={() => dispatch(restartLevel())} />
        <Button buttonType={'negative'} text={'SKIP TO NEXT LEVEL!'} onClick={() => dispatch(startNextLevel())} />
      </StyledButtonContainer>
    </StyledContainer>
  );
}
