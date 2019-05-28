import React from 'react';

import { FlatList } from 'react-native';

import {
  Container,
  Fab,
  View,
  Spinner,
  Subtitle,
} from 'native-base';

import theme from '../../../native-base-theme/variables/commonColor';
import { Icon, UserCard, SearchBar } from '../comps'
import { server } from '../../apis';

const statesCitiesAddrs = require('../../lib/states_cities_addrs.json');



export default class SearchScreen extends React.Component {
  constructor(props) {
    super(props);
    this.initState = {
      loading: false,
      showFab: false,
      isRefreshing: false,
      searchCount: 0
    };
    this.state = this.initState;
  }


  async componentDidMount() {
    await this.init();
  }

  init = async () => {
    this.setState(this.initState);
  }

  fetchSearchData = async (address) => {
    if (!this._fetchSearchLock) {
      this._fetchSearchLock = true;
      this.setState({ loading: true, showFab: false });
      const searchData = await server.get('searchFeed', {
        address: address
      });
      this.props.reduxActions.setSearchData(searchData);
      this.setState({ loading: false, searchCount: this.state.searchCount + 1 });
      this._fetchSearchLock = false;
    }
  }

  onSelectedAddress = async (index, value) => {
    console.debug(`searchScreen: GOT ${index}, ${value}`);
    this.fetchSearchData(value);
  }

  onSelectAddressCancel = () => {
    console.debug("searchScreen: CANCELLED");
  }

  onRefresh = async () => {
    if (!this._actionLock) {
      this._actionLock = true;
      this.setState({ isRefreshing: true });
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

  renderItem = ({ item }) => {
    return <UserCard user={item} navigation={this.props.navigation} />
  }

  keyExtractor = (item, idx) => {
    return idx.toString()
  }

  emptyListComponent = () => {
    return (
      <View>
        {
          this.state.searchCount ? (
            <Subtitle>
              Não encontramos perfis do seu interesse neste endereço...
          </Subtitle>
          ) : (
              <Subtitle>
                Utilize a barra de procura acima
            </Subtitle>
            )
        }
      </View>
    )
  }

  render() {

    return (
      <Container>
        <SearchBar
          confirmButton={true}
          options={statesCitiesAddrs}
          onOptionSelected={this.onSelectedAddress}
          onCancel={this.onSelectAddressCancel}
          placeholder='Pesquisar Cidade'
          buttonText='Ir'
        />

        {
          this.state.loading ? (
            <Spinner />
          )
            : (
              <FlatList
                ref={(ref) => this.completedFL = ref}
                onRefresh={this.onRefresh}
                refreshing={this.state.isRefreshing}
                onScroll={this.onScroll}
                scrollEventThrottle={400}
                data={this.props.reduxStates.searchData}
                renderItem={this.renderItem}
                ListFooterComponent={<View style={{ width: '100%', marginTop: 86 }} />}
                ListEmptyComponent={this.emptyListComponent}
                keyExtractor={this.keyExtractor}
              />
            )
        }


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




