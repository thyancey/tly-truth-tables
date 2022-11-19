import styled, { css } from 'styled-components';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { Button } from '../../../components/button';
import { selectAllLevelInfo, setGameStatus, startLevel } from '../../../app/board-slice';
import { getColor } from '../../../themes';
import { LevelInfo, RenderedMenuGroup } from '../../../types';
import { useCallback } from 'react';

import DoneIcon from '@material-ui/icons/Done';
import { StyledModalBody, StyledModalContainer, StyledModalFooter, StyledModalHeader } from './basic';

export const StyledBody = styled(StyledModalBody)`
  border: .75rem solid ${getColor('brown_dark')};
  background-color: ${getColor('brown')};
  border-radius: 2rem;

  li{
    list-style: none;
    padding:1rem 0;
    margin:0;
  }
`;

interface StyledLevelEntryProps {
  current?: boolean,
  isEven: boolean
}
export const StyledLevelEntry = styled.li<StyledLevelEntryProps>`
  width:100%;
  border: .5rem dashed transparent;
  transition: border-color .2s ease-out;

  color: ${getColor('brown_light')};
  ${p => p.current && css`
    border-color: ${getColor('green')};
  `}

  ${p => p.isEven ? css`
    background-color: rgba(53, 18, 14, .5);
  `: css`
    background-color: rgba(53, 18, 14, .3);
  `}

  cursor: pointer;
  &:hover{
    color: ${getColor('white')};
    border-color: ${getColor('brown_light')};
  }

  display:grid;
  grid-template-columns: 4rem auto 5rem;
  gap: .5rem;
  justify-items:middle;
  align-items: middle;
  justify-content: middle;

  >span{
    margin: auto 0;
    font-size: 3rem;

    &:last-child{
      font-size: 2rem;
    }
  }
`;

interface StyledCompletedProps {
  completed?: boolean
}

export const StyledCompleted = styled.div<StyledCompletedProps>`
  width: 2.5rem;
  height: 2.5rem;
  margin: .25rem auto 0 auto;
  border-radius: 50%;
  padding: 1rem;
  background-color: ${getColor('brown')};

  >svg{
    opacity:0;
    color: ${getColor('brown_light')};
    font-size:2.5rem;
    margin-left:-1rem;
    margin-top:-1rem;
  }

  ${p => p.completed ? css`
    >svg{
      opacity:1;
    }
  }
  `: css`
  `}
`;

export const StyledGroupEntry = styled.li`
  h2{
    margin-left:-1rem;
    color: ${getColor('brown_light')};
  }

  hr{
    color: ${getColor('brown_light')};
    background: none;
    background-color: ${getColor('brown_light')};
    border: 0;
    height:.5rem;
    margin: .5rem 0 .5rem 0;
  }
`;

interface LevelGroupEntryProps {
  levelGroup: RenderedMenuGroup,
  startLevel: Function
}
export function LevelGroupEntry({levelGroup, startLevel}: LevelGroupEntryProps) {
  return (
    <StyledGroupEntry>
      <h2>{levelGroup.title}</h2>
      <hr/>
      <ul>
        {levelGroup.levels.map((lI, idx) => (
          <LevelInfoEntry key={idx} data={lI} idx={idx} startLevel={startLevel}/>
        ))}
      </ul>
    </StyledGroupEntry>
  )
}

interface LevelInfoEntryProps {
  data: LevelInfo,
  startLevel: Function,
  idx: number
}
export function LevelInfoEntry({data, idx, startLevel}: LevelInfoEntryProps) {
  return (
    <StyledLevelEntry current={data.current} isEven={idx % 2 === 0} onClick={() => startLevel(data.level)}>

      <StyledCompleted completed={data.completed}>
        <DoneIcon />
      </StyledCompleted>
      <span>{`${data.title}`}</span>
      <span>{`(${data.layout})`}</span>
    </StyledLevelEntry>
  )
}

export function ProgressModal() {
  const dispatch = useAppDispatch();
  const levelInfo = useAppSelector(selectAllLevelInfo);

  const onStartLevel = useCallback((idx => {
    dispatch(startLevel(idx))
  }), [dispatch]);

  return (
    <StyledModalContainer>
      <StyledModalHeader>
        <h1>{'PROGRESS'}</h1>
      </StyledModalHeader>
      
      <StyledBody>
        {levelInfo.map((lI, idx) => (
          <LevelGroupEntry key={idx} levelGroup={lI} startLevel={onStartLevel}/>
        ))}
      </StyledBody>
      <StyledModalFooter>
        <Button text={'OK'} onClick={() => dispatch(setGameStatus('playing'))} />
      </StyledModalFooter>
    </StyledModalContainer>
  );
}
