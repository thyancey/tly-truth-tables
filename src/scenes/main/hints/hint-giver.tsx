import styled from 'styled-components';

import { useAppSelector } from '../../../app/hooks';
import { LilMan } from '../../../components/lilman';
import { selectActiveHintGiver } from '../../../app/slice';

const StyledContainer = styled.div`
  position: absolute;
  left:0;
  bottom:0;
`;

const StyledLilManContainer = styled.div`
  position: absolute;
  left:-6rem;
  bottom:-4rem;
  width:40rem;
  height:50rem;
`;

interface HintGiverProps {
  isTalking?: boolean
}

export function HintGiver({ isTalking }: HintGiverProps) {
  const hintGiver = useAppSelector(selectActiveHintGiver);
  if (!hintGiver) return null;

  return (
    <StyledContainer>
      <StyledLilManContainer>
        <LilMan
          isTalking={isTalking}
          hintGiver={hintGiver}
        />
      </StyledLilManContainer>
    </StyledContainer>
  );
}
