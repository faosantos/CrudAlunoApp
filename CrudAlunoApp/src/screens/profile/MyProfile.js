import React from 'react';

import { AsyncStorage } from 'react-native';

import {
  Container,
  Content,
  Thumbnail,
  Button,
  Title,
  Subtitle,
  View
} from 'native-base';

import { Avatar } from 'react-native-elements';

import { Grid, Row } from 'react-native-easy-grid';


import { Icon, ImageGrid, SpinnerModal } from '../comps';

import theme from '../../../native-base-theme/variables/commonColor';

import { showAlert, imageManager } from '../../lib';

import { server } from '../../apis';



export default class MyProfile extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      loggingOut: false,
      uploadingImage: false,
      keyActualize: 0
    }
  }



  onLogout = () => {

    showAlert(
      'Você realmente deseja sair?',
      'Logout',
      () => {
        this.setState({ loggingOut: true });
        this.props.reduxActions.clearStorage();
        this.props.navigation.navigate('Auth');
      }
    );

  }

  uploadImage = async (isAvatar = false) => {
    const img = await imageManager.askUserForImage();
    if (img && !img.cancelled) {
      console.debug("IMG: ", img);
      this.setState({ uploadingImage: true, refresh: true });
      const resp = await server.post('uploadImage', {
        isAvatar,
        image64: img.base64,
        extension: img.uri.split('.').pop()
      });
      this.setState({ uploadingImage: false });
      return resp;
    } else {
      return { cancelled: true };
    }
  }

  addImageToGallery = async () => {
    const resp = await this.uploadImage(false);
    if (resp.error != undefined) {
      showAlert(resp.error);
    } else {
      let user = this.props.reduxStates.user;
      user.images.push(resp.newImagePath);
      this.props.reduxActions.setUser(user);
      this.props.reduxActions.saveState();
      this.setState({ keyActualize: this.state.keyActualize + 1 });
    }
  }

  onImgLongPress = async (path) => {
    showAlert(
      'Você realmente deseja apagar esta imagem?',
      'Atenção',
      async () => {
        const resp = await server.del("deleteImage", {
          path: path
        });
        if (!resp.error) {
          let images = this.props.reduxStates.user.images;
          images.splice(images.indexOf(path), 1);
          let user = this.props.reduxStates.user;
          user.images = images;
          this.props.reduxActions.setUser(user);
          this.props.reduxActions.saveState();
          this.setState({ images });
          this.setState({ keyActualize: this.state.keyActualize + 1 });
        }
      }
    );
  }

  changeAvatar = async () => {
    const resp = await this.uploadImage(true);
    if (resp.error) {
      showAlert(resp.error);
    } else {
      let avatar = resp.newImagePath;
      let user = this.props.reduxStates.user;
      let act = this.props.reduxActions;
      user.avatar = avatar;
      act.setUser(user);
      act.saveState();
    }
  }

  render() {
    if (this.state.loggingOut)
      return <Container />

    return (
      <Container>
        <SpinnerModal
          visible={this.state.uploadingImage}
          message='Carregando foto'
        />
        <Content>

          <Grid>

            <Row style={{ height: 'auto', flex: 0, backgroundColor: theme.appColors.secondaryDark, alignItems: 'center', padding: 8, flexDirection: 'column' }}>

              <Avatar
                size="large"
                rounded
                showEditButton
                onEditPress={this.changeAvatar}
                editButton={{ color: theme.appColors.highlight }}
                source={{ uri: this.props.reduxStates.user.avatar }}
              />

              <Title>{this.props.reduxStates.user.name}</Title>
              <Subtitle>{this.props.reduxStates.user.age} anos</Subtitle>
              <Subtitle>{this.props.reduxStates.user.about}</Subtitle>
            </Row>

            <Row style={{ height: 'auto', flex: 0, justifyContent: 'space-between', margin: 8 }}>
              <Button transparent onPress={this.addImageToGallery}>
                <Icon name="camera" />
              </Button>
              <Button transparent>
                <Icon name="settings" />
              </Button>
              <Button transparent onPress={this.onLogout}>
                <Icon name="log-out" />
              </Button>
            </Row>

          </Grid>


          <ImageGrid
            onLongPress={this.onImgLongPress}
            navigation={this.props.navigation}
            images={this.props.reduxStates.user.images}
            refresh={this.state.uploadingImage}
          />

        </Content>
      </Container>
    );
  }
}


const styles = {
};

