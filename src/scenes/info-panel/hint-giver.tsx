import styled from 'styled-components';

import { useAppSelector } from '../../app/hooks';
import { LilMan } from '../../components/lilman';
import { selectActiveHintGiver } from '../../app/board-slice';

const StyledLilManContainer = styled.div`
  position: absolute;
  width:100%;
  height:100%;
  left:50%;
  top:50%;
  transform: translate(-50%, -50%);
`;

interface HintGiverProps {
  isTalking?: boolean,
  align?: 'bottom' | 'top'
}

export function HintGiver({ isTalking, align = 'bottom' }: HintGiverProps) {
  const hintGiver = useAppSelector(selectActiveHintGiver);
  if (!hintGiver) return null;

  return (
    <StyledLilManContainer>
      <LilMan
        isTalking={isTalking}
        hintGiver={hintGiver}
      />
    </StyledLilManContainer>
  );
}
