import styled from 'styled-components';
import { getColor } from '../../themes';
import { getGameReady } from '../../app/board-slice';
import { Board } from '../board';
import { Modal } from '../modal';
import { useSelector } from 'react-redux';
import { RuleMaster } from './rulemaster';
import { InfoPanel } from '../info-panel';
import { useCallback, useEffect, useState } from 'react';
import { Coordinate } from '../../types';

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

const StyledDebugThing = styled.div`
  position: absolute;
  top:2rem;
  left:1rem;

  font-size: 3rem;
  text-align:left;
  color:white;
  pointer-events: none;
`;

let startAvgCoords: Coordinate = [0,0];
let startPinchDistance: number = 0;

export function Main() {
  const gameReady = useSelector(getGameReady);
  const [ debugMessage, setDebugMessage ] = useState('');
  const [ debugDiffMessage, setDebugDiffMessage ] = useState('');
  
  useEffect(() => {
    // document.addEventListener('mouseup', onDocumentMouseUp);
    document.addEventListener('touchstart', onDocumentTouchStart);
    document.addEventListener('touchmove', onDocumentTouchMove);
    document.addEventListener('touchend', onDocumentTouchEnd);    
  }, [])

  const onDocumentTouchMove = (e:TouchEvent) => {

    if(e.touches.length > 1){
      // pinchy checks
      const pinchDistance = Math.sqrt(Math.pow((e.touches[1].clientX - e.touches[0].clientX), 2) + Math.pow((e.touches[1].clientY - e.touches[0].clientY), 2));

      const avgCoords: Coordinate = [
        ((e.touches[0].clientX + e.touches[1].clientX) / 2) - startAvgCoords[0],
        ((e.touches[0].clientY + e.touches[1].clientY) / 2) - startAvgCoords[1]
      ];

      setDebugDiffMessage(`delta: ${startPinchDistance - pinchDistance}, dX:${avgCoords[0]}, dY:${avgCoords[1]}`);
    }
  }

  const onDocumentTouchStart = (e:TouchEvent) => {
    // console.log('onDocumentTouchStart');
    setDebugMessage(`start: ${e.touches.length}`);
    if(e.touches.length > 1){
      // pinchy checks
      startAvgCoords = [
        (e.touches[0].clientX + e.touches[1].clientX) / 2,
        (e.touches[0].clientY + e.touches[1].clientY) / 2
      ];
      startPinchDistance = Math.sqrt(Math.pow((e.touches[1].clientX - e.touches[0].clientX), 2) + Math.pow((e.touches[1].clientY - e.touches[0].clientY), 2));
      setDebugDiffMessage(`s: ${startPinchDistance}`);
    }
  }

  const onDocumentTouchEnd = (e:TouchEvent) => {
    // console.log('onDocumentTouchEnd');
    setDebugMessage(`end: ${e.touches.length}`);
    // setAllTouchedKeys([]);
    // e.preventDefault(); // prevent mouse click from triggering even on a touch device
  }

  
  return (
    <StyledContainer>
      <StyledDebugThing>
        <p>{`DEBUG: ${debugMessage}`}</p>
        <p>{`DIFF: ${debugDiffMessage}`}</p>
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
