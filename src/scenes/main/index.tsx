import styled from 'styled-components';
import { getColor } from '../../themes';
import { useAppDispatch } from '../../app/hooks';
import { generateSolution, resetMatrix } from './slice';
import { useEffect } from 'react';
import { Board } from './board';
import { Status } from './status';

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
    dispatch(generateSolution());
  }, [dispatch]);

  return (
    <StyledContainer>
      <StyledModal >
        <Status />
        <Board />
      </StyledModal>
    </StyledContainer>
  );
}
