import styled from 'styled-components';
import { Button, StyledButton } from '../../../components/button';
import { getColor } from '../../../themes';

// basic positioning all modals should have
export const StyledModalAbstract = styled.div`
  position:absolute;
  width:100%;
  height:100%;
  
  left:50%;
  top:50%;
  transform: translate(-50%, -50%);
  
  display:grid;
  grid-template-columns: 5rem auto 5rem; 
  grid-template-rows: min-content auto min-content;

  padding:1rem;
`

export const StyledModalContainer = styled(StyledModalAbstract)`
  max-width:80%;
  max-height:80%;
  border-radius:2rem;

  @media (max-width: 600px) {
    max-width:90%;
    max-height:95%;
  }

  background-color: ${getColor('brown_light')};
  color: ${getColor('brown_dark')};
  border: 0.75rem solid ${getColor('brown_dark')};
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

  >${StyledButton}{
    margin: 2rem 0rem;
  }
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
