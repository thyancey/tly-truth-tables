import styled from 'styled-components';
import { getColor } from '../../themes';
import { useAppDispatch } from '../../app/hooks';
import { resetMatrix } from './slice';
import { useEffect } from 'react';
import { Board } from './board';

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

export function Main() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(resetMatrix());
  }, [dispatch]);

  return (
    <StyledContainer>
      <StyledModal >
        <Board testo={'hello!!!!'}/>
      </StyledModal>
    </StyledContainer>
  );
/*
  return (
    <StyledContainer>
      <StyledModal >        
        <StyledGrid>
          <StyledRowLabels>
            {gridLabels[0].map((row, idx) => (
              <StyledRowLabel key={`lr${idx}`}>
                {row.values.map((rv, rvIdx) => (
                  <span key={`lrv${rvIdx}`}>{rv}</span>
                ))}
              </StyledRowLabel>
            ))}
          </StyledRowLabels>
          <StyledColLabels>
            {gridLabels[1].map((col, idx) => (
              <StyledColLabel key={`lc${idx}`}>
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
  */
}
