import styled from 'styled-components';
import { getColor } from '../../themes';
import { getGameReady } from '../../app/slice';
import { Board } from '../board';
import { Modal } from '../modal';
import { useSelector } from 'react-redux';
import { RuleMaster } from './rulemaster';
import { HintBanner } from './hints/banner';

const StyledContainer = styled.div`
  position:absolute;
  left:0;
  top:0;
  bottom:0;
  right:0;
  background-color: ${getColor('brown')};
  color: ${getColor('brown_dark')};
  overflow: hidden;

  display:flex;
  flex-direction:column;
`;

const StyledBody = styled.div`
  flex: 1;
`;

const StyledFooter = styled.div`
  flex: 0 0 15rem;
  position:relative;
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
      <StyledFooter>
        <HintBanner />
      </StyledFooter>
    </StyledContainer>
  );
}
