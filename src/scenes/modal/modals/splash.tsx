import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { getLevelIdx, resumeLevel, setGameStatus, startLevel } from '../../../app/board-slice';
import { Button } from '../../../components/button';
import { StyledModalBody, StyledModalContainer, StyledModalFooter, StyledModalHeader } from './basic';
import { resetData } from '../../../utils/localstorage';

export function SplashModal() {
  const dispatch = useAppDispatch();
  const levelIdx = useAppSelector(getLevelIdx);

  return (
    <StyledModalContainer>
      <StyledModalHeader>
        <h1>{'TRUTH TABLES'}</h1>
      </StyledModalHeader>
      
      <StyledModalBody style={{ textAlign:'center' }}>
      {levelIdx > -1 ? (
        <>
          <p>{'welcome back!'}</p>
          <p>{'saves are work in progress and will be reset often.'}</p>
        </>
      ) : (
        <>
          <p>{'click HOW TO PLAY to get started.'}</p>
          <p>{'this game is a work in progress and will change often.'}</p>
        </>
      )}
      </StyledModalBody>

      <StyledModalFooter>
        {levelIdx > -1 ? (
          <>
            <Button buttonType="special" text={'HOW TO PLAY'} onClick={() => dispatch(setGameStatus('help'))} />
            <Button buttonType="negative" text={'CLEAR SAVE'} onClick={() => resetData()} />
            <Button text={'CONTINUE SAVED'} onClick={() => dispatch(resumeLevel(levelIdx))} />
          </>
        ):(
          <>
            <Button buttonType="special" text={'HOW TO PLAY'} onClick={() => dispatch(setGameStatus('help'))} />
            <Button text={'NEW GAME'} onClick={() => dispatch(startLevel(0))} />
          </>
        )}
      </StyledModalFooter>
    </StyledModalContainer>
  );
}