import styled from 'styled-components';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { getLevelIdx, startLevel } from '../../../app/board-slice';
import { Button } from '../../../components/button';
import { StyledModalBody, StyledModalContainer, StyledModalFooter, StyledModalHeader } from './basic';
import { resetData } from '../../../utils/localstorage';

const StyledFooter = styled(StyledModalFooter)`
  >div{
    /* max-width: 30rem; */
    margin:2rem auto;
  }
`;

export function SplashModal() {
  const dispatch = useAppDispatch();
  const levelIdx = useAppSelector(getLevelIdx);

  return (
    <StyledModalContainer>
      <StyledModalHeader>
        <h1>{'TRUTH TABLES'}</h1>
      </StyledModalHeader>
      
      <StyledModalBody>
        <h2>{''}</h2>
      </StyledModalBody>

      <StyledFooter>
        {levelIdx > -1 ? (
          <>
            <Button buttonType="positive" text={'CONTINUE SAVED'} onClick={() => dispatch(startLevel(levelIdx))} />
            <Button buttonType="negative" text={'CLEAR SAVE'} onClick={() => resetData()} />
          </>
        ):(
          <>
            <Button buttonType="positive" text={'NEW GAME'} onClick={() => dispatch(startLevel(0))} />
          </>
        )}
      </StyledFooter>
    </StyledModalContainer>
  );
}