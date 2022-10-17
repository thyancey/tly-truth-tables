import { useCallback } from 'react';
import styled from 'styled-components';

import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { getColor, mixinFontFamily } from '../../../themes';
import { SpeechText } from '../../../components/speech-text';
import { selectActiveHint, setActiveHint } from '../../../app/slice';
import { HintPicker } from './hint-picker';
import { HintGiver } from './hint-giver';

const StyledContainer = styled.div`
  flex: 0 0 20rem;
  width:100%;
  height:100%;
  background-color: ${getColor('brown_light')};
  border-top: .75rem solid ${getColor('brown')};

  display:grid;
  grid-template-columns: 20rem auto;
  grid-template-rows: 2rem auto;

  z-index:3;
`;

const StyledHintBox = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  grid-column: 2 / span 1;
  grid-row: 2 / span 1;

  p {
    ${mixinFontFamily('speech')};
    font-size: 5rem;
  }
`;

const StyledControls = styled.div`
  grid-column: 2 / span 1;
  grid-row: 1 / span 1;
  position:relative;

  >div{
    position:absolute;
    left:50%;
    transform:translateX(-50%);

    bottom: calc(100% - 1.5rem);
    width:100%;
  }
`;

const StyledHintGiver = styled.div`
  grid-column: 1 / span 1;
  grid-row: 1 / span 2;
`;

export function HintBanner() {
  const hint = useAppSelector(selectActiveHint);

  const dispatch = useAppDispatch();
  const onCloseHint = useCallback(() => {
    dispatch(setActiveHint(-1));
  }, [dispatch]);

  return (
    <StyledContainer>
      <StyledHintGiver>
        <HintGiver />
      </StyledHintGiver>
      <StyledControls>
        <HintPicker />
      </StyledControls>
      <StyledHintBox>
        {hint && <SpeechText text={hint.text} />}
      </StyledHintBox>
    </StyledContainer>
  );
}
