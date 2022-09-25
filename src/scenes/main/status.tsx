import styled from 'styled-components';
import { useAppSelector } from '../../app/hooks';
import { getColor } from '../../themes';
import { checkIfSolved, selectSolution } from './slice';

const StyledContainer = styled.div`
  margin-left:2rem;
`


const StyledStatus = styled.div`
  position:absolute;
  right:0;
  top:0;
  padding: .5rem 1rem;
  border: .5rem solid white;
  border-radius: 0 0 0 1.5rem;

  font-weight:bold;
  font-size:3rem;
`;

const StyledSolvedStatus = styled(StyledStatus)`
  background-color: ${getColor('green')};  
`;
const StyledUnSolvedStatus = styled(StyledStatus)`
  background-color: ${getColor('red')};  
`;

export function Status() {
  const renderedSolution = useAppSelector(selectSolution);
  const solved = useAppSelector(checkIfSolved);

  console.log('solved', solved)

  return (
    <StyledContainer>
      <h3>{'Solution:'}</h3>
      <ul>
        {renderedSolution?.map((rS, idx) => (
          <li key={idx}>{rS.join(' | ')}</li>
        ))}
      </ul>
      
      { solved ? (
        <StyledSolvedStatus>{'SOLVED'}</StyledSolvedStatus>
      ): (
        <StyledUnSolvedStatus>{'UNSOLVED'}</StyledUnSolvedStatus>
      ) }
    </StyledContainer>
  );
}
