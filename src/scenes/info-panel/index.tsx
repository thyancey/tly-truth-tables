import { useCallback, useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';

import { useAppSelector } from '../../app/hooks';
import { getColor, mixinFontFamily } from '../../themes';
import { SpeechText } from '../../components/speech-text';
import { selectActiveHint, selectLevelInfo } from '../../app/board-slice';
import { HintPicker } from './hint-picker';
import { NewHintGiver } from './new-hint-giver';

const StyledHintGiver = styled.div`
  grid-column: 1 / span 1;
  grid-row: 2 / span 2;
  position:relative;
  z-index:1;
`;

const StyledBanner = styled.div`
  grid-column: 1 / span 2;
  grid-row: 3 / span 1;

  background-color: ${getColor('brown_light')};
  border-top: .75rem solid ${getColor('brown')};

  display:grid;
  grid-template-columns: 27rem auto;
  grid-template-rows: min-content auto;

  z-index:1;

  h2{
    font-size: 3rem;
    grid-column: 2 / span 1;
    grid-row: 1 / span 1;

    padding: .5rem;
    padding-top: 1rem;

    margin: auto 0;
    color: ${getColor('brown')};
  }
`;

const StyledHintBox = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  grid-column: 2 / span 1;
  grid-row: 2 / span 1;
  padding: 0 2rem;

  p {
    ${mixinFontFamily('speech')};
    font-size: min(4vw, 5rem);
    line-height: 75%;
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


export function InfoPanel() {
  const [ isTalking, setIsTalking ] = useState(true);
  const hint = useAppSelector(selectActiveHint);
  const levelInfo = useAppSelector(selectLevelInfo);

  const hintText = useMemo(() => {
    return hint ? hint.text : ''
  }, [ hint ]);
  
  const description = useMemo(() => 
    (levelInfo?.description || null)
  , [ levelInfo ]);

  useEffect(() => {
    setIsTalking(true);
  }, [ hint, setIsTalking ]);

  const onTextComplete = useCallback(() => {
    setIsTalking(false);
  }, [ setIsTalking ]);

  if(!description) return null;


  return (
    <>
      <StyledBanner>
        <StyledControls>
          <HintPicker />
        </StyledControls>
        <StyledHintBox>
          {hint ? (
            <SpeechText text={hintText} onTextComplete={onTextComplete} delay={750} />
          ) : (
            <SpeechText text={description} onTextComplete={onTextComplete} delay={500} />
          )}
        </StyledHintBox>
        <h2>{`Level ${(levelInfo?.level || 0) + 1}: ${levelInfo?.title}`}</h2>
      </StyledBanner>
      <StyledHintGiver>
        <NewHintGiver isTalking={isTalking} />
      </StyledHintGiver>
    </>
  );
}
