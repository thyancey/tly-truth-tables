import styled from 'styled-components';
import { useAppSelector } from '../../app/hooks';
import { getColor } from '../../themes';
import { checkIfSolved, selectRenderedAnswers, selectSolution } from './slice';

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
  // const answerStuff = useAppSelector(selectRenderedAnswers);
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
      
      {/* <h3>{'Green cells:'}</h3>
      <ul>
        {answerStuff?.map((ans, idx) => (
          <li key={idx}>{`[${ans[0].id}:${ans[0].value}, ${ans[1].id}:${ans[1].value}]`}</li>
        ))}
      </ul> */}
      { solved ? (
        <StyledSolvedStatus>{'SOLVED'}</StyledSolvedStatus>
      ): (
        <StyledUnSolvedStatus>{'UNSOLVED'}</StyledUnSolvedStatus>
      ) }
    </StyledContainer>
  );
}
