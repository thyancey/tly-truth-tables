import { useCallback, useMemo, useState } from 'react';
import styled, { css } from 'styled-components';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { getColor } from '../../themes';
import { CellObj, CellStatus, RawCell } from '../../types';
import { rotateCell, selectGridBox, selectGridLabels, selectGridInfo } from '../../app/board-slice';
import { BoardControls } from '../board/board-controls';
import { getPosition, getZoom } from '../../app/ui-slice';
import { PositionControls } from './position-controls';


const StyledBoardContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
`

const StyledBoard = styled.div`
  position:absolute;
  left:50%;
  top:40%;

  display:grid;
  grid-template-columns: 15rem 13rem 13rem 13rem; 
  grid-template-rows: 15rem 13rem 13rem 13rem; 
  column-gap: 2rem;
  row-gap: 2rem;
  color: ${getColor('brown_light')};

  /* transform-origin:left; */

  >div{
    display:grid;
    column-gap: 2rem;
    row-gap: 2rem;
  }
`

const StyledLeftLabels = styled.div`
  grid-column: 15rem;
  grid-row: 2 / span 3;
  
  grid-template-columns: 15rem; 
  grid-template-rows: 13rem 13rem 13rem;
`

type StyledLabelProps = {
  gridSize: number
}
const StyledLeftLabel = styled.div<StyledLabelProps>`
  text-align:right;
  ${p => p.gridSize === 4 ? css`
    padding-top:0rem;
    height: 25%;
  `: css`
    padding-top:1rem;
    height: 33%;
  `}

  padding-right:1rem;
  position:relative;
  >span{
    font-size: 3.5rem;
    font-weight: 600;

    position:absolute;
    right:0;
    white-space:nowrap;
  }
`
const StyledTopLabels = styled.div`
  grid-column: 2 / span 3;
  grid-row: 15rem;
  
  grid-template-columns: 13rem 13rem 13rem;
  grid-template-rows: 15rem;
`
const StyledTopLabel = styled.div<StyledLabelProps>`
  display:inline-block;
  ${p => p.gridSize === 4 ? css`
    width: 25%;
  `: css`
    width: 33%;
  `}
  height: 100%;
  position:relative;

  span{
    display:block;
    position: absolute;

    font-size: 3.5rem;
    font-weight: 600;

    ${p => p.gridSize === 4 ? css`
      left: 1rem;
    `: css`
      left: 2rem;
    `}
    bottom: -1.5rem;
    display: block;
    white-space: nowrap;
    transform-origin: left;
    transform: rotate(-90deg);
  }
`
const StyledCells = styled.div`
  grid-column: 2 / span 3;
  grid-row: 2 / span 3;

  grid-template-columns: 13rem 13rem 13rem;
  grid-template-rows: 13rem 13rem 13rem;
`
const StyledRawCellGroup = styled.div`
  display:grid;
  column-gap: .6rem;
  row-gap: .6rem;
`
type StyledCellGroupProps = {
  gridSize: number,
  cellRatio: string
}
const StyledCellGroup = styled(StyledRawCellGroup)<StyledCellGroupProps>`
  display:grid;
  grid-template-columns: repeat(${p => p.gridSize}, ${p => p.cellRatio});
  grid-template-rows: repeat(${p => p.gridSize}, ${p => p.cellRatio});
  column-gap: .6rem;
  row-gap: .6rem;

  /* 
    grid-column: 1 i[ix]
    grid-row: 2 i
  */
`
type StyledCellProps = {
  status: CellStatus,
  isSolution?: boolean
}
const StyledCell = styled.div<StyledCellProps>`
  border-radius: 1rem;
  border: .4rem solid ${getColor('brown')};
  cursor: pointer;
  transition: background-color .1s, border-color .2s, box-shadow .15s, transform .15s;

  ${p => p.status === 0 && css`
    background-color:${getColor('brown')};
    border-color: ${getColor('white')};
    box-shadow: 0.4rem 0.4rem 0 0.1rem ${getColor('white')};
  `};
  ${p => p.status === 1 && css`
    background-color:${getColor('green')};
    border-color: ${getColor('green_light')};
    box-shadow: 0.4rem 0.4rem 0 0.1rem ${getColor('green_light')};
  `};
  ${p => p.status === 2 && css`
    background-color:${getColor('red_light')};
    border-color: ${getColor('pink')};
    box-shadow: 0.4rem 0.4rem 0 0.1rem ${getColor('pink')};
  `};
  &:hover{
    ${p => p.status === 0 && css`
      border-color: ${getColor('pink')};
    `};
    ${p => p.status === 1 && css`
      border-color: ${getColor('white')};
    `};
    ${p => p.status === 2 && css`
      border-color: ${getColor('green_light')};
    `};
  }
  
  &:active{
    transform: translate(.35rem, .35rem);

    ${p => p.status === 0 && css`
      background-color: ${getColor('red_light')};
      border-color: ${getColor('pink')};
      box-shadow: 0.1rem 0.1rem 0 0.3rem ${getColor('pink')};
    `};
    ${p => p.status === 1 && css`
      background-color: ${getColor('brown')};
      border-color: ${getColor('white')};
      box-shadow: 0.1rem 0.1rem 0 0.3rem ${getColor('white')};
    `};
    ${p => p.status === 2 && css`
      background-color: ${getColor('green')};
      border-color: ${getColor('green_light')};
      box-shadow: 0.1rem 0.1rem 0 0.3rem ${getColor('green_light')};
    `};
  }
`
const BlankCellGroup = styled(StyledRawCellGroup)`
  background-color: ${getColor('white')};
  opacity: .2;
`

const StyledControls = styled.div`
  grid-column: 1 / span 1;
  grid-row: 1 / span 1;
  position:absolute;
  bottom:0;
  right:0;
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

const evCache: any[] = [];
let prevDiff: number = -1;

export function Board() {
  const dispatch = useAppDispatch();
  const grid = useAppSelector(selectGridBox);
  const gridLabels = useAppSelector(selectGridLabels);
  const gridInfo = useAppSelector(selectGridInfo);
  const zoom = useAppSelector(getZoom);
  const position = useAppSelector(getPosition);
  const [ debugMessage, setDebugMessage ] = useState('');

  const onClickCell = useCallback((cellIdx) => {
    dispatch(rotateCell(cellIdx));
  }, [ dispatch ]);

  const cellRatio = useMemo(() => {
    if(gridInfo.numValues === 3) {
      return '30%';
    } else if(gridInfo.numValues === 4) {
      return '20%';
    }
    return `${Math.round(100 / gridInfo.numValues)}%`;
  }, [ gridInfo.numValues ])

  const onPointerCancel = useCallback((ev) => {
    // Remove this pointer from the cache
    const foundIdx = evCache.indexOf(ev);
    if(foundIdx > -1) evCache.splice(foundIdx, 1);
  
    // If the number of pointers down is less than two then reset diff tracker
    if (evCache.length < 2) {
      prevDiff = -1;
      setDebugMessage('CANCELLED');
    }
  }, [setDebugMessage]);

  const onPointerDown = useCallback((ev) => {
    // The pointerdown event signals the start of a touch interaction.
    // This event is cached to support 2-finger gestures
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

    // Find this event in the cache and update its record with this event
    const index = evCache.findIndex((cachedEv) => cachedEv.pointerId === ev.pointerId);
    evCache[index] = ev;

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

  const renderCellGroup = (cellGroup: CellObj[], cgKey: string, gridSize: number, cellRatio: string, boardCell: RawCell) => {
    // [0] check here cause this is all janky and the individual cells are undefined on load
    if(cellGroup.length > 0 && cellGroup[0]){
      return (
        <StyledCellGroup 
          key={cgKey}
          gridSize={gridSize}
          cellRatio={cellRatio}
          style={{gridRow: `${boardCell[0] + 1} / span 1`, gridColumn: `${boardCell[1] + 1} / span 1`}}
        >
          {cellGroup.map(cell => (
            <StyledCell 
              key={`cell${cell?.idx}`}
              status={cell.status}
              isSolution={cell.isSolution}
              onClick={() => onClickCell(cell.idx)}
            />
          ))}
        </StyledCellGroup>
      )
    }

    return (
      <BlankCellGroup 
        key={cgKey} 
        style={{gridRow: `${boardCell[0] + 1} / span 1`, gridColumn: `${boardCell[1] + 1} / span 1`}}
      />
    )
  }

  const tStyles = {
    transform: `translate(${position[0]}%, ${position[1]}%) matrix(2.5,1.25,-2.5,1.25,-300,-0) scale(${zoom})`
  };

  return (
    <StyledBoardContainer 
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerCancel}
      onPointerCancel={onPointerCancel}
      onPointerOut={onPointerCancel}
      onPointerLeave={onPointerCancel}
      >
      <PositionControls />
      <StyledDebugThing>
        {`DEBUG: ${debugMessage}`}
      </StyledDebugThing>
      <StyledBoard style={tStyles}>
        <StyledControls>
          <BoardControls />
        </StyledControls>
        <StyledCells>
          {grid.map((gridRow, grIdx) => (
            gridRow.map((cellGroup, cgIdx) => renderCellGroup(cellGroup, `cg${cgIdx}`, gridInfo.numValues, cellRatio, [grIdx, cgIdx])
          )))}
        </StyledCells>
        <StyledTopLabels>
          {gridLabels[1].map((gl, glIdx) => (
            <div key={`tl${glIdx}`}>
              {gl.map((v,vIdx) => (
                <StyledTopLabel key={`tv${vIdx}`} gridSize={gridInfo.numValues}>
                  <span>{v.toUpperCase()}</span>
                </StyledTopLabel>
              ))}
            </div>
          ))}
        </StyledTopLabels>
        <StyledLeftLabels>
          {gridLabels[0].map((gl, glIdx) => (
            <div key={`ll${glIdx}`}>
              {gl.map((v,vIdx) => (
                <StyledLeftLabel key={`lv${vIdx}`} gridSize={gridInfo.numValues}>
                  <span>{v.toUpperCase()}</span>
                </StyledLeftLabel>
              ))}
            </div>
          ))}
        </StyledLeftLabels>

      </StyledBoard>
    </StyledBoardContainer>
  );
}
