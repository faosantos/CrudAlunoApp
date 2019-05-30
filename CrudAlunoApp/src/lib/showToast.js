import { Toast } from 'native-base';



export default function showToast(toShow, type) {

  let text = null, duration = 3000, position = 'bottom';

  if (typeof (toShow) === 'string') {
    text = toShow;
  } else {

    text = String(toShow);
  }

  if (type == 'danger') {
    duration = 6000;
    position = 'top';
  }

  if (text == null) {
    text = 'Não foi possível realizar operação.'
  }

  Toast.show({
    text,
    type,
    duration,
    position
  });

};
