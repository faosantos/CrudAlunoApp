import { AsyncStorage } from 'react-native';



function createUsersObjectsRefs(state, newData) {

  let setValues = (dst, src) => {
    for (let k in src) {
      if (typeof (src[k]) == 'object') {
        if (dst[k] == undefined)
          dst[k] = src[k];
        else
          setValues(dst[k], src[k]);
      } else if (typeof (src[k]) == 'array') {
        dst[k] = src[k].slice();
      } else {
        dst[k] = src[k];
      }
    }
  }

  let usersObjects = state.usersObjects;
  let references = [];
  for (let i = 0; i < newData.length; ++i) {
    const newUser = newData[i];
    let found = usersObjects.find(u => u.id == newUser.id);
    if (found) {
      if (found !== newUser) {
        let uoidx = usersObjects.indexOf(found);
        setValues(usersObjects[uoidx], newUser);
        references.push(usersObjects[uoidx]);
      }
    } else {
      usersObjects.push(JSON.parse(JSON.stringify(newUser)));
      references.push(usersObjects[usersObjects.length - 1]);
    }
  }

  state.usersObjects = usersObjects;

  return references;
}

function setUser(dispatch, store, user) {
  let state = store.getState();
  state.user = user;
  dispatch({ type: 'SET_REDUX_STATE', data: state });
}

function setLocalData(dispatch, store, localData) {
  let state = store.getState();
  state.localData = createUsersObjectsRefs(state, localData);
  dispatch({ type: 'SET_REDUX_STATE', data: state });
}

function setSearchData(dispatch, store, searchData) {
  let state = store.getState();
  state.searchData = createUsersObjectsRefs(state, searchData);
  dispatch({ type: 'SET_REDUX_STATE', data: state });
}

function setFavoritesData(dispatch, store, favoriteData) {
  let state = store.getState();
  state.favoriteData = createUsersObjectsRefs(state, favoriteData);
  dispatch({ type: 'SET_REDUX_STATE', data: state });
}


function setChatData(dispatch, store, chatData) {
  let state = store.getState();
  state.chatData = createUsersObjectsRefs(state, chatData);
  dispatch({ type: 'SET_REDUX_STATE', data: state });
}

function deleteUser(dispatch, store, user) {
  let state = store.getState();
  let { favoritesData, localData, searchData, usersObjects } = state;
  let { fid, lid, sid, cid, uid } = {
    fid: favoritesData.indexOf(user),
    lid: localData.indexOf(user),
    sid: searchData.indexOf(user),
    cid: chatData.indexOf(user),
    uid: usersObjects.indexOf(user)
  };
  if (fid != -1)
    favoritesData.splice(fid, 1);
  if (lid != -1)
    localData.splice(lid, 1);
  if (sid != -1)
    searchData.splice(sid, 1);
  if (cid != -1)
    chatData.splice(cid, 1);
  if (uid != -1)
    usersObjects.splice(uid, 1);
  dispatch({ type: 'SET_REDUX_STATE', data: state });
}



function setApiToken(dispatch, store, apiToken) {
  let state = store.getState();
  state.apiToken = apiToken;
  dispatch({ type: 'SET_REDUX_STATE', data: state });
}

function saveState(dispatch, store) {
  AsyncStorage.setItem('reduxState', JSON.stringify(store.getState()));
}

async function loadStateAsync(dispatch) {
  const reduxStateItem = await AsyncStorage.getItem('reduxState');

  if (reduxStateItem) {
    const reduxState = JSON.parse(reduxStateItem);
    console.debug("reduxState: ", reduxState);
    dispatch({ type: 'SET_REDUX_STATE', data: reduxState });
  }
}

function clearStorage(dispatch) {
  AsyncStorage.clear();
  dispatch({ type: 'RESET_REDUX_STATE' });
}

export default {
  setUser,
  setLocalData,
  setSearchData,
  setFavoritesData,
  setChatData,
  setApiToken,
  saveState,
  loadStateAsync,
  clearStorage,
  deleteUser
};
