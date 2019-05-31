import React, { Component } from 'react';

import {
  KeyboardAvoidingView,
  Text,
  View,
  BackHandler,
  ActivityIndicator,
  Platform,
  Dimensions,
  Animated,
  Keyboard,
  StyleSheet,
  WebView
} from 'react-native';

import { Constants } from 'expo';

import {
  Container,
  Button,
  Form,
  Item,
  Label,
  Input,
  ListItem,
  Textarea,
  Radio,
  Title,
  Subtitle,
  DatePicker,
  Left,
  Right
} from 'native-base';

import { server } from '../../apis';
import { showToast, geocode } from '../../lib';
import Colors from './../../../native-base-theme/variables/commonColor.js';

function EachInput({ textChange, type, value, error }) {
  const types = {
    email: {
      keyboardType: 'email-address',
      autoCapitalize: 'none',
      ...Platform.OS == 'ios' ? {
        textContentType: 'emailAddress',
        autoCorrect: true
      } : {}
    },
    password: {
      secureTextEntry: true,
      ...Platform.OS == 'ios' ? {
        textContentType: 'password',
        autoCorrect: true
      } : {}
    }
  }
  const placeholder = {
    name: 'Nome/Apelido',
    password: 'Senha',
    email: 'E-mail'
  }
  const color = error.has ? '#f00' : '#000'
  return (
    <View>
      <Item
        style={{
          margin: 0,
          borderBottomWidth: 0,
          borderBottomColor: color,
          width: '100%'
        }}
        floatingLabel
      >
        <Label><Text style={{ color: color }} >{placeholder[type]} <Req /></Text></Label>
        <Input
          {...type ? types[type] : {}}
          value={value}
          onChangeText={text => textChange(text)}
        />
      </Item>
      <View>
        {
          error.has ?
            error.on.map((i, id) => (
              <Text key={id} style={{ color: '#f00', display: error.has ? 'flex' : 'none' }}>
                {i}
              </Text>
            ))
            : null
        }
      </View>
    </View>
  )
}

function About({ onChangeText, value, length, error, next }) {
  let max = 60;
  return (
    <View style={{ width: '100%', height: '100%' }}>
      <Title style={{ marginVertical: 10 }}>Breve descrição sobre você:</Title>
      <Textarea
        placeholder="Sobre você..."
        placeholderTextColor={error == 'about' ? '#f33' : '#ddd'}
        value={value}
        style={{ paddingVertical: 5, width: '100%', height: '70%', fontSize: 25, borderColor: '#000', borderWidth: .5 }}
        onChangeText={txt => {
          txt = txt.replace(/\n/g, '');
          onChangeText(txt);
        }}
        onKeyPress={(event) => {
          event.preventDefault();
          if (event.nativeEvent.key == 'Enter' && Platform.OS == 'ios') {
            return Keyboard.dismiss();
          } else if (event.nativeEvent.key == 'Enter') {
            return next();
          }
        }}
        maxLength={max}
        returnKeyType={Platform.OS == 'ios' ? 'done' : 'route'}
        allowFontScaling={true}
      />
      <View style={{ padding: 17, justifyContent: 'space-between', flexDirection: 'row' }}>
        <Text
          style={{
            color: '#f00',
            display: error == 'about' ? 'flex' : 'none'
          }}
        >Campo inválido</Text>
        <Text style={{ alignSelf: 'flex-end' }}>{length}/{max}</Text>
      </View>
    </View>
  )
}

function Check({ val, change, label, state }) {
  return (
    <ListItem style={style.check} onPress={() => change(val)}>
      <Left style={style.checkleft}>
        <Subtitle >{label}</Subtitle>
      </Left>
      <Right>
        <Radio
          style={style.checkradio}
          selectedColor={'#c10000'}
          onPress={() => change(val)}
          selected={state == val}
        />
      </Right>
    </ListItem>
  )
}

function KeepGoBack({ change, goBack, type }) {
  return (
    <View style={type == 'select' ? { padding: 30 } : style.pt}>
      <Button block rounded style={style.mb} onPress={() => change()}>
        <Text style={style.fc}>Continuar</Text>
      </Button>
      <Button block rounded onPress={() => goBack()}>
        <Text style={style.fc}>Voltar</Text>
      </Button>
    </View>
  )
}

function Req() {
  return <Text style={{ color: "#f00" }}>*</Text>;
}

//begin=screens
class SelectSex extends Component {
  state = this.props.content;
  change() {
    this.props.changeState({ ...this.state, currentScreen: 'AddAbout' });
  }
  goBack() {
    this.props.changeState({ ...this.state, currentScreen: 'FormBasic' })
  }
  render() {
    return (
      <View style={style.checkForm}>

        <View style={[style.center, { marginVertical: 15 }]}>
          <Title>Selecione seu sexo</Title>
          <View style={style.vw}>
            <Check
              val={'m'}
              label={'Homem'}
              state={this.state.sex}
              change={val => this.setState({ sex: val })}
            />
            <Check
              val={'f'}
              label={'Mulher'}
              state={this.state.sex}
              change={val => this.setState({ sex: val })}
            />
          </View>
        </View>

        <View style={style.center}>
          <Title>Selecione seu interesse</Title>
          <View style={style.vw}>
            <Check
              val={'f'}
              label={'Mulheres'}
              state={this.state.interest}
              change={val => this.setState({ interest: val })}
            />
            <Check
              val={'m'}
              label={'Homens'}
              state={this.state.interest}
              change={val => this.setState({ interest: val })}
            />
            <Check
              val={'b'}
              label={'Ambos'}
              state={this.state.interest}
              change={val => this.setState({ interest: val })}
            />
          </View>
        </View>

        <KeepGoBack type={'select'} change={() => this.change()} goBack={() => this.goBack()} />
      </View>
    )
  }
}


class FormBasic extends Component {
  state = this.props.content;
  change() {
    function confirm(e) {
      if ((/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/g).test(e)) {
        console.debug(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/g);
        return (false)
      }
      console.debug(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/g);
      return true;
    }
    let { email, password, name, confirmPassword } = this.state;
    if (name == '' || name == ' ' || name == '.')
      return this.setState({ error: 'name', msg: ['Nome inválido'] });
    if (email == '' || confirm(email))
      return this.setState({ error: 'email', msg: ['Email inválido'] });
    if (password.length < 6)
      return this.setState({ error: 'password', msg: ['Senha inválida', 'minimo de 6 caracteres'] });
    if (confirmPassword != password)
      return this.setState({ error: 'confirmPassword', msg: ['As senhas são diferentes'] });
    else
      if (!this.state.toConfirm)
        return this.setState(
          { error: '', msg: {} },
          () => this.props.changeState({ ...this.state, currentScreen: 'SelectSex' })
        );
      else
        return this.setState(
          { error: '', msg: {} },
          () => this.props.changeState({ ...this.state, currentScreen: 'Finish' })
        );
  }
  render() {
    const { name, email, password, passwordVisible, msg, error, confirmPassword } = this.state;
    return (
      <Form
        style={style.form}
      >
        <KeyboardAvoidingView enabled behavior='padding'>
          <EachInput
            value={name}
            type={'name'}
            error={{ on: msg, has: error == 'name' }}
            textChange={text => this.setState({ name: text, error: '', msg: [] })}
          />
          <EachInput
            value={email}
            type={'email'}
            error={{ on: msg, has: error == 'email' }}
            textChange={text => this.setState({ email: text, error: '', msg: [] })}
          />
          <EachInput
            type={'password'}
            value={password}
            error={{ on: msg, has: error == 'password' }}
            textChange={text => this.setState({ password: text, error: '', msg: [] })}
          />
          <EachInput
            type={'password'}
            value={confirmPassword}
            error={{ on: msg, has: error == 'confirmPassword' }}
            textChange={text => this.setState(
              { confirmPassword: text, error: '', msg: [] },
              () => {
                if (text != password) {
                  this.setState({ error: 'confirmPassword', msg: ['As senhas não batem'] })
                } else {
                  this.setState({ error: '', msg: [] })
                }
              })
            }
          />
        </KeyboardAvoidingView>
        <KeepGoBack
          change={() => this.change()}
          goBack={() => this.props.navigation.navigate('Login')}
        />
      </Form>
    )
  }
}


class AddAbout extends Component {
  state = this.props.content;
  inputSize = new Animated.Value(Dimensions.get('window').height * 0.6)
  goBack() {
    this.props.changeState({ ...this.state, currentScreen: 'SelectSex' })
  }
  change() {
    let { about } = this.state;
    if (!about || about == '' || about == ' ')
      return this.setState({ error: 'about' });
    else
      return this.setState({ error: '' },
        () => this.props.changeState({ ...this.state, currentScreen: 'BirthDate' })
      );
  }
  handleKeyboard(e) {
    let endCoor = e.endCoordinates.height;
    let windowHeight = Dimensions.get('window').height;
    let size = windowHeight - endCoor;
    Animated.timing(this.inputSize, { toValue: size - 100, duration: 100 }).start();
  }
  handleKeyboardHide() {
    Animated.timing(this.inputSize,
      {
        toValue: Dimensions.get('window').height * 0.6,
        duration: 100
      }
    ).start();
  }
  componentDidMount() {
    let type = Platform.OS == 'android' ? 'keyboardDidShow' : 'keyboardWillShow';
    let hideType = Platform.OS == 'android' ? 'keyboardDidHide' : 'keyboardWillHide';
    Keyboard.addListener(type, this.handleKeyboard.bind(this));
    Keyboard.addListener(hideType, this.handleKeyboardHide.bind(this));
  }
  componentWillUnmount() {
    let type = Platform.OS == 'android' ? 'keyboardDidShow' : 'keyboardWillShow';
    let hideType = Platform.OS == 'android' ? 'keyboardDidHide' : 'keyboardWillHide';
    Keyboard.removeAllListeners(type, this.handleKeyboard.bind(this));
    Keyboard.removeAllListeners(hideType, this.handleKeyboardHide.bind(this));
  }
  render() {
    return (
      <View style={style.contentBetween}>
        <Animated.View style={style.animHeight(this.inputSize)}>
          <About
            onChangeText={txt => this.setState({ about: txt, error: '', msg: [] })}
            length={this.state.about.length}
            value={this.state.about}
            next={() => this.change()}
            error={this.state.error}
          />
        </Animated.View>
        <KeepGoBack change={() => this.change()} goBack={() => this.goBack()} />
      </View>
    )
  }
}


class BirthDate extends Component {
  state = this.props.content;
  goBack() {
    this.props.changeState({ ...this.state, currentScreen: 'AddAbout' });
  }
  change() {
    let bd = { birthDate } = this.state;
    if (!bd || bd == '' || bd == " ")
      return;
    else
      return this.setState({ error: '' },
        () => this.props.changeState({ ...this.state, currentScreen: 'Finish' })
      )
  }
  render() {
    let DateDyn = (age) => {
      let dA = new Date(Date.now());
      let dB = new Date(
        dA.getFullYear() - age,
        dA.getMonth(),
        dA.getDate(),
        dA.getHours(),
        dA.getMinutes(),
        dA.getSeconds(),
        dA.getMilliseconds()
      );
      return dB;
    }
    let setDate = (date) => {
      console.debug('BirthDate: ', date);
      this.setState({ birthDate: date });
    }
    return (
      <View style={style.contentAround}>
        <Title>Qual sua idade?</Title>
        <DatePicker
          defaultDate={DateDyn(18)}
          maximumDate={DateDyn(18)}
          minimumDate={DateDyn(71)}
          locale={"pt-br"}
          timeZoneOffsetInMinutes={undefined}
          modalTransparent={false}
          animationType={"fade"}
          androidMode={'default'}
          placeHolderText="Selecionar Data"
          textStyle={style.btn}
          placeHolderTextStyle={style.btn}
          onDateChange={setDate}
        />
        <KeepGoBack change={() => this.change()} goBack={() => this.goBack()} />
      </View>
    )
  }
}

class AcceptTerms extends Component {
  state = this.props.content;
  render() {
    return (
      <View style={{ height: '100%', width: '100%' }}>
        <View style={{ height: Dimensions.get('window').height * .85, width: '100%' }}>
          <Title>Termos de uso</Title>
          <WebView
            source={{ uri: 'http://192.168.0.34:8003/termos' }} //tem que ser apontado para o end do meu servidor
            onLoadEnd={() => {
              this.setState({ webLoaded: true })
              this.forceUpdate();
            }}
          />
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-around', paddingTop: 10 }}>
          <Button transparent onPress={() => { this.props.navigation.navigate({ routeName: 'Login' }) }}>
            <Text>Cancelar</Text>
          </Button>
          <Button disabled={!this.state.webLoaded} onPress={() => { this.props.changeState({ ...this.state, currentScreen: 'FormBasic' }) }}>
            <Text style={{ color: '#fff', paddingHorizontal: 20 }}>Concordo e aceito os termos</Text>
          </Button>
        </View>
      </View>
    )
  }
}

class Confirm extends Component {
  state = this.props.content;
  componentDidMount() {
    let register = this.props.onSubmit();
    console.debug(register);
  }
  render() {
    return (
      <View
        style={style.centerActivity}
      >
        <ActivityIndicator size='large' color={Colors.btnPrimaryColor} />
      </View>
    )
  }
}
//end=screens

export default class RegisterScreen extends Component {
  state = {
    loading: false,
    name: '',
    email: '',
    password: '',
    about: '',
    birthDate: '',
    sex: 'm',
    interest: 'f',
    msg: [],
    passwordVisible: false,
    error: '',
    currentScreen: 'AcceptTerms',//'FormBasic',
    toConfirm: false,
    webLoaded: false
  }
  onSubmit = async () => {
    try {
      this.setState({ loading: true });
      const {
        name,
        email,
        password,
        about,
        birthDate,
        sex,
        interest
      } = this.state;

      let position = null;
      try {
        position = await geocode.getCurrentPositionAsync();
      } catch (error) {
        showToast(error, 'danger');
      }

      function getCoord(position) {
        let pos = { lat: 0, lng: 0 };
        pos.lat = position.lat != undefined ?
          position.lat :
          position.coords.latitude;
        pos.lng = position.lng != undefined ?
          position.lng :
          position.coords.longitude;
        return pos;
      }

      const location = position && position != null ? getCoord(position) : { lat: 0, lng: 0 };

      const resp = await server.post('register', {
        name, email, password, about, birthDate,
        sex, interest, location
      });

      if (resp.authenticated) {
        this.props.reduxActions.setUser(resp.user);
        this.props.reduxActions.setApiToken(resp.apiToken);
        this.props.reduxActions.saveState();
        return this.props.navigation.navigate('BottomTabNavigator');
      } else if (resp.error) {
        if (!resp.fields) {
          console.debug('nenhum campo aqui');
          showToast('Algo deu errado.', 'warning')
          this.setState({ currentScreen: 'FormBasic' });
        } else {
          let keys = resp.fields ? Object.keys(resp.fields) : resp;
          var route;
          switch (keys[0]) {
            case 'email' || 'password' || 'name':
              route = 'FormBasic';
              break;
            default:
              route = 'next';
              break;
          }
          console.debug(resp.fields)
          this.setState({ msg: resp.fields[keys[0]], error: keys[0], currentScreen: route, toConfirm: true });
        }

      }

      this.setState({ loading: false });

    } catch (error) {
      console.debug('EXCEPTION: ', error);
      this.setState({ loading: false });
    }
  }
  screens(cur) {
    let state = this.state;
    let props = {
      content: state,
      changeState: newState => {
        this.setState(newState)
      }
    }
    switch (cur) {
      case 'FormBasic': return <FormBasic navigation={this.props.navigation} {...props} />;
      case 'SelectSex': return <SelectSex {...props} />;
      case 'AddAbout': return <AddAbout {...props} />;
      case 'BirthDate': return <BirthDate {...props} />;
      case 'Finish': return <Confirm onSubmit={() => this.onSubmit()} {...props} />;
      case 'AcceptTerms': return <AcceptTerms navigation={this.props.navigation} {...props} />;
    }
  }
  onBackPress() {
    return true;
  }
  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.onBackPress);
  }
  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.onBackPress);
  }
  render() {
    const { currentScreen } = this.state;
    return (
      <Container style={style.container}>
        {this.screens(currentScreen)}
      </Container>
    );
  }
}

const style = StyleSheet.create({
  container: { paddingTop: Constants.statusBarHeight },
  btn: {
    textAlign: 'center',
    width: '100%',
    padding: 17,
    backgroundColor: Colors.iconStyle,
    borderRadius: 4,
    color: '#fff'
  },
  form: {
    justifyContent: 'space-between',
    paddingHorizontal: 17,
    paddingVertical: 30,
    height: '100%',
    backgroundColor: '#fff'
  },
  centerActivity: {
    height: '100%',
    width: '100%',
    backgroundColor: Colors.btnPrimaryBg,
    alignItems: 'center',
    justifyContent: 'center'
  },
  fc: { color: '#fff' },
  pt: { paddingTop: 17 },
  mb: { marginBottom: 17 },
  vw: { width: '100%' },
  checkleft: { marginLeft: 0, paddingLeft: 17 },
  checkradio: { height: 30, width: 30 },
  contentAround: {
    paddingHorizontal: 17,
    justifyContent: 'space-around',
    height: '100%'
  },
  contentBetween: {
    padding: 17,
    justifyContent: 'space-between',
    height: '100%'
  },
  animHeight: (h) => ({ width: '100%', height: h }),
  checkForm: { height: '100%', justifyContent: 'space-between' },
  center: { alignItems: 'center' },
  check: {
    borderBottomWidth: .5,
    borderBottomColor: '#000',
    marginLeft: 0
  }
});