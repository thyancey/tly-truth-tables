import styled from 'styled-components';
import { Button } from '../../../components/button';

export const StyledModalContainer = styled.div`
  display:grid;
  grid-template-columns: 5rem auto 5rem; 
  grid-template-rows: min-content auto min-content;
  height: 100%;
  width: 100%;

  padding:0rem;
`;

export const StyledModalHeader = styled.div`
  grid-column: 1 / span 3;
  grid-row: 1 / span 1;
  text-align:center;
`;

export const StyledModalBody = styled.ul`
  grid-column: 1 / span 3;
  grid-row: 2 / span 1;

  width:100%;
  height:100%;
  padding: .5rem 3rem;
  overflow-y:auto;
`;

export const StyledModalFooter = styled.div`
  grid-column: 1 / span 3;
  grid-row: 3 / span 1;

  padding: 1rem;
`;

export function BasicModal() {
  return (
    <StyledModalContainer>
      <StyledModalHeader>
        <h1>{'BASIC'}</h1>
      </StyledModalHeader>
      
      <StyledModalBody>
        
      </StyledModalBody>
      <StyledModalFooter>
        <Button text={'OK'}/>
      </StyledModalFooter>
    </StyledModalContainer>
  );
}
