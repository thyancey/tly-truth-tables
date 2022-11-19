// pattern from https://dev.to/igorovic/simplest-way-to-persist-redux-state-to-localstorage-e67

/* when changing redux store or save format, update from whatever epoch time it is
   to invalidate older saves. prevents corrupting localStorage while its tied to loose
   redux state
*/
export const STORE_SCHEMA = 1668893882490;

const LS_KEY = 'state';
export const loadState = () => {
  try {
    const serializedState = localStorage.getItem(LS_KEY);
    if(!serializedState) return undefined;
    const state = JSON.parse(serializedState);
    if(state.board.storeSchema !== STORE_SCHEMA) {
      console.log('saved data does not match store schema, resetting');
      return undefined;
    }

    // hack for now, force player to start a new level and reset some messy data
    state.board.gameStatus = 'start';

    return state;
  } catch(e) {
    return undefined;
  }
}

export const saveSate = async (state: any) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem(LS_KEY, serializedState);
  } catch(e) {
    
  }
}

// TODO see if this has async issues with redux
export const resetData = () => {
  localStorage.removeItem(LS_KEY);
  document.location.reload();
}