import styled from 'styled-components';
import { getColor } from '../../themes';
import { getGameReady } from '../../app/board-slice';
import { Board } from '../board';
import { Modal } from '../modal';
import { useSelector } from 'react-redux';
import { RuleMaster } from './rulemaster';
import { InfoPanel } from '../info-panel';

const StyledContainer = styled.div`
  position:absolute;
  left:0;
  top:0;
  bottom:0;
  right:0;
  background-color: ${getColor('brown')};
  color: ${getColor('brown_dark')};
  overflow: hidden;

  display:grid;
  grid-template-columns: 27rem auto;
  grid-template-rows: auto 30% 15rem;
`;

const StyledBody = styled.div`
  grid-column: 1 / span 2;
  grid-row: 1 / span 2;
`;

export function Main() {
  const gameReady = useSelector(getGameReady);

  return (
    <StyledContainer>
      <RuleMaster />
      <Modal />
      <StyledBody>
        {gameReady && <Board />}
      </StyledBody>
      <InfoPanel />
    </StyledContainer>
  );
}
