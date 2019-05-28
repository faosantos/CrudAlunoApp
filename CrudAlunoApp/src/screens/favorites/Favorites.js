import React, { Component } from 'react';
import { FlatList, View, Dimensions, RefreshControl } from 'react-native';
import { Fab, Content, Container, Spinner, Title, Button, Text } from 'native-base';
import theme from '../../../native-base-theme/variables/commonColor';
import { Icon, UserCard, ErrorComponent } from '../comps'
import { server } from '../../apis';

export default class FavoriteScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      error: false,
      refreshing: false,
      showFab: false
    };
  }

  loadFavs = async () => {
    this.setState({ refreshing: true });
    const favorites = await server.get('favoritesFeed');
    console.debug("favorites: ", favorites);
    if (favorites.error) {
      this.setState({ loading: false, error: true, refreshing: false });
    } else {
      this.setState({ loading: false, error: false, refreshing: false });
      this.props.reduxActions.setFavoritesData(favorites);
    }
  }

  componentWillMount() {
    this.loadFavs();
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
    return (
      <UserCard
        user={item}
        navigation={this.props.navigation}
        toggleFavorite={this.props.reduxActions.toggleFavorite}
      />
    )
  }

  keyExtractor = (item, idx) => {
    return idx.toString();
  }


  onRefresh = async () => {
    if (!this._actionLock) {
      this._actionLock = true;
      this.setState({ refreshing: true });
      await this.loadFavs();
      this.setState({ refreshing: false });
      this._actionLock = false;
    }
  }

  errorComp = () => {
    return (
      <ErrorComponent
        type={this.state.error ? "ERROR" : "NOFAV"}
      />
    );
  }


  renderLoading() {
    return (
      <Container>
        <Content contentContainerStyle={{ flex: 1, justifyContent: 'center' }}>
          <Spinner style={{ alignSelf: 'center' }} />
        </Content>
      </Container>
    )
  }

  renderContent() {
    return (
      <Container>
        <FlatList
          extraData={this.state}
          ref={(ref) => this.completedFL = ref}
          onScroll={this.onScroll}
          scrollEventThrottle={400}
          ListEmptyComponent={this.errorComp}
          data={this.props.reduxStates.favoritesData}
          renderItem={this.renderItem}
          keyExtractor={this.keyExtractor}
          onRefresh={this.onRefresh}
          contentContainerStyle={{ paddingBottom: 80 }}
          refreshing={this.state.refreshing}
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

  render() {
    return (
      this.state.loading ?
        this.renderLoading() :
        this.renderContent()
    );
  }

}
