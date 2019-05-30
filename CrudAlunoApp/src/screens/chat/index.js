import React from 'react';

import { createStackNavigator } from 'react-navigation';
import { connect, states, actions } from '../../redux';

import ChatList from './ChatList';

const chatRoutes = connect(states, actions)(ChatList);

export {
  chatRoutes
}




