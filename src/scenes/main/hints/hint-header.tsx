import { useCallback } from 'react';
import styled from 'styled-components';

import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { getColor, mixinFontFamily } from '../../../themes';
import { SpeechText } from '../../../components/speech-text';
import { selectActiveHint, setActiveHint } from '../slice';
import { HintPicker } from './hint-picker';

const StyledContainer = styled.div`
  flex: 0 0 20rem;
  width:100%;
  height:100%;
  display:flex;
  flex-direction: column;
  background-color: ${getColor('brown_light')};
  border-bottom: 1rem solid ${getColor('brown_dark')};
  position:relative;

  z-index:3;
`;

const StyledHintBox = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  p {
    ${mixinFontFamily('speech')};
    font-size: 5rem;
  }
`;

const StyledControls = styled.div`
  flex: 0 0 4rem;
  >div{
    position:absolute;
    left:50%;
    transform:translateX(-50%);

    bottom: -3rem;
    width:100%;
  }
`;

export function HintHeader() {
  const hint = useAppSelector(selectActiveHint);

  const dispatch = useAppDispatch();
  const onCloseHint = useCallback(() => {
    dispatch(setActiveHint(-1));
  }, [dispatch]);

  return (
    <StyledContainer>
      <StyledHintBox>
        {hint && <SpeechText text={hint.text} />}
      </StyledHintBox>
      <StyledControls>
        <HintPicker />
      </StyledControls>
    </StyledContainer>
  );
}
