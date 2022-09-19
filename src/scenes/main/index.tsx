import styled, { css } from 'styled-components';
import { getColor } from '../../themes';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { selectCellMatrix, resetMatrix, selectGridBox, rotateCell, selectGridLabels } from './slice';
import { useCallback, useEffect } from 'react';
import { CellStatus } from '../../types';

const StyledContainer = styled.div`
  position:absolute;
  left:0;
  top:0;
  bottom:0;
  right:0;
  background-color: ${getColor('black')};
  color: ${getColor('white')};
  z-index:-1;
  padding-top:10rem;
  z-index:1;
`
const StyledModal = styled.div`
  width:80%;
  height:80%;
  position:absolute;
  left:10%;
  top:10%;
  background-color: ${getColor('purple')};

  border-radius: 1rem;
`

const StyledGrid = styled.div`
  margin:0;
  padding:0;
`

const StyledGridRow = styled.div`
  margin:0;
  padding:0;
`
const StyledGridBox = styled.div`
  display:inline-block;
  border:1rem solid green;
  margin:1rem;

  max-width: 25rem;
`

const StyledGridInner = styled.div`
  padding: 10rem;  
`

const StyledRowLabels = styled.div`
  position:absolute;
  top: 10rem;
  height:100%;
  width:50rem;
`
const StyledRowLabel = styled.div`
  margin-top: 1rem;
  height:33%;
  >span{
    display:block;
    padding-top:3rem;
    height:33%;
  }
`

const StyledColLabels = styled.div`
  position:absolute;
  left: 10rem;
`
const StyledColLabel = styled.div`
  width:33%;
  display:inline-block;
  >span{
    display:block;
    transform: rotate(-90deg);
  }
`


type StyledCellProps = {
  status: CellStatus;
}
const StyledGridCell = styled.div<StyledCellProps>`
  display:inline-block;
  width:5rem;
  height:5rem;
  border:1rem solid white;
  margin:1rem;


  ${p => p.status === 1 && css`background-color: green;`}
  ${p => p.status === 2 && css`background-color: red;`}
`

export function Main() {
  const dispatch = useAppDispatch();
  const grid = useAppSelector(selectGridBox);
  const gridLabels = useAppSelector(selectGridLabels);
  // const cellMatrix = useAppSelector(selectCellMatrix);

  useEffect(() => {
    dispatch(resetMatrix());
  }, []);

  const onClickCell = useCallback((cellIdx) => {
    dispatch(rotateCell(cellIdx));
  }, [ rotateCell ]);

  console.log('grid', grid);
  console.log('gridLabels', gridLabels);

  return (
    <StyledContainer>
      <StyledModal >
        <StyledGrid>
          <StyledRowLabels>
            {gridLabels[0].map((row, idx) => (
              <StyledRowLabel key={`lr${idx}`}>
                {/* <span>{row.id}</span> */}
                {row.values.map((rv, rvIdx) => (
                  <span key={`lrv${rvIdx}`}>{rv}</span>
                ))}
              </StyledRowLabel>
            ))}
          </StyledRowLabels>
          <StyledColLabels>
            {gridLabels[1].map((col, idx) => (
              <StyledColLabel key={`lc${idx}`}>
                {/* <span>{col.id}</span> */}
                {col.values.map((cv, cvIdx) => (
                  <span key={`lcv${cvIdx}`}>{cv}</span>
                ))}
              </StyledColLabel>
            ))}
          </StyledColLabels>
          <StyledGridInner>
            {grid?.map((row, rIdx) => (
              <StyledGridRow key={`r${rIdx}`}>
                {row.map((box, cIdx) => (
                  <StyledGridBox key={`rc${rIdx}${cIdx}`}>
                    {box.map((cell, cellIdx) => (
                      <StyledGridCell 
                        key={cellIdx}
                        status={cell?.status}
                        onClick={() => onClickCell(cell.idx)} />
                    ))}
                  </StyledGridBox>
                ))}
              </StyledGridRow>
            ))}
          </StyledGridInner>
        </StyledGrid>
      </StyledModal>
    </StyledContainer>
  );
}
