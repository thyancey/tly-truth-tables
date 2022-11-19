// pattern from https://dev.to/igorovic/simplest-way-to-persist-redux-state-to-localstorage-e67
const LS_KEY = 'state';
export const loadState = () => {
  try {
    const serializedState = localStorage.getItem(LS_KEY);
    if(!serializedState) return undefined;
    return JSON.parse(serializedState);
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