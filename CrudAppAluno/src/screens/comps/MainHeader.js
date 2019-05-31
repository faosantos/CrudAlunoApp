import React from 'react';
import { Constants } from 'expo';

import { Image } from 'react-native';
import {
  Header,
  Left,
  Right,
  Body,
  Button,
  Subtitle,
  View,
  Container
} from 'native-base';

import { Grid, Col, Row } from 'react-native-easy-grid';

import Icon from './Icon';

import theme from '../../../native-base-theme/variables/commonColor';

import { StackActions } from 'react-navigation';

const popAction = StackActions.pop({
  n: 1,
});


const logoWide = require('../../../assets/logo_wide_small.png');


export default MainHeader = (props) => {
  return (
    <Grid style={styles.header}>
      <Row style={{ justifyContent: 'space-between', width: '100%' }}>
        <Col style={{ width: '30%', height: '100%' }}>
          {
            props.canGoBack && (
              <Button
                transparent
                onPress={() => props.navigation.dispatch(popAction)}
              >
                <Icon name="arrow-back" />
              </Button>
            )
          }
        </Col>

        <Image
          source={logoWide}
          style={styles.image}
        />

        <Col style={{ width: '30%', height: '100%' }}>
        </Col>

      </Row>
    </Grid>

  );
}


const styles = {
  header: {
    height: 48 + Constants.statusBarHeight,
    backgroundColor: theme.appColors.primaryDark,
    paddingTop: Constants.statusBarHeight,
    width: '100%'
  },
  image: {
    resizeMode: 'contain',
    alignSelf: 'center',
    width: '40%',
    height: 48
  }
}



