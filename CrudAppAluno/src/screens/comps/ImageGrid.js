import React from 'react';
import { Image, FlatList, TouchableOpacity, RefreshControl } from 'react-native';


import theme from '../../../native-base-theme/variables/commonColor';



export class ImageGrid extends React.Component {
  static defaultProps = {
    images: [],
    refresh: false
  }
  state = {
    imageUrls: this.props.images.map((i) => ({ url: i })),
    refresh: this.props.refresh
  };

  renderItem = ({ item, index }) => {
    return (
      <TouchableOpacity
        key={index}
        style={styles.button}
        onPress={() => {
          this.props.navigation.navigate('ImageSlider', {
            imageUrls: this.state.imageUrls,
            imageIndex: index
          });
        }}
        onLongPress={() => this.props.onLongPress(item.url)}
      >
        <Image
          style={styles.image}
          source={{ uri: item.url, cache: 'force-cache' }}
        />
      </TouchableOpacity>
    )
  }

  extractKey = (item, idx) => {
    return idx.toString();
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ imageUrls: nextProps.images.map((i) => ({ url: i })) });
  }

  render() {
    return (
      <FlatList
        data={this.state.imageUrls}
        extraData={this.state}
        renderItem={this.renderItem}
        keyExtractor={this.extractKey}
        scrollEnabled={false}
        numColumns={3}
      />
    );
  }
}


const styles = {
  image: {
    width: '100%', height: '100%'
  },
  button: {
    width: '33.3%', height: 86, padding: 2
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