import React from 'react';
import { Alert } from 'react-native';
import {
  Container,
  Content,
  Thumbnail,
  Button,
  Title,
  Subtitle,
  ActionSheet
} from 'native-base';

import { Grid, Row } from 'react-native-easy-grid';


import { Icon, ImageGrid } from '../comps';
import { showToast } from './../../lib'

import theme from '../../../native-base-theme/variables/commonColor';
import { server } from '../../apis';




export default class OtherProfile extends React.PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      user: this.props.navigation.getParam('user')
    }
  }
  goOn = async () => {
    showToast("Bloqueando...", 'warning')
    let user = this.state.user;
    this.props.reduxActions.deleteUser(user);
    let conf = await server.get(`block/add/${user.id}`);
    if (conf.success) {
      showToast('Bloqueado', 'success')
    }
    this.props.navigation.goBack();
  }
  blockUser = () => {
    Alert.alert(
      'Tem certeza?',
      `Deseja bloquear este usuário? Ao prosseguir você impedirá que 
    este usuário lhe encontre no feed, favoritos ou pesquisar.`, [
        { text: 'Continuar', onPress: () => this.goOn() },
        { text: 'Não', style: 'cancel' }
      ])
  }
  flagUser = () => {
    const BUTTONS = [
      'Violação dos termos',
      'Abuso verbal',
      'Não acho que deveria estar aqui',
      'CANCELAR'
    ]
    ActionSheet.show({
      options: BUTTONS,
      cancelButtonIndex: 3,
      title: "Reportar abuso:"
    }, bid =>{
      if(bid!=3){
        Alert.alert(
          'Abuso reportado.',
          'Gostaria de bloquear o usuário enquanto analisamos o caso?',
          [
            { text:'Sim', onPress: ()=> this.goOn() },
            { text:'Não', style:'cancel' }
          ]
        )
      }
    });
  }

  render() {
    return (
      <Container>
        <Content contentContainerStyle={{ flex: 1 }} >

          <Grid>

            <Row style={{ height: 'auto', flex: 0, backgroundColor: theme.appColors.secondaryDark, alignItems: 'center', padding: 8, flexDirection: 'column' }}>
              <Thumbnail large source={{ uri: this.state.user.avatar }} />
              <Title>{this.state.user.name}</Title>
              <Subtitle>{this.state.user.age} anos</Subtitle>
              <Subtitle>{this.state.user.about}</Subtitle>
            </Row>

            <Row style={{ height: 'auto', flex: 0, justifyContent: 'space-between', margin: 8 }}>
              <Button transparent>
                <Icon name="chat" />
              </Button>
              <Button transparent onPress={this.flagUser}>
                <Icon name="flag" />
              </Button>
              <Button transparent onPress={this.blockUser}>
                <Icon name="block"/>
              </Button>
            </Row>

            <Row>
              <ImageGrid
                navigation={this.props.navigation}
                images={this.state.user.images}
              />
            </Row>

          </Grid>

        </Content>
      </Container>
    );
  }
}


const styles = {
};

