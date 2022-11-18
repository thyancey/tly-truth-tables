import styled from 'styled-components';
import { useAppDispatch } from '../../../app/hooks';
import { Button } from '../../../components/button';
import { setGameStatus } from '../../../app/board-slice';

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

export function ProgressModal() {
  const dispatch = useAppDispatch();

  return (
    <StyledContainer>
      <h2>{'Progress!'}</h2>
      
      <StyledButtonContainer>
        <Button text={'OK'} onClick={() => dispatch(setGameStatus('playing'))} />
      </StyledButtonContainer>
    </StyledContainer>
  );
}
