import styled from 'styled-components';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { selectAttributes, selectRenderedSolution, setGameStatus } from '../../../app/board-slice';
import { StyledModalBody, StyledModalContainer, StyledModalFooter, StyledModalHeader } from './basic';
import { Button } from '../../../components/button';
import { getColor } from '../../../themes';

const StyledSolution = styled.div`
  margin-top: 2rem;

  table{
    width:100%;
    border-collapse: collapse;
    tr{
      border: 2px solid ${getColor('white')};
    }
    th, td{
      padding:.5rem;
      text-align:center;
      border: 2px solid ${getColor('white')};
    }
  }
`

export function DebugModal() {
  const dispatch = useAppDispatch();
  const renderedSolution = useAppSelector(selectRenderedSolution);
  const attributes = useAppSelector(selectAttributes);

  return (
    <StyledModalContainer>
      <StyledModalHeader>
        <h1>{'DEBUG'}</h1>
      </StyledModalHeader>
      
      <StyledModalBody>
        <StyledSolution>
          <p>{'DEBUG SOLUTION'}</p>
          <table>
            <thead>
              <tr>
                {attributes.map((attr, idx) => (
                  <th key={idx}><span>{`group ${idx + 1}`}</span></th>
                ))}
              </tr>
            </thead>
            <tbody>
              {renderedSolution?.map((rS, idx) => (
                <tr key={idx}>
                  {rS.map((rSe, rSeIdx) => (
                    <td key={`${idx}-${rSeIdx}`}><span>{rSe}</span></td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </StyledSolution>
      </StyledModalBody>
      <StyledModalFooter>
        <Button text={'OK'} onClick={() => dispatch(setGameStatus('playing'))} />
      </StyledModalFooter>
    </StyledModalContainer>
  );
}
