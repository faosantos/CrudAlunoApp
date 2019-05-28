import React from 'react';
import { createStackNavigator } from 'react-navigation';

import { connect, states, actions } from '../../redux';

import LoginScreen from "./LoginScreen";
import RegisterScreen from "./RegisterScreen";

const authRoutes = createStackNavigator(
  {
    Login: connect(states, actions)(LoginScreen),
    Register: connect(states, actions)(RegisterScreen)
  },
  {
    headerMode: 'none'
  }
);

export {
  authRoutes
};




