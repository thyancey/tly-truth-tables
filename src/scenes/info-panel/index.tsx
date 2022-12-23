import { useCallback, useEffect, useMemo, useState } from 'react';
import styled, { css, keyframes } from 'styled-components';

import { useAppSelector } from '../../app/hooks';
import { getColor, mixinFontFamily } from '../../themes';
import { SpeechText } from '../../components/speech-text';
import { checkIfSolved, selectActiveHint, selectLevelInfo } from '../../app/board-slice';
import { HintPicker } from './hint-picker';
import { NewHintGiver } from './new-hint-giver';
import { SolvedType } from '../../types';
import { SolvedNotice } from './solved-notice';

const StyledHintGiver = styled.div`
  grid-column: 1 / span 1;
  grid-row: 2 / span 2;
  position:relative;
  z-index:1;
  pointer-events:none;
`;
interface StyledBannerProps {
  solvedType: SolvedType;
  completed?: boolean;
}
const StyledBanner = styled.div<StyledBannerProps>`
  grid-column: 1 / span 2;
  grid-row: 3 / span 1;
  padding-top:.75rem;
  padding-bottom: .75rem;
  padding-left: var(--leftcolsize);
  z-index:1;

  background-color: ${getColor('brown_light')};

  ${p => p.solvedType === 'correct' && css`
    /* background-color: ${getColor('green')}; */
  `}
  ${p => p.solvedType === 'incorrect' && css`
    /* background-color: ${getColor('red_light')}; */
  `}
`;
const animateMarkdown = keyframes`
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
`;

const StyledTextZone = styled.div`
  height:100%;

  overflow-y: auto;
  overflow-x: hidden;
  padding: 1rem 1rem 3rem 0;

  h2{
    font-size: 3rem;
    margin: 0;

    @media (max-width: 600px) {
      font-size:2rem;
    }
  }

  hr{
    border: none;
    height: .25rem;
    background-color: ${getColor('brown_dark')};
    margin-bottom:1rem;
    max-width: 90%;
    opacity: .5;
  }

  p {
    ${mixinFontFamily('speech')};
    font-size:2.5rem;
    line-height: 2.5rem;

    @media (max-width: 600px) {
      font-size:2rem;
      line-height: 2rem;
    }

    em,strong{
      animation: ${animateMarkdown} .3s ease-in;
      animation-fill-mode: backwards;
    }

    /* markdown *emphasis* text, these are clues */
    em{
      margin-left:-.5rem;
    }
    /* markdown **strong** text, these match an attribute name */
    strong{
      margin-left:-.5rem;
      margin-right:-.5rem;
    }
  }
`

const StyledControls = styled.div`
  position:relative;

  >div{
    position:absolute;
    left:50%;
    transform:translateX(-50%);

    bottom: calc(100% - .75rem);
    width:100%;
  }
`;

export function InfoPanel() {
  const [ isTalking, setIsTalking ] = useState(true);
  const hint = useAppSelector(selectActiveHint);
  const solvedType = useAppSelector(checkIfSolved);
  const levelInfo = useAppSelector(selectLevelInfo);


  const titleText = useMemo(() => {
    return `${levelInfo?.completed ? '(solved) ' : ''}Level ${(levelInfo?.level || 0) + 1}: ${levelInfo?.title}`
  }, [levelInfo]);

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
      <SolvedNotice />
      <StyledBanner completed={levelInfo?.completed} solvedType={solvedType}>
        <StyledControls>
          <HintPicker />
        </StyledControls>
        <StyledTextZone>
          <h2>{titleText}</h2>
          <hr/>
          {hint ? (
            <SpeechText mdText={hintText} onTextComplete={onTextComplete} delay={750} />
          ) : (
            <SpeechText mdText={description} onTextComplete={onTextComplete} delay={500} />
          )}
        </StyledTextZone>
      </StyledBanner>
      <StyledHintGiver>
        <NewHintGiver isTalking={isTalking} />
      </StyledHintGiver>
    </>
  );
}
