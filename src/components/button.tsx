import styled from 'styled-components';
import { MouseEventHandler } from 'hoist-non-react-statics/node_modules/@types/react';
import { getColor } from '../themes';

export const ScButton = styled.div`
  /* display: inline-block; */
  cursor: pointer;

  >div{
    padding: 0.5rem 1rem;
    /* display: inline-block; */
    border-radius: .5rem;
    color: .5rem solid ${getColor('brown_dark')};
    border: .5rem solid ${getColor('brown_dark')};
    background-color: ${getColor('brown_light')};
      transition: background-color .5s;

    &:hover {
      background-color: ${getColor('pink')};
      transition: background-color .5s;
    }
  }
`;

interface LBType {
  onClick: MouseEventHandler,
  text: string
}

export function Button({ onClick, text }: LBType) {
  return (
    <ScButton onClick={onClick}><div><span>{text}</span></div></ScButton>
  )
}
