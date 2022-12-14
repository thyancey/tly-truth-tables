import { useCallback } from 'react';
import styled, { css } from 'styled-components';

import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { getColor } from '../../themes';
import { getActiveHintIdx, selectHints, setActiveHint } from '../../app/board-slice';

const StyledContainer = styled.div`
  pointer-events: none;
`;

const StyledControls = styled.ul`
  text-align:center;
  >div{
    display:inline-block;
    pointer-events: all;
  }
`;

interface StyledHintProps {
  isActive?: boolean;
};

const StyledHintHint = styled.div`
  position: absolute;
  bottom: 100%;
  font-size: 1.5rem;
  left:50%;
  transform: translateX(-50%);
  color: ${getColor('brown_light')};
`

const StyledHint = styled.div<StyledHintProps>`
  cursor: pointer;

  background-color: ${getColor('brown_light')};

  width: 5rem;
  height: 5rem;
  margin: .25rem;
  border: var(--bordersize) solid ${getColor('brown')};
  border-radius: 1.5rem;
  transition: all .3s;

  &:hover{  
    width: 7rem;
    height: 6rem;
    background-color: ${getColor('yellow_light')};

    transition: all .3s;
  }

  ${p => p.isActive && css`
    background-color: ${getColor('yellow')};

    width: 8rem;
    height: 8rem;

    &:hover{  
      width: 9rem;
      height: 9rem;
      background-color: ${getColor('pink')};

      transition: all .3s;
    }
  `}
`;

export function HintPicker() {
  const activeHintIdx = useAppSelector(getActiveHintIdx);
  const hints = useAppSelector(selectHints);

  const dispatch = useAppDispatch();
  const onCloseHint = useCallback(() => {
    dispatch(setActiveHint(-1));
  }, [dispatch]);

  const onClickHint = useCallback((hintIdx) => {
    dispatch(setActiveHint(hintIdx));
  }, [ dispatch ]);


  return (
    <StyledContainer>
      <StyledControls>
        {hints?.map((hint, idx) => 
          idx === activeHintIdx ? (
            <StyledHint 
              key={idx}
              onClick={() => onCloseHint()}
              isActive={true}
            />
          ):(
            <StyledHint 
              key={idx}
              onClick={() => onClickHint(idx)}
            />
          )
        )}
        {activeHintIdx === -1 && <StyledHintHint>{'click the clues to solve the puzzle'}</StyledHintHint>}
      </StyledControls>
    </StyledContainer>
  );
}
