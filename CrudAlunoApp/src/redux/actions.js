import { AsyncStorage } from 'react-native';
import server from '../apis/serverApi';
import { store } from './store';

function modifyUser(state, user_id, callback) {
  const { localData, searchData, favoritesData, chatData } = state;

  const makeUserIdxArray = (array) => {
    let idx = null;
    let user = array.find((u, index) => {
      if (u.id == user_id) {
        idx = index;
        return true;
      }
      return false;
    });
    return { user, idx, array }
  }

  const indexes = [
    makeUserIdxArray(localData),
    makeUserIdxArray(searchData),
    makeUserIdxArray(favoritesData),
    makeUserIdxArray(chatData)
  ];

  indexes.forEach(callback);
}

function setState(state) {
  return { type: 'SET_REDUX_STATE', data: state };
}

function setUser(user) {
  let state = store.getState();
  state.user = user;
  return { type: 'SET_REDUX_STATE', data: state };
}

function setLocalData(localData) {
  let state = store.getState();
  state.localData = localData;
  return { type: 'SET_REDUX_STATE', data: state };
}

function setSearchData(searchData) {
  let state = store.getState();
  state.searchData = searchData;
  return { type: 'SET_REDUX_STATE', data: state };
}

function setFavoritesData(favoritesData) {
  let state = store.getState();
  state.favoritesData = favoritesData;
  return { type: 'SET_REDUX_STATE', data: state };
}

function setChatData(chatData) {
  let state = store.getState();
  state.chatData = chatData;
  return { type: 'SET_REDUX_STATE', data: state };
}

function setApiToken(apiToken) {
  let state = store.getState();
  state.apiToken = apiToken;
  return { type: 'SET_REDUX_STATE', data: state };
}




function toggleFavorite(user) {
  const state = store.getState();
  const fav = user.fav ? false : true;
  user.fav = fav;
  if (fav)
    server.get('fav/add/' + user.id);
  else
    server.get('fav/remove/' + user.id);

  modifyUser(state, user.id, (uia) => {
    if (uia.array === state.favoritesData) {
      if (uia.idx == null && fav)
        uia.array.push(user);
      else if (uia.idx != null && !fav)
        uia.array.splice(uia.idx, 1);
    } else if (uia.idx != null) {
      uia.user.fav = fav;
    }
  });

  return { type: 'SET_REDUX_STATE', data: state };
}

function deleteUser(user) {
  let state = store.getState();

  modifyUser(state, user.id, (uia) => {
    if (uia.idx != null)
      uia.array.splice(uia.idx, 1);
  });

  return { type: 'SET_REDUX_STATE', data: state };
}


function resetState() {
  return { type: 'RESET_REDUX_STATE' };
}

export default {
  setState,
  setUser,
  setLocalData,
  setSearchData,
  setFavoritesData,
  setChatData,
  setApiToken,
  toggleFavorite,
  deleteUser,
  resetState
};
