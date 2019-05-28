import { connect } from 'react-redux';
import actions from './actions';

const mapActionsToProps = (dispatch) => {
  const reduxActions = {};
  for (let k in actions) {
    reduxActions[k] = function (data) {
      dispatch(actions[k](data));
    }
  }
  return { reduxActions };
}

const mapStatesToProps = (state) => {
  return {
    reduxStates: state
  }
}

export {
  connect,
  mapActionsToProps as actions,
  mapStatesToProps as states
}
