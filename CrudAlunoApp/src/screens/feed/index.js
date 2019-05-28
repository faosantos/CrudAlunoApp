import React from 'react';

import { connect, states, actions } from '../../redux';

import FeedScreen from './FeedScreen';

const feedRoutes = connect(states, actions)(FeedScreen);

export {
  feedRoutes
}




