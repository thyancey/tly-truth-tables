import styled from 'styled-components';
import { useAppDispatch } from '../../../app/hooks';
import { startLevel } from '../../../app/board-slice';
import { Button } from '../../../components/button';

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

const StyledBody = styled.div`
  margin-top:-1.5rem;
  margin-bottom: 2rem;
`;

export function SplashModal() {
  const dispatch = useAppDispatch();

  return (
    <StyledContainer>
      <StyledBody>
        <h2>{'TRUTH TABLES'}</h2>
        <p>{'Some kinda puzzle game'}</p>
      </StyledBody>
      <StyledButtonContainer>
        <Button text={'OK'} onClick={() => dispatch(startLevel(0))} />
      </StyledButtonContainer>
    </StyledContainer>
  );
}