import React from 'react';

import { createStackNavigator } from 'react-navigation';
import { connect, states, actions } from '../../redux';

import FavoriteScreen from './Favorites';

const favoritesRoutes = connect(states, actions)(FavoriteScreen);

export {
  favoritesRoutes
}




