import { useCallback } from 'react';
import styled from 'styled-components';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { getPosition, getZoom, resetPosition, resetZoom, setPosition, setZoom } from '../../app/ui-slice';
import { getColor } from '../../themes';

const StyledContainer = styled.div`
  position:absolute;
  right:0;
  top:0;
  padding-left: 1rem;
  border: .25rem solid ${getColor('white')};
  border-radius: 1rem;
  color: ${getColor('white')};
  background-color: ${getColor('brown')};
  z-index:1;

  >p{
    font-size: 1.5rem;
    margin-bottom: .5rem;
    color: ${getColor('brown_light')};
    text-align:center;
  }

  >div{
    display:inline-block;
    vertical-align: middle;
    height: 6rem;
  }
`;

const StyledZoomContainer = styled.div`
  margin-right: 1rem;
`;

const StyledPanContainer = styled.div`
  >button, >input {
    display:inline-block;
    vertical-align:middle;
  }

  >button {
    margin-right: 1rem;
  }

`;

const StyledSlider = styled.input`
  width: 5rem;
  cursor: pointer;
`
const PanSliderY = styled(StyledSlider)`
  transform: rotate(90deg);
  margin-left: -1rem;
  margin-top:-1rem;
`;

const StyledButton = styled.div`
  font-size: 2rem;
  margin-bottom: .5rem;
  cursor: pointer;

  &:hover{
    color: ${getColor('green_light')}
  }
`;

export function PositionControls() {
  const zoom = useAppSelector(getZoom);
  const position = useAppSelector(getPosition);
  const dispatch = useAppDispatch();

  const onChangeZoom = useCallback((e) => {
    dispatch(setZoom(e.target.value / 10));
  }, [ dispatch ]);
  
  const onChangePositionX = useCallback((e) => {
    dispatch(setPosition([e.target.value, position[1]]));
  }, [ dispatch, position ]);
  
  const onChangePositionY = useCallback((e) => {
    dispatch(setPosition([position[0], e.target.value]));
  }, [ dispatch, position ]);

  const onResetZoom = useCallback(() => {
    dispatch(resetZoom());
  }, [ dispatch ]);

  const onResetPosition = useCallback(() => {
    dispatch(resetPosition());
  }, [ dispatch ]);

  return (
    <StyledContainer>
      <p>{'- reposition board -'}</p>
      <StyledZoomContainer>
        <StyledButton onClick={onResetZoom} title={'reset zoom'}>{'ZOOM'}</StyledButton>
        <StyledSlider type="range" min={1} max={10} value={zoom * 10} onChange={onChangeZoom} id="zoomRange" />
      </StyledZoomContainer>
      <StyledPanContainer>
        <StyledButton onClick={onResetPosition} title={'reset pan'}>{'PAN'}</StyledButton>
        <StyledSlider type="range" min={-50} max={50} value={position[0]} onChange={onChangePositionX} id="xRange" />
        <PanSliderY type="range" min={-50} max={50} value={position[1]} onChange={onChangePositionY} id="yRange" />
      </StyledPanContainer>
    </StyledContainer>
  );
}
