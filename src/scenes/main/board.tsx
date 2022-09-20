import { useCallback } from 'react';
import styled, { css } from 'styled-components';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { getColor } from '../../themes';
import { CellObj, CellStatus } from '../../types';
import { rotateCell, selectGridBox, selectGridLabels } from './slice';

const StyledBoard = styled.div`
  position:absolute;
  transform: matrix(2.0,.9,-1.75,1.5,230,60) scale(.4);

  display:grid;
  grid-template-columns: 15rem 13rem 13rem 13rem; 
  grid-template-rows: 15rem 13rem 13rem 13rem; 
  column-gap: 2rem;
  row-gap: 2rem;

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

const StyledLeftLabel = styled.div`
  text-align:right;
  height:33%;
  padding-top:1rem;
  padding-right:1rem;
  position:relative;
  >span{
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
const StyledTopLabel = styled.div`
  display:inline-block;
  width: 33%;
  height: 100%;
  position:relative;

  span{
    display:block;
    position: absolute;
    left: 2rem;
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
const StyledCellGroup = styled.div`
  display:grid;
  grid-template-columns: 30% 30% 30%;
  grid-template-rows: 30% 30% 30%;
  column-gap: .6rem;
  row-gap: .6rem;
`
type CellProps = {
  status: CellStatus
}
const StyledCell = styled.div<CellProps>`
  border: 3px solid ${getColor('white')};
  cursor: pointer;
  transition: background-color .1s, box-shadow .2s;
  &:hover{
    box-shadow: 0 0 .2rem .2rem white;
  }
  ${p => p.status === 1 && css`background-color:${getColor('green')}`}
  ${p => p.status === 2 && css`background-color:${getColor('red')}`}
`
const BlankCellGroup = styled(StyledCellGroup)`
  background-color: ${getColor('white')};
  opacity: .2;
`

type BoardProps = {
  testo: string
}
export function Board({ testo }:BoardProps) {
  const dispatch = useAppDispatch();
  const grid = useAppSelector(selectGridBox);
  const gridLabels = useAppSelector(selectGridLabels);

  const onClickCell = useCallback((cellIdx) => {
    dispatch(rotateCell(cellIdx));
  }, [ dispatch ]);

  const renderCellGroup = (cellGroup: CellObj[], cgKey: string) => {
    // [0] check here cause this is all janky and the individual cells are undefined on load
    if(cellGroup.length > 0 && cellGroup[0]){
      return (
        <StyledCellGroup key={cgKey}>
          {cellGroup.map(cell => (
            <StyledCell 
              key={`cell${cell?.idx}`}
              status={cell.status}
              onClick={() => onClickCell(cell.idx)}
            />
          ))}
        </StyledCellGroup>
      )
    }

    return (
      <BlankCellGroup key={cgKey}/>
    )
  }

  console.log('re-rendering the whole board...');

  return (
    <StyledBoard>
      <StyledCells>
        {grid.map(gridRow => (
          gridRow.map((cellGroup, cgIdx) => renderCellGroup(cellGroup, `cg${cgIdx}`)
        )))}
      </StyledCells>
      <StyledTopLabels>
        {gridLabels[1].map((gl, glIdx) => (
          <div key={`tl${glIdx}`}>
            {gl.values.map((v,vIdx) => (
              <StyledTopLabel key={`tv${vIdx}`}>
                <span>{`${gl.id} - ${v}`}</span>
              </StyledTopLabel>
            ))}
          </div>
        ))}
      </StyledTopLabels>
      <StyledLeftLabels>
        {gridLabels[0].map((gl, glIdx) => (
          <div key={`ll${glIdx}`}>
            {gl.values.map((v,vIdx) => (
              <StyledLeftLabel key={`lv${vIdx}`}>
                <span>{`${gl.id} - ${v}`}</span>
              </StyledLeftLabel>
            ))}
          </div>
        ))}
      </StyledLeftLabels>
    </StyledBoard>
  );
}
