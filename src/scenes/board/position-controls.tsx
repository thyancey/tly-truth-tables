import { useCallback, useEffect } from 'react';
import styled from 'styled-components';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { selectPosition, releaseDeltas, resetPosition, resetZoom, selectZoom, setPosition, setZoom, setDeltaValues } from '../../app/ui-slice';
import { getColor } from '../../themes';
import { Coordinate } from '../../types';
import {  roundTo } from '../../utils';

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

let startAvgCoords: Coordinate = [0,0];
let startPinchDistance: number = 0;

export function PositionControls() {
  const zoom = useAppSelector(selectZoom);
  const position = useAppSelector(selectPosition);
  const dispatch = useAppDispatch();

  const onChangeZoom = useCallback((e) => {
    dispatch(setZoom(e.target.value / 10));
  }, [ dispatch ]);
  
  const onChangePositionX = useCallback((e) => {
    dispatch(setPosition([+e.target.value, position[1]]));
  }, [ dispatch, position ]);
  
  const onChangePositionY = useCallback((e) => {
    dispatch(setPosition([position[0], +e.target.value]));
  }, [ dispatch, position ]);

  const onResetZoom = useCallback(() => {
    dispatch(resetZoom());
  }, [ dispatch ]);

  const onResetPosition = useCallback(() => {
    dispatch(resetPosition());
  }, [ dispatch ]);

  const onDocumentTouchMove = useCallback((e:TouchEvent) => {
    if(e.touches.length > 1){
      // pinchy checks
      const pinchDistance = Math.sqrt(Math.pow((e.touches[1].clientX - e.touches[0].clientX), 2) + Math.pow((e.touches[1].clientY - e.touches[0].clientY), 2));

      const avgCoords: Coordinate = [
        roundTo(((e.touches[0].clientX + e.touches[1].clientX) / 2) - startAvgCoords[0], 2),
        roundTo(((e.touches[0].clientY + e.touches[1].clientY) / 2) - startAvgCoords[1], 2)
      ];

      const deltaDiff = roundTo(pinchDistance - startPinchDistance, 2);

      // -250 > 250, pinch-ins are negative, pinch-outs are positive.
      // so divide by 250 to get the perc change
      // position goes between 50s, so get the perc change and clamp that
      dispatch(setDeltaValues({
        zoom: deltaDiff / 250,
        position: [ (avgCoords[0] / 150) * 50, (avgCoords[1] / 150) * 50 ]
      }));
    }
  }, [dispatch]);

  const onDocumentTouchStart = useCallback((e:TouchEvent) => {
    // console.log('onDocumentTouchStart');
    if(e.touches.length > 1){
      // pinchy checks
      startAvgCoords = [
        (e.touches[0].clientX + e.touches[1].clientX) / 2,
        (e.touches[0].clientY + e.touches[1].clientY) / 2
      ];
      startPinchDistance = Math.sqrt(Math.pow((e.touches[1].clientX - e.touches[0].clientX), 2) + Math.pow((e.touches[1].clientY - e.touches[0].clientY), 2));
    }
  }, []);

  const onDocumentTouchEnd = useCallback((e:TouchEvent) => {
    // console.log('onDocumentTouchEnd');
    // e.preventDefault(); // prevent mouse click from triggering even on a touch device
    
    dispatch(releaseDeltas());
  }, [dispatch]);
  
  useEffect(() => {
    // document.addEventListener('mouseup', onDocumentMouseUp);
    document.addEventListener('touchstart', onDocumentTouchStart);
    document.addEventListener('touchmove', onDocumentTouchMove);
    document.addEventListener('touchend', onDocumentTouchEnd);    
  }, [ onDocumentTouchStart, onDocumentTouchMove, onDocumentTouchEnd ])



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
