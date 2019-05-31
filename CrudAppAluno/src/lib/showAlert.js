import { Alert } from 'react-native';
import appjson from '../../app.json';


export default function showAlert(
  text,
  topic = appjson.expo.name,
  onConfirm = () => { },
  onCancel = () => { },
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  onNeutral = null,
  neutralText = null,
  cancelable = false) {

  if (typeof (text) !== 'string')
    text = String(text);

  const buttons = [
    {
      text: cancelText,
      onPress: onCancel,
      style: 'cancel',
    },
    {
      text: confirmText,
      onPress: onConfirm
    }
  ];

  if (onNeutral && neutralText) {
    buttons.unshift({
      text: neutralText,
      onPress: onNeutral
    });
  }

  Alert.alert(
    topic,
    text,
    buttons,
    { cancelable: cancelable },
  );

};
