import { AsyncStorage } from 'react-native';
import { store } from '../redux';

function saveState() {
  AsyncStorage.setItem('state', JSON.stringify(store.getState()));
}

async function loadStateAsync() {
  const stateItem = await AsyncStorage.getItem('state');

  if (stateItem) {
    const state = JSON.parse(stateItem);
    return state;
  }

  return null;
}

function clear() {
  AsyncStorage.clear();
}


export {
  saveState,
  loadStateAsync,
  clear
}












