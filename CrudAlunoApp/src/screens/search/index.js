import React from 'react';

import { connect, states, actions } from '../../redux';

import SearchScreen from './SearchScreen';

const searchRoutes = connect(states, actions)(SearchScreen);

export {
  searchRoutes
}




