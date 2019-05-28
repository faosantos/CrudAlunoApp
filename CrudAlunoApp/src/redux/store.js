import { createStore } from 'redux';



const INITIAL_STATE = {
  user: null,
  apiToken: null,
  localData: [],
  searchData: [],
  favoritesData: [],
  chatData: []
};

const reducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case "SET_REDUX_STATE":
      state = { ...state, ...action.data };
      break;
    case 'RESET_REDUX_STATE':
      state = INITIAL_STATE;
      break;
  }
  return state;
};

const store = createStore(reducer);

export {
  store
}

