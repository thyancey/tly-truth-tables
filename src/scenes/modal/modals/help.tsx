import styled from 'styled-components';
import { useAppDispatch } from '../../../app/hooks';
import { setGameStatus } from '../../../app/board-slice';
import { Button } from '../../../components/button';
import { getColor } from '../../../themes';
import { resetData } from '../../../utils/localstorage';
import { StyledModalBody, StyledModalContainer, StyledModalFooter, StyledModalHeader } from './basic';

const StyledInstructions = styled.ul`
  text-align:left;
`;

const StyledWebsiteLink = styled.a`
  font-size: 3rem;
  color: ${getColor('black')};

  &:hover{
    color: ${getColor('white')};
  }
`;

export function HelpModal() {
  const dispatch = useAppDispatch();

  return (
    <StyledModalContainer>
      <StyledModalHeader>
        <h1>{'HELP'}</h1>
      </StyledModalHeader>
      
      <StyledModalBody>
        <StyledInstructions>
          <li><p>{'Click the characters at the bottom of the screen to reveal clues about the puzzle'}</p></li>
          <li><p>{'Click the grid cells to cycle between RED (no) and GREEN (yes)'}</p></li>
          <li><p>{'After selecting all of the correct GREEN tiles, click SUBMIT to see if you have the answer correct'}</p></li>
          <li><p>{'The RED tiles do not need to be filled in to solve the puzzle, but they can be used to help you rule out information!'}</p></li>
          <li><p>{'Each attribute combination can only be used once'}</p></li>
          <li><p>{'You may have to iterate through the clues multiple times to arrive at an answer'}</p></li>
        </StyledInstructions>
        
      </StyledModalBody>
      <StyledModalFooter>
        <Button text={'CLEAR SAVE'} buttonType="negative" onClick={() => resetData()} />
        <Button text={'OK'} onClick={() => dispatch(setGameStatus('playing'))} />
        <StyledWebsiteLink href="https://www.thomasyancey.com" target="_blank" title="see some of my other stuff">{'thomasyancey.com'}</StyledWebsiteLink>
      </StyledModalFooter>
    </StyledModalContainer>
  );
}
