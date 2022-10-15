import styled from 'styled-components';
import { getColor } from '../../themes';
import { getGameReady } from './slice';
import { Board } from './board';
import { Status } from './status';
import { Footer } from './footer';
import { Hint } from './hint';
import { Modal } from '../modal';
import { useSelector } from 'react-redux';
import { RuleMaster } from './rulemaster';

const StyledContainer = styled.div`
  position:absolute;
  left:0;
  top:0;
  bottom:0;
  right:0;
  background-image: linear-gradient(to bottom, ${getColor('white')}, ${getColor('brown')});
  color: ${getColor('black')};
  overflow: hidden;

  display:flex;
  flex-direction:column;
`;

const StyledHeader = styled.div`
  flex: 0 0 10rem;
`;

const StyledBody = styled.div`
  flex: 1;
`;

const StyledTitle = styled.div`
  position:absolute;
  left:0;
  right:0;
  text-align:center;
  color: ${getColor('pink')};
  font-size: 15rem;
  letter-spacing: -.5rem;
  line-height: 10rem;
  opacity: .1;

  word-wrap: break-word;
`

const TITLE_TEXT = 'TOOTHTABLESTOOTHTABLESTOOTHTABLESTOOTHTABLESTOOTHTABLESTOOTHTABLES' +
  'TOOTHTABLESTOOTHTABLESTOOTHTABLESTOOTHTABLESTOOTHTABLESTOOTHTABLESTOOTHTABLES' +
  'TOOTHTABLESTOOTHTABLESTOOTHTABLESTOOTHTABLESTOOTHTABLESTOOTHTABLESTOOTHTABLES' +
  'TOOTHTABLESTOOTHTABLESTOOTHTABLESTOOTHTABLESTOOTHTABLESTOOTHTABLESTOOTHTABLES' +
  'TOOTHTABLESTOOTHTABLESTOOTHTABLESTOOTHTABLESTOOTHTABLESTOOTHTABLESTOOTHTABLES'

export function Main() {
  const gameReady = useSelector(getGameReady);

  return (
    <StyledContainer>
      <RuleMaster />
      <Modal />
      <Hint />
      <StyledTitle>{TITLE_TEXT}</StyledTitle>
      <StyledHeader>
        {gameReady && <Status />}
      </StyledHeader>
      <StyledBody>
        {gameReady && <Board />}
      </StyledBody>
      {gameReady && <Footer />}
    </StyledContainer>
  );
}
