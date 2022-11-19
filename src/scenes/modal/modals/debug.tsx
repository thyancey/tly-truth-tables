import styled from 'styled-components';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { selectAttributes, selectGridInfo, selectRenderedSolution, setGameStatus } from '../../../app/board-slice';
import { Button } from '../../../components/button';
import { getColor } from '../../../themes';
import { createComparisonHash } from '../../../utils/puzzler';

const StyledButtonContainer = styled.div`
  flex: 1;
  >div{
    margin:2rem;
  }
`;

const StyledContainer = styled.div`
  display:flex;
  flex-direction:column;

  padding:1.5rem;
  text-align:center;
`;

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
  const gridInfo = useAppSelector(selectGridInfo);

  const comparisonHash = createComparisonHash(gridInfo.numAttributes, gridInfo.numValues);
  console.log('comparisonHash: ', comparisonHash);

  return (
    <StyledContainer>
      <h3>{'debug info'}</h3>
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
      <StyledButtonContainer>
        <Button text={'OK'} onClick={() => dispatch(setGameStatus('playing'))} />
      </StyledButtonContainer>
    </StyledContainer>
  );
}
