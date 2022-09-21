import styled from 'styled-components';
import { useAppSelector } from '../../app/hooks';
import { selectAnswerStuff, selectSolution } from './slice';

const StyledContainer = styled.div`
  height: 20rem;
  margin-left:2rem;
`
export function Status() {
  const answerStuff = useAppSelector(selectAnswerStuff);
  const renderedSolution = useAppSelector(selectSolution);

  // console.log('solution', solution)
  // console.log('green cells:', answerStuff)
  // console.log('renderedSolution', renderedSolution)

  return (
    <StyledContainer>
      <h3>{'Solution:'}</h3>
      <ul>
        {renderedSolution?.map((rS, idx) => (
          <li key={idx}>{rS.join(' | ')}</li>
        ))}
      </ul>
      
      <h3>{'Green cells:'}</h3>
      <ul>
        {answerStuff?.map((ans, idx) => (
          <li key={idx}>{`[${ans[0].id}:${ans[0].value}, ${ans[1].id}:${ans[1].value}]`}</li>
        ))}
      </ul>
    </StyledContainer>
  );
}
