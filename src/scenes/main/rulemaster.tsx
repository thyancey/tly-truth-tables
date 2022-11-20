import { useAppDispatch } from '../../app/hooks';
import { getGameStatus, resetMatrix, selectLevelData } from '../../app/board-slice';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';

export function RuleMaster() {
  const dispatch = useAppDispatch();
  const levelData = useSelector(selectLevelData);
  const gameStatus = useSelector(getGameStatus);

  // eventually, should move this logic into the slice somehow
  useEffect(() => {
    if(levelData){
      if(gameStatus === 'loading'){
        dispatch(resetMatrix({ levelData }));
      } else if(gameStatus === 'loadingResume'){
        dispatch(resetMatrix({ levelData, resume: true }));
      }
    }
  }, [dispatch, levelData, gameStatus]);

  return null;
}
