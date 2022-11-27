import styled, { css, keyframes } from 'styled-components';

import { useAppSelector } from '../../app/hooks';
import { getColor } from '../../themes';
import { checkIfSolved } from '../../app/board-slice';

const slideInFromBottom = keyframes`
  0% {
    transform: translateY(100%);
    opacity: 0;
  }
  100% {
    transform: translateY(0);
    opacity: 1;
  }
`;
const fadeOut = keyframes`
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
`;

const StyledSolvedNotice = styled.div`
  grid-column: 1 / span 2;
  grid-row: 3 / span 1;
  position: relative;
  animation: ${fadeOut} .25s ease-out .5s;
  animation-fill-mode: backwards;
  opacity: 0;

  div{
    animation: ${slideInFromBottom} .2s cubic-bezier(.56,1.85,.74,.63) 0s 1;
    position:absolute;
    bottom:100%;
    opacity: 1;
    text-align:right;
    padding: .5rem 1rem;
    right: .5rem;

    span{
      font-size:2rem;
    }
  }
`;

const StyledCorrectNotice = styled(StyledSolvedNotice)`
  div{
    /* box-shadow:0 -2px 1rem 2rem ${getColor('green')}; */
    background-color: ${getColor('green')};
  }
`;

const StyledIncorrectNotice = styled(StyledSolvedNotice)`
  div{
    /* box-shadow:0 -2px 2rem 2rem ${getColor('red_light')}; */
    background-color: ${getColor('red_light')};
  }
`;

export function SolvedNotice() {
  const solvedType = useAppSelector(checkIfSolved);

  switch(solvedType){
    case 'incorrect': return(
      <StyledIncorrectNotice>
        <div>
          <span>{'INVALID!'}</span>
        </div>
      </StyledIncorrectNotice>
    );
    case 'correct': return(
      <StyledCorrectNotice>
        <div>
          <span>{'VALID!'}</span>
        </div>
      </StyledCorrectNotice>
    );
  }

  return null;
}
