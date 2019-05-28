import React from 'react';

import { createStackNavigator } from 'react-navigation';
import { connect, states, actions } from '../../redux';

import ChatList, { ChatMessenger } from './ChatList';

const chatRoutes = connect(states, actions)(ChatList);
const chatMessengerRoutes = connect(states, actions)(ChatMessenger);

export {
  chatRoutes,
  chatMessengerRoutes
}




