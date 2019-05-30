import { connect } from 'react-redux';
import { createStore } from 'redux';
import actions from './actions';


const INITIAL_STATE = {
  user: null,
  apiToken: null,
  usersObjects: [],
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

const mapActionsToProps = (dispatch) => {
  const reduxActions = {};
  for (let k in actions)
    reduxActions[k] = actions[k].bind(actions[k], dispatch, store);
  return { reduxActions };
}

const mapStatesToProps = (state) => {
  return {
    reduxStates: state
  }
}

export {
  store,
  connect,
  mapActionsToProps as actions,
  mapStatesToProps as states
}

