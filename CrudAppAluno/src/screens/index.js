import React from 'react';
import { Text, Subtitle } from 'native-base';
import { createBottomTabNavigator, createStackNavigator, createSwitchNavigator, createAppContainer } from 'react-navigation';



import theme from '../../native-base-theme/variables/commonColor';
import { feedRoutes } from './feed';
import { searchRoutes } from './search';
import { authRoutes } from './auth';
import { favoritesRoutes } from './favorites';
import { myProfileRoutes, otherProfileRoutes } from './profile'
import { Icon, MainHeader } from './comps';
import { imageSliderRoutes } from './imageslider';
import { chatRoutes } from './chat';

const bottomTabNavigator = createBottomTabNavigator(
  {
    Feed: feedRoutes,
    Search: searchRoutes,
    Favorites: favoritesRoutes,
    Chat: chatRoutes,
    Profile: myProfileRoutes
  },
  {

    tabBarOptions: {
      activeTintColor: theme.appColors.highlight,
      activeBackgroundColor: theme.appColors.primaryDark,
      inactiveBackgroundColor: theme.appColors.primaryDark
    },

    defaultNavigationOptions: (props) => ({
      tabBarLabel: ({ focused, horizontal, tintColor }) => {
        const { routeName } = props.navigation.state;
        const labels = {
          Feed: 'Local',
          Search: 'Procurar',
          Favorites: 'Favoritos',
          Chat: 'Chat',
          Profile: 'Perfil'
        };
        return <Subtitle style={{ color: tintColor, alignSelf: 'center' }}>{labels[routeName]}</Subtitle>;
      },

      tabBarIcon: ({ focused, horizontal, tintColor }) => {
        const { routeName } = props.navigation.state;
        const icons = {
          Feed: 'feed',
          Search: 'search',
          Favorites: 'heart',
          Chat: 'chat',
          Profile: 'profile'
        };
        return (<Icon name={icons[routeName]} style={{ color: tintColor }} />);
      }

    })
  }
);


const mainRoutes = createStackNavigator(
  {
    BottomTabNavigator: bottomTabNavigator,
    OtherProfile: otherProfileRoutes,
    ImageSlider: imageSliderRoutes
  },
  {
    headerMode: 'float',
    defaultNavigationOptions: (props) => {
      if (props.navigation.state.routeName == 'BottomTabNavigator' ||
        props.navigation.state.routeName == 'OtherProfile') {
        let auxRoutes = props.navigation.state.routes;
        let auxIndex = props.navigation.state.index;
        let canGoBack = false;
        if (auxRoutes == undefined || auxIndex == undefined) {
          canGoBack = true;
        } else {
          while (auxRoutes != undefined && auxIndex != undefined && auxRoutes[auxIndex].index != undefined) {
            if (auxRoutes[auxIndex].index != 0) {
              canGoBack = true;
              break;
            } else {
              const nextState = auxRoutes[auxIndex];
              auxRoutes = nextState.routes;
              auxIndex = nextState.index;
            }
          }
        }

        return {
          header: <MainHeader canGoBack={canGoBack} {...props} />
        }
      } else {
        return { header: (null) }
      }
    }
  }
);

const rootNavigator = createSwitchNavigator(
  {
    Auth: authRoutes,
    Main: mainRoutes
  }
);

export default createAppContainer(rootNavigator);



