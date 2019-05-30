import React from 'react';

import { FlatList } from 'react-native';

import {
  Container,
  Content,
  Fab,
  View,
  Spinner,
  Text,
  Subtitle,
  Button
} from 'native-base';

import theme from '../../../native-base-theme/variables/commonColor';
import { Icon, UserCard, SearchBar } from '../comps'
import { server } from '../../apis';
import { geocode, showAlert } from '../../lib';

const statesCitiesAddrs = require('../../lib/states_cities_addrs.json');



export default class FeedScreen extends React.Component {
  constructor(props) {
    super(props);
    this.initState = {
      loading: true,
      showFab: false,
      isRefreshing: false,
      noLocation: false,
      selectingAddress: false
    };
    this.state = this.initState;
  }


  async componentDidMount() {
    await this.init();
  }

  init = async () => {
    this.setState(this.initState);
    const location = await geocode.getCurrentPositionAsync();

    if (location) {
      this.fetchFeed();
    } else {
      this.setState({ noLocation: true });
    }
    this.setState({ loading: false });

  }

  fetchFeed = async () => {
    const localData = await server.get('localFeed');
    this.props.reduxActions.setLocalData(localData);
  }

  onSelectedAddress = async (index, value) => {
    console.debug(`GOT ${index}, ${value}`);
    this.setState({ loading: true });
    const resp = await server.patch('setLocation', { address: value });
    if (resp.error) {
      showAlert(resp.error);
    } else {
      this.setState({ selectingAddress: false, noLocation: false });
      await this.fetchFeed();
    }

    this.setState({ loading: false });
  }

  onSelectAddressCancel = () => {
    this.setState({ selectingAddress: false })
  }

  onRefresh = async () => {
    if (!this._actionLock) {
      this._actionLock = true;
      this.setState({ isRefreshing: true });
      await this.fetchFeed();
      this.setState({ isRefreshing: false });
      this._actionLock = false;
    }
  }

  onScroll = (event) => {
    if (this.state.showFab && event.nativeEvent.contentOffset.y < 100) {
      this.setState({ showFab: false });
    } else if (!this.state.showFab && event.nativeEvent.contentOffset.y >= 100) {
      this.setState({ showFab: true });
    }
  }

  scrollToTop = () => {
    this.completedFL.scrollToIndex({
      animated: true,
      index: 0,
      viewOffset: 0,
      viewPosition: 0
    });
  }

  keyExtractor = (item, idx) => {
    return idx.toString();
  }

  renderItem = ({ item }) => {
    return (
      <UserCard
        user={item}
        navigation={this.props.navigation}
        toggleFavorite={this.props.reduxActions.toggleFavorite}
      />
    );
  }

  render() {

    if (this.state.loading) {
      return (
        <Container>
          <Content contentContainerStyle={{ flex: 1, justifyContent: 'center' }}>
            <Spinner style={{ alignSelf: 'center' }} />
          </Content>
        </Container>
      );
    }

    if (this.state.selectingAddress) {
      return (
        <SearchBar
          options={statesCitiesAddrs}
          onOptionSelected={this.onSelectedAddress}
          onCancel={this.onSelectAddressCancel}
          placeholder='Pesquisar Cidade'
        />
      );
    }

    if (this.state.noLocation) {
      return (
        <Container >
          <Content contentContainerStyle={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Subtitle>Não foi possível registrar sua localização por GPS</Subtitle>
            <Subtitle>Verifique as configurações do seu telefone</Subtitle>
            <Button rounded onPress={this.init} style={{ margin: 4, alignSelf: 'center' }}>
              <Text> Tentar Novamente </Text>
            </Button>
            <Button rounded onPress={() => this.setState({ selectingAddress: true })} style={{ margin: 4, alignSelf: 'center' }}>
              <Text> Registrar Cidade </Text>
            </Button>
          </Content>
        </Container>
      );
    }




    return (
      <Container>

        <FlatList
          ref={(ref) => this.completedFL = ref}
          onRefresh={this.onRefresh}
          refreshing={this.state.isRefreshing}
          onScroll={this.onScroll}
          scrollEventThrottle={400}
          data={this.props.reduxStates.localData}
          renderItem={this.renderItem}
          ListFooterComponent={<View style={{ width: '100%', marginTop: 86 }} />}
          keyExtractor={this.keyExtractor}
        />

        {
          this.state.showFab && (
            <Fab
              active={this.state.showFab}
              style={{ backgroundColor: theme.appColors.primaryDark }}
              position="bottomRight"
              onPress={this.scrollToTop}
            >
              <Icon
                name="arrow-up"
                style={{ color: theme.appColors.highlight }}
              />
            </Fab>
          )
        }


      </Container>
    );
  }
}




