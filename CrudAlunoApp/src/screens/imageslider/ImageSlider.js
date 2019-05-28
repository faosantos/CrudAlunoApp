import React from 'react';
import {
  Text,
  Button,
  Title,
  Container,
  Content,
  View
} from 'native-base';

import { ScreenOrientation } from 'expo';


import theme from '../../../native-base-theme/variables/commonColor';

import ImageViewer from 'react-native-image-zoom-viewer';


export default class ImageSlider extends React.PureComponent {

  constructor(props) {
    super(props);

    let imageUrls = props.navigation.getParam('imageUrls', null);
    const images = props.navigation.getParam('images', []);
    const imageIndex = props.navigation.getParam('imageIndex', 0);


    if (imageUrls == null) {
      imageUrls = images.map((i) => ({ url: i }));
    }

    this.state = {
      imageUrls: imageUrls,
      imageIndex: imageIndex,
      key: 0
    };

  }

  renderSliderIndicator(currentIndex, allSize) {
    return (
      <View style={styles.count}>
        <Text style={styles.countText}>{currentIndex} / {allSize}</Text>
      </View>
    )
  }

  async componentWillMount() {
    await ScreenOrientation.allowAsync(ScreenOrientation.Orientation.ALL);

  }


  async componentWillUnmount() {
    await ScreenOrientation.allowAsync(ScreenOrientation.Orientation.PORTRAIT);
  }

  onClose = () => {
    ScreenOrientation.allowAsync(ScreenOrientation.Orientation.PORTRAIT)
      .then(this.props.navigation.goBack);
  }

  onLayout = () => {
    this.setState({ key: this.state.key + 1 });
  }

  render() {
    return (
      <Container>
        <Content contentContainerStyle={styles.container}>
          {
            this.state.imageUrls.length > 0 ? (
              <ImageViewer
                backgroundColor={theme.appColors.primaryDark}
                imageUrls={this.state.imageUrls}
                index={this.state.imageIndex}
                renderIndicator={this.renderSliderIndicator}
                saveToLocalByLongPress={false}
                enableSwipeDown={true}
                onCancel={this.onClose}
              />) : (
                <View>
                  <Title>Nenhuma imagem para mostrar...</Title>
                  <Button style={styles.button} onPress={this.onClose}>
                    <Title>Voltar</Title>
                  </Button>
                </View>
              )
          }
        </Content>
      </Container>

    );
  }
}




const styles = {
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: theme.appColors.primaryDark,
    justifyContent: 'center',
    alignSelf: 'center'
  },
  image: {
    width: '100%', height: '100%'
  },
  button: {
    alignSelf: 'center'
  },
  count: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 38,
    zIndex: 13,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent'
  },
  countText: {
    color: theme.appColors.highlight,
    fontSize: 16,
    backgroundColor: 'transparent',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: {
      width: 0.8,
      height: 0.8
    },
    textShadowRadius: 0
  }
}
