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
  let url = `${ACCESS_API}/create/biometrics`;
  return await fetch(url, {
    method: 'POST',
    body: `Token=${encodeURIComponent(tokenValue)}&PublicKey=${encodeURIComponent(publicKey)}`,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
    },
  });
};

const removeBiometricKey = async (tokenValue) => {
  let url = `${ACCESS_API}/remove/biometrics`;
  return await fetch(url, {
    method: 'POST',
    body: `Token=${encodeURIComponent(tokenValue)}`,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
    },
  });
};

export {showMessage, postBiometricKey, removeBiometricKey};
