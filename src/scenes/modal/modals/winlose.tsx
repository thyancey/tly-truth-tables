import { useAppDispatch } from '../../../app/hooks';
import { Button } from '../../../components/button';
import { restartLevel, setGameStatus, startNextLevel } from '../../../app/board-slice';
import { StyledModalBody, StyledModalContainer, StyledModalFooter, StyledModalHeader } from './basic';

export function WinModal() {
  const dispatch = useAppDispatch();

  return (
    <StyledModalContainer>
      <StyledModalHeader>
        <h1>{'CORRECT!'}</h1>
      </StyledModalHeader>

      <StyledModalBody>
        
      </StyledModalBody>
      <StyledModalFooter>
        <Button text={'NEXT LEVEL'} onClick={() => dispatch(startNextLevel())} />
        <Button buttonType={'special'} text={'REPLAY LEVEL'} onClick={() => dispatch(startNextLevel())} />
      </StyledModalFooter>
    </StyledModalContainer>
  );
}

export function LoseModal() {
  const dispatch = useAppDispatch();

  return (
    <StyledModalContainer>
      <StyledModalHeader>
        <h1>{'INCORRECT!'}</h1>
      </StyledModalHeader>

      <StyledModalBody>
        <p>{'Every green cell must match the solution'}</p>
      </StyledModalBody>
      <StyledModalFooter>
        <Button buttonType={'negative'} text={'RESET LEVEL'} onClick={() => dispatch(restartLevel())} />
        <Button buttonType={'special'} text={'SKIP TO NEXT LEVEL!'} onClick={() => dispatch(startNextLevel())} />
        <Button text={'KEEP TRYING'} onClick={() => dispatch(setGameStatus('playing'))} />
      </StyledModalFooter>
    </StyledModalContainer>
  );
}
