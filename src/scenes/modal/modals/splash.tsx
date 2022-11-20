import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { getLevelIdx, resumeLevel, startLevel } from '../../../app/board-slice';
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
      {levelIdx > -1 && (
        <>
          <p>{'welcome back!'}</p>
          <p>{'saves are work in progress and will be reset often.'}</p>
        </>
      ) }
      </StyledModalBody>

      <StyledModalFooter>
        {levelIdx > -1 ? (
          <>
            <Button buttonType="negative" text={'CLEAR SAVE'} onClick={() => resetData()} />
            <Button text={'CONTINUE SAVED'} onClick={() => dispatch(resumeLevel(levelIdx))} />
          </>
        ):(
          <>
            <Button text={'NEW GAME'} onClick={() => dispatch(startLevel(0))} />
          </>
        )}
      </StyledModalFooter>
    </StyledModalContainer>
  );
}