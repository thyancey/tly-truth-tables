import { useAppDispatch } from '../../app/hooks';
import { getGameStatus, resetMatrix, selectLevelData } from '../../app/slice';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';

export function RuleMaster() {
  const dispatch = useAppDispatch();
  const levelData = useSelector(selectLevelData);
  const gameStatus = useSelector(getGameStatus);

  // eventually, should move this logic into the slice somehow
  useEffect(() => {
    if(levelData && gameStatus === 'loading') {
      dispatch(resetMatrix(levelData));
    }
  }, [dispatch, levelData, gameStatus]);

  return null;
}
