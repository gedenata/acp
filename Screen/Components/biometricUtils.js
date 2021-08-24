import {Platform, ToastAndroid, Alert} from 'react-native';
import {ACCESS_API} from '@env';

const showMessage = (message, duration) => {
  if (Platform.OS === 'android') {
    ToastAndroid.show(message, duration);
  } else {
    Alert.alert(message);
  }
};

const postBiometricKey = async (tokenValue, publicKey) => {
  var dataToSend = {Token: '' + tokenValue, PublicKey: '' + publicKey};
  var formBody = [];
  for (let key in dataToSend) {
    var encodedKey = encodeURIComponent(key);
    var encodedValue = encodeURIComponent(dataToSend[key]);
    formBody.push(encodedKey + '=' + encodedValue);
  }
  formBody = formBody.join('&');
  let url = `${ACCESS_API}/create/biometrics`;
  return await fetch(url, {
    method: 'POST',
    body: formBody,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
    },
  });
};

const removeBiometricKey = async (tokenValue) => {
  var dataToSend = {Token: '' + tokenValue};
  var formBody = [];
  for (let key in dataToSend) {
    var encodedKey = encodeURIComponent(key);
    var encodedValue = encodeURIComponent(dataToSend[key]);
    formBody.push(encodedKey + '=' + encodedValue);
  }
  formBody = formBody.join('&');
  let url = `${ACCESS_API}/remove/biometrics`;
  return await fetch(url, {
    method: 'POST',
    body: formBody,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
    },
  });
};

export {showMessage, postBiometricKey, removeBiometricKey};
