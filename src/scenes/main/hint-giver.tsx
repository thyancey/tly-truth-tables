import styled from 'styled-components';

import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { getColor, mixinFontFamily } from '../../themes';
import { LilMan } from '../../components/lilman';
import { selectActiveHintGiver } from './slice';

const StyledContainer = styled.div`
  position: absolute;
  left:0;
  bottom:0;
`;

const StyledLilManContainer = styled.div`
  position: absolute;
  left:-5rem;
  bottom:-5rem;
  width:40rem;
  height:50rem;
`;

const StyledLabel = styled.div`
  position:absolute;
  bottom: -1rem;
  left: -1rem;
  padding: .25rem 2rem;
  border-radius: 0 3rem 0 0;

  white-space: nowrap;
  color:${getColor('brown_dark')};
  font-size: 5rem;
  background-color: ${getColor('brown_light')};
  border: .75rem solid ${getColor('brown_dark')};
`

export function HintGiver() {
  const hintGiver = useAppSelector(selectActiveHintGiver);
  if (!hintGiver) return null;

  return (
    <StyledContainer>
      <StyledLilManContainer>
        <LilMan
          isTalking={true}
          hintGiver={hintGiver}
          ssOverride={hintGiver.ssData?.hint}
        />
      </StyledLilManContainer>
      {/* <StyledLabel>
        {hintGiver.name}
      </StyledLabel> */}
    </StyledContainer>
  );
}
