import React from 'react';
import { Image } from 'react-native';
import {
  Card,
  CardItem,
  Right,
  Title,
  Subtitle,
  Button
} from 'native-base';
import { Row, Grid } from 'react-native-easy-grid';
import Icon from './Icon';
import { server } from '../../apis';
import { connect, states, actions } from '../../redux';

class UserCard extends React.PureComponent {
  state = {
    imgKey: 0
  }

  onLoadImageError = ({ nativeEvent: { error } }) => {
    console.debug("Error loading image for user_id: ", this.props.user.id);
    if (this.state.imgKey < 10) {
      this.setState({ imgKey: this.state.imgKey + 1 });
    }
  }

  onLoadImage = () => {
    console.debug("LOADING IMAGE FOR USER: ", this.props.user.id);
  }

  gotoProfile = () => {
    this.props.navigation.navigate("OtherProfile", { user: this.props.user });
  }

  showPhotoSlider = () => {
    this.props.navigation.navigate('ImageSlider', {
      images: this.props.user.images
    })
  }

  favorite = async () => {
    let user = this.props.user;
    let favData = this.props.reduxStates.favoritesData;

    if (user.fav == true) {
      favData.splice(favData.indexOf(user), 1);
      user.fav = false;
      server.get('fav/remove/' + user.id);
    } else {
      user.fav = true;
      favData.push(user);
      server.get('fav/add/' + user.id);
    }

    this.props.reduxActions.setFavoritesData(favData);

  }

  render() {
    const props = this.props;
    return (
      <Card>
        <CardItem header bordered>
          <Grid>
            <Row style={{ alignItems: 'center' }}>
              <Icon name={props.user.sex} />
              <Title>{props.user.name}, {props.user.age}</Title>
            </Row>
            <Row style={{ alignItems: 'center' }}>
              <Icon name="pin" />
              <Subtitle>{props.user.distance} km</Subtitle>
            </Row>
          </Grid>

          <Right>
            <Button transparent onPress={this.favorite}>
              <Icon name={this.props.user.fav ? "heart" : "heart-empty"} style={{ fontSize: 32 }} />
            </Button>
          </Right>
        </CardItem>
        <CardItem cardBody>
          <Image
            key={this.state.imgKey}
            source={{ uri: props.user.avatar, cache: 'force-cache' }}
            style={{ width: '100%', height: 200, resizeMode: 'cover' }}
            onError={this.onLoadImageError}
            onLoad={this.onLoadImage}
            resizeMethod='resize'
          />
        </CardItem>
        <CardItem footer bordered style={{ justifyContent: 'space-between' }}>

          <Button transparent onPress={this.showPhotoSlider}>
            <Icon name="photos" />
          </Button>
          <Button transparent>
            <Icon name="chat" />
          </Button>
          <Button transparent onPress={this.gotoProfile}>
            <Icon name="profile" />
          </Button>


        </CardItem>
      </Card>
    );
  }
}

export default connect(states, actions)(UserCard);
