import React from 'react';
import { Modal } from 'react-native';
import { Spinner, View, Title } from 'native-base';

import theme from '../../../native-base-theme/variables/commonColor';


export default SpinnerModal = (props) => {
  return (
    <Modal
      visible={props.visible}
      presentationStyle='overFullScreen'
      transparent={true}
      onRequestClose={()=>{}}
    >
      <View
        style={{
          height: '100%',
          width: '100%',
          alignSelf: 'center',
          justifyContent: 'center',
          alignContent: 'center',
          backgroundColor: 'rgba(0.2, 0.2, 0.2, 0.8)'
        }}
      >
        <Spinner />
        <Title>{props.message}</Title>
      </View>

    </Modal>
  )
};




