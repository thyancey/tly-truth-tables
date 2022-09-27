import { useCallback, useMemo } from 'react';
import styled, { css } from 'styled-components';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { getColor } from '../../themes';
import { CellObj, CellStatus } from '../../types';
import { rotateCell, selectGridBox, selectGridLabels, selectGridInfo } from './slice';

const StyledBoard = styled.div`
  position:absolute;
  /* more perspectivey */
  /* transform: matrix(2.0,.9,-1.75,1.5,-300,-50) scale(.4) translate(-50%, -50%); */
  transform: matrix(2.5,1.25,-2.5,1.25,-300,-0) scale(.4) translate(-50%, -50%);
  left: 50%;
  top:50%;

  display:grid;
  grid-template-columns: 15rem 13rem 13rem 13rem; 
  grid-template-rows: 15rem 13rem 13rem 13rem; 
  column-gap: 2rem;
  row-gap: 2rem;
  color: ${getColor('brown')};

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
    height: 25%;
  `: css`
    height: 33%;
  `}
  ${p => p.gridSize === 4 ? css`
    padding-top:0rem;
  `: css`
    padding-top:1rem;
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
    background-color:${getColor('green_dark')};
    border-color: ${getColor('green')};
    box-shadow: 0.4rem 0.4rem 0 0.1rem ${getColor('green')};
  `};
  ${p => p.status === 2 && css`
    background-color:${getColor('pink_dark')};
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
      border-color: ${getColor('green')};
    `};
  }
  
  &:active{
    transform: translate(.35rem, .35rem);

    ${p => p.status === 0 && css`
      background-color: ${getColor('pink_dark')};
      border-color: ${getColor('pink')};
      box-shadow: 0.1rem 0.1rem 0 0.1rem ${getColor('pink')};
    `};
    ${p => p.status === 1 && css`
      background-color: ${getColor('brown')};
      border-color: ${getColor('white')};
      box-shadow: 0.1rem 0.1rem 0 0.1rem ${getColor('white')};
    `};
    ${p => p.status === 2 && css`
      background-color: ${getColor('green_dark')};
      border-color: ${getColor('green')};
      box-shadow: 0.1rem 0.1rem 0 0.1rem ${getColor('green')};
    `};
  }
`
const BlankCellGroup = styled(StyledRawCellGroup)`
  background-color: ${getColor('white')};
  opacity: .2;
`

export function Board() {
  const dispatch = useAppDispatch();
  const grid = useAppSelector(selectGridBox);
  const gridLabels = useAppSelector(selectGridLabels);
  const gridInfo = useAppSelector(selectGridInfo);

  const onClickCell = useCallback((cellIdx) => {
    dispatch(rotateCell(cellIdx));
  }, [ dispatch ]);

  const cellRatio = useMemo(() => {
    if(gridInfo.gridSize === 3) {
      return '30%';
    } else if(gridInfo.gridSize === 4) {
      return '20%';
    }
    return `${Math.round(100 / gridInfo.gridSize)}%`;
  }, [ gridInfo.gridSize ])


  const renderCellGroup = (cellGroup: CellObj[], cgKey: string, gridSize: number, cellRatio: string) => {
    // [0] check here cause this is all janky and the individual cells are undefined on load
    if(cellGroup.length > 0 && cellGroup[0]){
      return (
        <StyledCellGroup key={cgKey} gridSize={gridSize} cellRatio={cellRatio}>
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
      <BlankCellGroup key={cgKey} />
    )
  }

  return (
    <StyledBoard>
      <StyledCells>
        {grid.map(gridRow => (
          gridRow.map((cellGroup, cgIdx) => renderCellGroup(cellGroup, `cg${cgIdx}`, gridInfo.gridSize, cellRatio)
        )))}
      </StyledCells>
      <StyledTopLabels>
        {gridLabels[1].map((gl, glIdx) => (
          <div key={`tl${glIdx}`}>
            {gl.values.map((v,vIdx) => (
              <StyledTopLabel key={`tv${vIdx}`} gridSize={gridInfo.gridSize}>
                <span>{v.toUpperCase()}</span>
                {/* <span>{`${v} (${gl.id})`}</span> */}
              </StyledTopLabel>
            ))}
          </div>
        ))}
      </StyledTopLabels>
      <StyledLeftLabels>
        {gridLabels[0].map((gl, glIdx) => (
          <div key={`ll${glIdx}`}>
            {gl.values.map((v,vIdx) => (
              <StyledLeftLabel key={`lv${vIdx}`} gridSize={gridInfo.gridSize}>
                <span>{v.toUpperCase()}</span>
                {/* <span>{`${v} (${gl.id})`}</span> */}
              </StyledLeftLabel>
            ))}
          </div>
        ))}
      </StyledLeftLabels>
    </StyledBoard>
  );
}
