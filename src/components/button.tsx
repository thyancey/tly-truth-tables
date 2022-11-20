import styled from 'styled-components';
import { MouseEventHandler } from 'hoist-non-react-statics/node_modules/@types/react';
import { getColor } from '../themes';

export const StyledButton = styled.div`
  border-radius: 1rem;
  cursor: pointer;
  transition: background-color .1s, border-color .2s, box-shadow .15s, transform .15s;
  text-align:center;
  padding: 1.5rem .5rem;

  span{
    font-size:2.5rem;
  }
  
  &:hover{
    transform: translate(-.15rem, -.15rem);
  }
  &:active{
    transform: translate(.45rem, .65rem);
  }
`

const StyledPositiveButton = styled(StyledButton)`
  color: ${getColor('white')};
  background-color:${getColor('green')};
  box-shadow: 0.4rem 0.5rem 0 0.4rem ${getColor('green_light')};

  &:hover{
    box-shadow: 0.6rem 0.75rem 0 0.4rem ${getColor('green_light')};
  }
  &:active{
    background-color:${getColor('green')};
    box-shadow: 0.1rem 0.1rem 0 0.0rem ${getColor('green_light')};
  }
`;

const StyledNegativeButton = styled(StyledButton)`
  color: ${getColor('white')};
  background-color:${getColor('red')};
  box-shadow: 0.4rem 0.5rem 0 0.4rem ${getColor('red_light')};

  &:hover{
    box-shadow: 0.6rem 0.75rem 0 0.4rem ${getColor('red_light')};
  }
  &:active{
    background-color:${getColor('red')};
    box-shadow: 0.1rem 0.1rem 0 0.0rem ${getColor('red_light')};
  }
`;

const StyledSpecialButton = styled(StyledButton)`
  color: ${getColor('white')};
  background-color:${getColor('yellow_dark')};
  box-shadow: 0.4rem 0.5rem 0 0.4rem ${getColor('yellow')};

  &:hover{
    box-shadow: 0.6rem 0.75rem 0 0.4rem ${getColor('yellow')};
  }
  &:active{
    background-color:${getColor('yellow_dark')};
    box-shadow: 0.1rem 0.1rem 0 0.0rem ${getColor('yellow')};
  }
`;


const StyledNeutralButton = styled(StyledButton)`
  color: ${getColor('white')};
  background-color:${getColor('brown_dark')};
  box-shadow: 0.4rem 0.5rem 0 0.4rem ${getColor('brown')};

  &:hover{
    box-shadow: 0.6rem 0.75rem 0 0.4rem ${getColor('brown')};
  }
  &:active{
    background-color:${getColor('brown_dark')};
    box-shadow: 0.1rem 0.1rem 0 0.0rem ${getColor('brown')};
  }
`;

type ButtonType = 'positive' | 'negative' | 'special' | 'neutral';

interface LBType {
  text: string,
  onClick?: MouseEventHandler,
  buttonType?: ButtonType
}

export function Button({ onClick, text, buttonType }: LBType) {
  switch(buttonType){
    case 'positive': return (
      <StyledPositiveButton onClick={onClick}><span>{text}</span></StyledPositiveButton>
    )
    case 'negative': return (
      <StyledNegativeButton onClick={onClick}><span>{text}</span></StyledNegativeButton>
    )
    case 'special': return (
      <StyledSpecialButton onClick={onClick}><span>{text}</span></StyledSpecialButton>
    )
    default: return (
      <StyledNeutralButton onClick={onClick}><span>{text}</span></StyledNeutralButton>
    )
  }
}
