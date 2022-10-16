import { useAppDispatch } from '../../app/hooks';
import { getGameStatus, resetMatrix, selectRoundData } from './slice';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';

export function RuleMaster() {
  const dispatch = useAppDispatch();
  const roundData = useSelector(selectRoundData);
  const gameStatus = useSelector(getGameStatus);

  // eventually, should move this logic into the slice somehow
  useEffect(() => {
    if(roundData && gameStatus === 'loading') {
      dispatch(resetMatrix(roundData));
    }
  }, [dispatch, roundData, gameStatus]);

  return null;
}
