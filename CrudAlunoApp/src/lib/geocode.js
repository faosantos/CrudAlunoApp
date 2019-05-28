import { Platform, Linking } from 'react-native';
import { Location, Permissions } from 'expo';
import showAlert from './showAlert';


async function getCurrentPositionAsync() {
  let { status } = await Permissions.askAsync(Permissions.LOCATION);

  if (status !== 'granted') {
    showAlert(
      'Sem permissão para usar sua localização. Verifique as configurações do seu telefone',
      'Geolocalização',
      () => Linking.openURL('app-settings:'),
      () => { },
      'Abrir Configurações'
    );
    return false;
  }

  const gpsServiceStatus = await Location.hasServicesEnabledAsync();
  if (!gpsServiceStatus) {
    showAlert('Serviço de GPS não está disponível. Verifique as configurações do seu telefone');
    return false;
  }


  try {
    const location = await Location.getCurrentPositionAsync({
      maximumAge: 60000, // only for Android
      accuracy: Platform.OS == 'android' ? Location.Accuracy.Low : Location.Accuracy.Lowest,
      timeout: 6000
    });
    return { lat: location.coords.latitude, lng: location.coords.longitude };
  } catch (error) {
    showAlert(error, 'Geolocalização');
    return false;
  }

}

export default {
  getCurrentPositionAsync
};

