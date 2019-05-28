import React from 'react';
import { View, Dimensions } from 'react-native';
import { Subtitle, Button, Text } from 'native-base';


const ErrorComponent = ({ type, buttons }) => {

  let errors = {
    NOFAV: ['Você ainda não favoritou nenhum usuário.', 'Para adicionar um favorito, toque no ícone do coração em seu cartão de apresentação'],
    NOFEED: ['Não foi possível encontrar usuários do seu interesse nas suas proximidades', 'Aumente a distância do feed ou tente buscar por cidade'],
    NOLOC: ['Não foi possível registrar sua localização por GPS', 'Verifique as configurações do seu telefone'],
    ERROR: ['Algo deu errado ao carregar esta tela.', 'tente novamente mais tarde']
  }

  let icon = {
    NOFAV: "heart-dislike",
    NOLOC: "man"
  }

  return (
    <View
      style={style.screen}
    >
      <View style={{ alignItems: 'center', justifyContent: 'center' }}>
        <Icon name={icon[type]} type="ionicons" style={style.icon} />
        {
          errors[type].map((i, id) => (<Subtitle key={id}>{i}</Subtitle>))
        }
      </View>
      <View>
        {
          buttons && buttons.length > 0 ? (
            buttons.map((i, id) => (
              <Button
                block
                key={id}
                rounded
                onPress={i.onPress}
                style={style.btn}
              >
                <Text> {i.text} </Text>
              </Button>
            ))
          ) : (null)
        }
      </View>
    </View>
  )
}


const style = {
  btn: { margin: 4, alignSelf: 'center' },
  screen: {
    justifyContent: 'space-around',
    alignItems: 'center',
    height: Dimensions.get('window').height - 100,
    padding: 15
  },
  icon: { fontSize: 40 }
}


export default ErrorComponent;
