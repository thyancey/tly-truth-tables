import styled from 'styled-components';
import { getColor } from '../../themes';
import { getGameReady } from '../../app/board-slice';
import { Board } from '../board';
import { Modal } from '../modal';
import { useSelector } from 'react-redux';
import { RuleMaster } from './rulemaster';
import { InfoPanel } from '../info-panel';
import { useCallback, useEffect, useState } from 'react';

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

const StyledWebsiteLink = styled.a`
  font-size: 2rem;
  color: ${getColor('brown_dark')};
  position:absolute;
  left:1rem;;
  top:0;

  &:hover{
    color: ${getColor('brown_light')};
  }
  z-index:0;
`;

const evCache: any[] = [];
let prevDiff: number = -1;


const StyledDebugThing = styled.div`
  position: absolute;
  top:2rem;
  left:1rem;

  font-size: 3rem;
  text-align:left;
  color:white;
  pointer-events: none;
`;




export function Main() {
  const gameReady = useSelector(getGameReady);
  const [ debugMessage, setDebugMessage ] = useState('');
  
  useEffect(() => {
    // document.addEventListener('mouseup', onDocumentMouseUp);
    document.addEventListener('touchstart', onDocumentTouchStart);
    document.addEventListener('touchmove', onDocumentTouchMove);
    document.addEventListener('touchend', onDocumentTouchEnd);    
  }, [])

  const onDocumentTouchMove = (e:any) => {
    console.log('onDocumentTouchMove!');
    // console.log(e);
    console.log(e.touches.length);
    setDebugMessage(`move: ${e.touches.length}`);
    // attemptKeyUnderTouchPosition(e);
  }

  const onDocumentTouchStart = (e:any) => {
    console.log('onDocumentTouchStart');
    setDebugMessage(`start: ${e.touches.length}`);
    // attemptKeyUnderTouchPosition(e, true);
  }

  const onDocumentTouchEnd = (e:any) => {
    console.log('onDocumentTouchEnd');
    setDebugMessage(`end: ${e.touches.length}`);
    // setAllTouchedKeys([]);
    // e.preventDefault(); // prevent mouse click from triggering even on a touch device
  }

  
  return (
    <StyledContainer>
      <StyledDebugThing>
        {`DEBUG: ${debugMessage}`}
      </StyledDebugThing>
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
