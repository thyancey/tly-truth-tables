import styled from 'styled-components';
import { useAppSelector } from '../../app/hooks';
import { getColor } from '../../themes';
import { GameStatus } from '../../types';
import { getGameStatus } from '../main/slice';
import { HelpModal, SplashModal, WinModal } from './modals';

const StyledContainer = styled.div`
  position:fixed;
  left:10%;
  top:10%;
  width:80%;
  height:80%;
  border-radius:1rem;

  background-color: ${getColor('brown_light')};
  color: ${getColor('brown_dark')};
  border: 0.5rem solid ${getColor('brown_dark')};

  z-index:1;
  padding: 1rem;
`;

export const getModal = (gameStatus: GameStatus) => {
  switch(gameStatus){
    case 'start': return <SplashModal />
    case 'roundWin': return <WinModal />
    case 'help': return <HelpModal />
    default: return null;
  }
}

export function Modal() {
  const gameStatus = useAppSelector(getGameStatus);
  const modal = getModal(gameStatus);
  if(!modal) return null;

  return (
    <StyledContainer>
      {modal}
    </StyledContainer>
  );
}
