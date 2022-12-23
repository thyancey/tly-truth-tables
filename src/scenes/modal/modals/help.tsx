import styled, { css } from 'styled-components';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { getPrevGameStatus, setGameStatus } from '../../../app/board-slice';
import { Button } from '../../../components/button';
import { getColor } from '../../../themes';
import { StyledModalContainer, StyledModalFooter, StyledModalHeader } from './basic';
import { useMemo, useState } from 'react';
import { TUTORIAL } from '../../../app/data/data';
import NavigateNext from '@material-ui/icons/NavigateNext';
import NavigateBefore from '@material-ui/icons/NavigateBefore';

const StyledInstructions = styled.div`
  grid-column: 1 / span 3;
  grid-row: 2 / span 1;
  width: 100%;
  height: 100%;
  padding: 0 3rem;
  overflow-y: auto;

  border: .25rem solid ${getColor('brown')};
  border-left: 0;
  border-right:0;
  padding: 1rem;

  display:grid;
  grid-template-columns: 5rem auto 5rem;
  grid-template-rows: auto min-content;
  row-gap:1rem;
`;

const StyledTutArrow = styled.div`
  grid-row: 1 / span 1;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  svg{
    font-size: 5rem;
  }

  @media (hover: hover) {
    &:hover{
      color: white;
    }
  }
`;

const StyledPrevTut = styled(StyledTutArrow)`
  grid-column: 1 / span 1;  
`
const StyledNextTut = styled(StyledTutArrow)`
  grid-column: 3 / span 1;
`

const StyledTutText = styled.p`
  grid-row: 2 / span 1;
  grid-column: 2 / span 1;
  
  @media (max-width: 600px) {
    grid-column: 1 / span 3;
  }
`;

interface StyledTutorialImageProps {
  imageUrl: string;
}
const StyledTutorialImage = styled.div<StyledTutorialImageProps>`
  grid-column: 2 / span 1;
  grid-row: 1 / span 1; 
  background: url(${p => p.imageUrl}) no-repeat center;
  background-position:center;
  background-size:contain;

  border: .5rem solid ${getColor('brown_dark')};
  /* margin-bottom: 1rem; */
`;

export function HelpModal() {
  const dispatch = useAppDispatch();
  const prevGameStatus = useAppSelector(getPrevGameStatus);
  const [tutIdx, setTutIdx] = useState(0);

  const tutData = useMemo(() => {
    return TUTORIAL[tutIdx];
  }, [tutIdx]);
  
  const tutIdxs = useMemo(() => {
    return Array.from({length: TUTORIAL.length}, (x, i) => i)
  }, []);

  return (
    <StyledModalContainer>
      <StyledModalHeader>
        <h1>{'HELP'}</h1>
      </StyledModalHeader>
      
      <StyledInstructions>
        <StyledTutorialImage imageUrl={tutData.image} />
        <StyledTutText>{tutData.text}</StyledTutText>
        {tutIdx > 0 && (
          <StyledPrevTut onClick={() => setTutIdx(tutIdx - 1)}>
            <NavigateBefore/>
          </StyledPrevTut>
        )}
        {(tutIdx + 1) < tutIdxs.length && (
          <StyledNextTut onClick={() => setTutIdx(tutIdx + 1)}>
            <NavigateNext/>
          </StyledNextTut>
        )}
      </StyledInstructions>
      <StyledModalFooter>
        <Button text={'OK'} onClick={() => dispatch(setGameStatus(prevGameStatus))} />
      </StyledModalFooter>
    </StyledModalContainer>
  );
}
