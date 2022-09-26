import styled from 'styled-components';
import { useAppSelector } from '../../app/hooks';
import { getColor } from '../../themes';
import { checkIfSolved, selectSolution } from './slice';

const StyledContainer = styled.div`
  margin-left:2rem;
`;

const StyledDebug = styled.div`
  font-size:2rem;
  opacity:.25;

  li{
    list-style:none;
  }
`

const StyledStatusContainer = styled.div`
  position:absolute;
  right:0;
  top:0;
  color: ${getColor('brown_dark')};
  text-align:center;
`;

const StyledStatus = styled.div`
  border: .3rem solid ${getColor('brown_dark')};
  box-shadow: 0.0rem 0.4rem 0.1rem 0.1rem ${getColor('brown')};
  border-radius: 1.5rem;
  margin: .75rem;

  padding: .5rem 1rem;

  font-weight:500;
  font-size:2rem;

  cursor: pointer;
  
  &:active{
    color: ${getColor('yellow')};
    transform: translateY(.5rem);
    box-shadow: 0.0rem 0.0rem 0.0rem 0.0rem ${getColor('brown')};
  }
`;

const StyledResetButton = styled(StyledStatus)`
  background-color: ${getColor('pink')};  
  color: ${getColor('brown_dark')};
  border-color: ${getColor('brown_dark')};
  box-shadow: 0.0rem 0.4rem 0.1rem 0.1rem ${getColor('brown')};
  
  &:hover{
    color: ${getColor('yellow')};
  }
`

const StyledSolvedStatus = styled(StyledStatus)`
  background-color: ${getColor('green')};  
  
  &:hover{
    color: ${getColor('yellow')};
  }
`;
const StyledUnSolvedStatus = styled(StyledStatus)`
  background-color: ${getColor('green')};  
  color: ${getColor('brown_dark')};
  border-color: ${getColor('brown_dark')};
  box-shadow: 0.0rem 0.4rem 0.1rem 0.1rem ${getColor('brown')};
  
  &:hover{
    color: ${getColor('yellow')};
  }
`;

export function Status() {
  const renderedSolution = useAppSelector(selectSolution);
  const solved = useAppSelector(checkIfSolved);

  console.log('solved', solved)

  return (
    <StyledContainer>
      <StyledDebug>
        <p>{'DEBUG SOLUTION'}</p>
        <ul>
          {renderedSolution?.map((rS, idx) => (
            <li key={idx}>{`[ ${rS.join(' | ')} ]`}</li>
          ))}
        </ul>
      </StyledDebug>
      
      <StyledStatusContainer>
        <StyledResetButton>{'RESET'}</StyledResetButton>
        { solved ? (
          <StyledSolvedStatus>{'SUBMIT'}</StyledSolvedStatus>
        ): (
          <StyledUnSolvedStatus>{'SUBMIT'}</StyledUnSolvedStatus>
        ) }
      </StyledStatusContainer>
    </StyledContainer>
  );
}
