import styled from 'styled-components';
import { getColor } from '../../themes';
import { getGameReady } from '../../app/board-slice';
import { Board } from '../board';
import { Modal } from '../modal';
import { useSelector } from 'react-redux';
import { RuleMaster } from './rulemaster';
import { InfoPanel } from '../info-panel';
import { useCallback, useState } from 'react';

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
  const onPointerCancel = useCallback((ev, type: string) => {
    // Remove this pointer from the cache
    const foundIdx = evCache.findIndex(evC => ev.pointerId === evC.pointerId);
    if(foundIdx > -1) {
      console.log('cancelling ', evCache[foundIdx].pointerId, foundIdx, type);
      console.log('evCache', evCache);
      evCache.splice(foundIdx, 1);
      console.log('evCache', evCache);
    }
  
    // If the number of pointers down is less than two then reset diff tracker
    if (evCache.length < 2) {
      prevDiff = -1;
      debugMessage !== 'CANCELLED' && setDebugMessage('CANCELLED');
    }
  }, [debugMessage, setDebugMessage, ]);
  
  const onPointerDown = useCallback((ev) => {
    // The pointerdown event signals the start of a touch interaction.
    // This event is cached to support 2-finger gestures
    console.log('pushing', ev.pointerId);
    evCache.push(ev);
    // log("pointerDown", ev);
  }, []);
  
  const onPointerMove = useCallback((ev) => {
    // example from https://developer.mozilla.org/en-US/docs/Web/API/Pointer_events/Pinch_zoom_gestures
    // This function implements a 2-pointer horizontal pinch/zoom gesture.
    //
    // If the distance between the two pointers has increased (zoom in),
    // the target element's background is changed to "pink" and if the
    // distance is decreasing (zoom out), the color is changed to "lightblue".
    //
    // This function sets the target element's border to "dashed" to visually
    // indicate the pointer's target received a move event.
    // console.log('onPointerMove', ev.pointerId);
    // console.log(evCache);
  
    // Find this event in the cache and update its record with this event
    const index = evCache.findIndex((cachedEv) => cachedEv.pointerId === ev.pointerId);
    if(index > -1){
      evCache[index] = ev;
    }
  
    // If two pointers are down, check for pinch gestures
    if (evCache.length === 2) {
      // Calculate the distance between the two pointers
      const curDiff = Math.abs(evCache[0].clientX - evCache[1].clientX);
  
      if (prevDiff > 0) {
        if (curDiff > prevDiff) {
          // The distance between the two pointers has increased
          console.log('Pinch moving OUT -> Zoom in', ev);
          setDebugMessage(`OUT (${curDiff})`);
        }
        if (curDiff < prevDiff) {
          // The distance between the two pointers has decreased
          console.log('Pinch moving IN -> Zoom out',ev);
          setDebugMessage(`IN (${curDiff})`);
        }
      }
  
      // Cache the distance for the next move event
      prevDiff = curDiff;
    }
  }, [ setDebugMessage ]);
  return (
    <StyledContainer 
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={e => onPointerCancel(e, 'up')}
      onPointerCancel={e => onPointerCancel(e, 'cancel')}
      onPointerOut={e => onPointerCancel(e, 'out')}
      onPointerLeave={e => onPointerCancel(e, 'leave')}
    >
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
