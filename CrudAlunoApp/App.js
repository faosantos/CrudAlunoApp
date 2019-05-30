// import React from 'react';
// import { StyleSheet, Text, View } from 'react-native';

// export default class App extends React.Component {
//   render() {
//     return (
//       <View style={styles.container}>
//         <Text>Testando o AppAluno!</Text>
//         <Text>varias tentativas</Text>
//       </View>
//     );
//   }
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
// });



import React from 'react';
import { AsyncStorage } from 'react-native';
import { Root as NBRoot, StyleProvider } from 'native-base';
import { Font, ScreenOrientation } from 'expo';
import { Provider as ReduxProvider } from 'react-redux';
import { store, connect, states, actions } from './src/redux';

import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import FontAwesome from '@expo/vector-icons/FontAwesome';

import getTheme from './native-base-theme/components';
import theme from './native-base-theme/variables/commonColor';

import AppContainer from './src/screens';


class App extends React.Component {

  state = {
    loading: true
  }

  async componentWillMount() {
    try {
      await Font.loadAsync({
        'Roboto': require('native-base/Fonts/Roboto.ttf'),
        'Roboto_medium': require('native-base/Fonts/Roboto_medium.ttf'),
        ...Ionicons.font,
        ...MaterialCommunityIcons.font,
        ...FontAwesome.font
      });

      await ScreenOrientation.allowAsync(ScreenOrientation.Orientation.PORTRAIT);
      //await AsyncStorage.clear();
      await this.props.reduxActions.loadStateAsync();

      this.setState({ loading: false });
    } catch (error) {
      console.error(error);
    }

  }

  render() {
    if (this.state.loading) {
      return (null)
    }

    return (
      <StyleProvider style={getTheme(theme)}>
        <AppContainer />
      </StyleProvider>
    );
  }

}

App = connect(states, actions)(App);

export default class Root extends React.Component {
  render() {
    return (
      <NBRoot>
        <ReduxProvider store={store}>
          <App />
        </ReduxProvider>
      </NBRoot>
    );
  }
}







