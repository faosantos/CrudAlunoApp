import React from 'react';

import { connect, states, actions } from '../../redux';

import MyProfile from "./MyProfile";
import OtherProfile from "./OtherProfile";
import { MainHeader } from '../comps';

const myProfileRoutes = connect(states, actions)(MyProfile);
const otherProfileRoutes = connect(states, actions)(OtherProfile);

export {
  myProfileRoutes,
  otherProfileRoutes
}




