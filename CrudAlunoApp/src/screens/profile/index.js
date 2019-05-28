import React from 'react';

import { connect, states, actions } from '../../redux';

import MyProfile from "./MyProfile";
import OtherProfile from "./OtherProfile";
import { MainHeader } from '../comps';
import MenuScreen from './ConfigMenu';
import PasswordRedefine from './PasswordRedefine';

const myProfileRoutes = connect(states, actions)(MyProfile);
const settingsScreen = connect(states, actions)(MenuScreen);
const otherProfileRoutes = connect(states, actions)(OtherProfile);
const passwordRedefine = connect(states, actions)(PasswordRedefine);

export {
  myProfileRoutes,
  otherProfileRoutes,
  settingsScreen,
  passwordRedefine
}




