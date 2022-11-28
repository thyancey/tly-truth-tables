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

  background-color: ${getColor('brown_light')};
  border-top: .75rem solid ${getColor('brown')};

  display:grid;
  grid-template-columns: 27rem auto;
  grid-template-rows: min-content auto;

  z-index:1;
  ${p => p.solvedType === 'correct' && css`
    /* background-color: ${getColor('green')}; */
  `}
  ${p => p.solvedType === 'incorrect' && css`
    /* background-color: ${getColor('red_light')}; */
  `}
`;


const StyledTitleBox = styled.div`
  grid-column: 2 / span 1;
  grid-row: 1 / span 1;

  h2{
    font-size: 3rem;
    padding: .5rem;
    padding-top: 1rem;

    margin: auto 0;
  }

`
const animateMarkdown = keyframes`
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
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
        <StyledHintBox>
          {hint ? (
            <SpeechText mdText={hintText} onTextComplete={onTextComplete} delay={750} />
          ) : (
            <SpeechText mdText={description} onTextComplete={onTextComplete} delay={500} />
          )}
        </StyledHintBox>
        <StyledTitleBox>
          <h2>{titleText}</h2>
        </StyledTitleBox>
      </StyledBanner>
      <StyledHintGiver>
        <NewHintGiver isTalking={isTalking} />
      </StyledHintGiver>
    </>
  );
}
