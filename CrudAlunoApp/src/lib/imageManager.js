import { Platform, Linking } from 'react-native';
import { Location, Permissions, ImagePicker, FileSystem, ImageManipulator } from 'expo';
import showAlert from './showAlert';


async function solveCameraRollPermission() {
  const perm = await Permissions.askAsync(Permissions.CAMERA_ROLL);
  return (perm.status === 'granted');
}

async function solveCameraPermission() {
  const p1 = await solveCameraRollPermission();
  const p2 = await Permissions.askAsync(Permissions.CAMERA);
  return (p1 && p2.status === 'granted');
}

function askUserForImage() {
  return new Promise(async (resolve) => {

    execOption = async (permissionAsync, getImageAsync) => {
      const granted = await permissionAsync();
      if (granted) {
        const result = await getImageAsync({ base64: true });
        resolve(result);
      } else {
        showAlert(
          'Verifique as permissões do app nas configurações',
          'Sem Permissão',
          () => Linking.openURL('app-settings:')
        );
        resolve(false);
      }
    }

    showAlert(
      'Escolha uma opção',
      'Imagens',
      () => execOption(solveCameraRollPermission, ImagePicker.launchImageLibraryAsync),
      () => resolve(false),
      'Galeria',
      'Cancelar',
      () => execOption(solveCameraPermission, ImagePicker.launchCameraAsync),
      'Câmera',
      true
    );

  });

}

export default {
  askUserForImage
};

