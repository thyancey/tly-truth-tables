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

  --leftcolsize: 27rem;
  --roundedradius: 6rem;
  --bordersize: .75rem;
  @media (max-width: 600px) {
    --leftcolsize: 17rem;
    --roundedradius: 4rem;
    --bordersize: .5rem;
  }

  display:grid;
  grid-template-columns: var(--leftcolsize) auto;
  grid-template-rows: auto 30% 15rem;
`;

const StyledBody = styled.div`
  grid-column: 1 / span 2;
  grid-row: 1 / span 2;
`;

const StyledWebsiteLink = styled.a`
  font-size: 2rem;
  color: ${getColor('brown_dark')};
  position:absolute;
  left:1rem;
  top:0;

  &:hover{
    color: ${getColor('brown_light')};
  }
  z-index:0;
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
      <StyledWebsiteLink href="https://www.thomasyancey.com" target="_blank" title="see some of my other stuff">{'thomasyancey.com'}</StyledWebsiteLink>
    </StyledContainer>
  );
}
