import styled from 'styled-components';
import { getColor } from '../../themes';
import { useAppDispatch } from '../../app/hooks';
import { resetMatrix } from './slice';
import { useEffect } from 'react';
import { Board } from './board';
import { Status } from './status';
import { Footer } from './footer';
import { Hint } from './hint';

const StyledContainer = styled.div`
  position:absolute;
  left:0;
  top:0;
  bottom:0;
  right:0;
  background-color: ${getColor('black')};
  color: ${getColor('white')};
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

const StyledFooter = styled.div`
  width:100%;
  flex: 0 0 10rem;
  background-color: white;
`;

export function Main() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(resetMatrix());
  }, [dispatch]);

  return (
    <StyledContainer>
      <Hint />
      <StyledHeader>
        <Status />
      </StyledHeader>
      <StyledBody>
        <Board />
      </StyledBody>
      <Footer />
    </StyledContainer>
  );
}