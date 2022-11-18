import styled from 'styled-components';
import { useAppSelector } from '../../app/hooks';
import { getColor } from '../../themes';
import { GameStatus } from '../../types';
import { getGameStatus } from '../../app/slice';
import { WinModal, LoseModal } from './modals/winlose';
import { DebugModal } from './modals/debug';
import { SplashModal } from './modals/splash';
import { ProgressModal } from './modals/progress';
import { HelpModal } from './modals/help';

const StyledContainer = styled.div`
  position:fixed;
  left:0;
  top:0;
  right:0;
  bottom:0;
  z-index:5;
`;
const StyledModal = styled.div`
  position:absolute;

  left:50%;
  top:50%;
  transform: translate(-50%, -50%);
  max-width:80%;
  max-height:80%;
  border-radius:2rem;

  background-color: ${getColor('brown_light')};
  color: ${getColor('brown_dark')};
  border: 0.75rem solid ${getColor('brown_dark')};

  padding:1rem;
`;

const StyledModalBg = styled.div`
  position:absolute;
  left:0;
  right:0;
  top:0;
  bottom:0;
  background-color: ${getColor('brown')};
  opacity: .95;
  z-index:-1;
`;

export const getModal = (gameStatus: GameStatus) => {
  switch(gameStatus){
    case 'start': return <SplashModal />
    case 'roundWin': return <WinModal />
    case 'invalidAnswer': return <LoseModal />
    case 'help': return <HelpModal />
    case 'debug': return <DebugModal />
    case 'progress': return <ProgressModal />
    default: return null;
  }
}

export function Modal() {
  const gameStatus = useAppSelector(getGameStatus);
  const modal = getModal(gameStatus);
  if(!modal) return null;

  return (
    <StyledContainer>
      <StyledModal>
        {modal}
      </StyledModal>
      <StyledModalBg />
    </StyledContainer>
  );
}
