import React, { Component } from 'react';
import { ImageBackground, Image } from 'react-native';
import { Container, Label, Content, Form, Item, Input, Button, Text, Spinner } from 'native-base';
import { server } from '../../apis';
import { showToast } from '../../lib';

const bkgImageSource = require('../../../assets/bkg_girls.png');
const logoWideWhite = require('../../../assets/logo_wide_white.png');

export default class LoginScreen extends Component {

  state = {
    loading: true,
    email: '',
    password: ''
  }

  async componentWillMount() {
    const resp = await server.get('apiTokenCheck');

    if (resp.authenticated) {
      this.props.reduxActions.setUser(resp.user);
      this.props.reduxActions.saveState();
      return this.props.navigation.navigate('BottomTabNavigator');
    }

    this.setState({ loading: false });
  }

  onSubmit = async () => {
    this.setState({ loading: true });
    const { email, password } = this.state;

    const resp = await server.post('login', { email, password });


    if (resp.authenticated) {
      this.props.reduxActions.setUser(resp.user);
      this.props.reduxActions.setApiToken(resp.apiToken);
      this.props.reduxActions.saveState();
      return this.props.navigation.navigate('BottomTabNavigator');
    } else if (resp.error) {
      showToast(resp.error, 'warning');
    }

    this.setState({ loading: false });
  }

  onRegisterButton = async () => {
    this.props.navigation.navigate("Register");
  }

  onEmailChangeText = (newText) => {
    this.setState({ email: newText })
  }
  onPasswordChangeText = (newText) => {
    this.setState({ password: newText });
  }

  render() {
    return (
      <Container>
        <Content contentContainerStyle={styles.content}>

          <ImageBackground source={bkgImageSource} style={styles.imageBackground}>

            <Image source={logoWideWhite} style={styles.image} />

            <Form style={styles.form}>
              <Item floatingLabel>
                <Label style={styles.label}>E-Mail</Label>
                <Input
                  selectionColor='white'
                  autoCapitalize='none'
                  textContentType='emailAddress'
                  keyboardType='email-address'
                  onChangeText={this.onEmailChangeText}
                  style={styles.input}
                />
              </Item>
              <Item floatingLabel>
                <Label style={styles.label}>Senha</Label>
                <Input
                  selectionColor='white'
                  autoCapitalize='none'
                  textContentType='password'
                  secureTextEntry={true}
                  onChangeText={this.onPasswordChangeText}
                  style={styles.input}
                />
              </Item>
            </Form>

            <Button full rounded style={styles.button} onPress={this.onSubmit} disabled={this.state.loading}>
              {
                this.state.loading ? <Spinner small /> : <Text>Entrar</Text>
              }
            </Button>

            <Button full rounded style={styles.button} onPress={this.onRegisterButton} disabled={this.state.loading}>
              <Text>Cadastre-se</Text>
            </Button>

          </ImageBackground>

        </Content>
      </Container>
    );
  }
}


const styles = {
  content: {
    width: '100%',
    height: '100%'
  },
  imageBackground: {
    flex: 1
  },

  image: {
    width: '95%',
    height: '20%',
    marginTop: '20%',
    alignSelf: 'center'
  },

  form: {
    width: '85%',
    alignSelf: 'center',
    marginBottom: 10
  },

  input: {
    color: 'white',
  },

  label: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18
  },

  button: {
    width: '87%',
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 6
  }

};

