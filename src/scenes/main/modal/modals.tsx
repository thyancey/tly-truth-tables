import styled from 'styled-components';
import { useAppDispatch } from '../../../app/hooks';
import { Button } from '../../../components/button';
// import { getColor } from '../../../themes';
import { setGameStatus, startNextRound } from '../slice';

const StyledContainer = styled.div`
  position:absolute;
  left:0;
  top:0;
  right:0;
  bottom:0;

  text-align:center;
`;

export function WinModal() {
  const dispatch = useAppDispatch();

  return (
    <StyledContainer>
      <h1>{'YOU WIN!'}</h1>
      <Button text={'OK'} onClick={() => dispatch(startNextRound())} />
    </StyledContainer>
  );
}

export function SplashModal() {
  const dispatch = useAppDispatch();

  return (
    <StyledContainer>
      <h1>{'TOOTH TABLES'}</h1>
      <Button text={'OK'} onClick={() => dispatch(startNextRound())} />
    </StyledContainer>
  );
}

export function HelpModal() {
  const dispatch = useAppDispatch();

  return (
    <StyledContainer>
      <h1>{'HELLLPPP'}</h1>
      <Button text={'OK'} onClick={() => dispatch(setGameStatus('playing'))} />
    </StyledContainer>
  );
}
