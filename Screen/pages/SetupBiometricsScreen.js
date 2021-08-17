import React, {useState, useEffect} from 'react';
import {API_URL} from '@env';
import {
  View,
  Text,
  ScrollView,
  ToastAndroid,
  TouchableOpacity,
  KeyboardAvoidingView,
} from 'react-native';
import ReactNativeBiometrics from 'react-native-biometrics';
import AsyncStorage from '@react-native-community/async-storage';

import Loader from './../Components/loader';
import AESEncryption from './../Components/AESEncryption';
import styles from './../Components/StylesComponent';
import LOGOSVG from 'AnRNApp/Image/svg_logo/aprilconnect_verticallogo-coloured.svg';
import FINGERPRINTSVG from 'AnRNApp/Image/svg_logo/Fingerprint.svg';
import FACEIDSVG from 'AnRNApp/Image/svg_logo/Faceid.svg';
import {showMessage, postBiometricKey} from './../Components/biometricUtils';

const SetupBiometricsScreen = ({route, navigation}) => {
  const [loading, setLoading] = useState(false);
  const [isRegistrationFlow, setIsRegistrationFlow] = useState(false);
  const [tokenValue, setTokenValue] = useState('');
  const [touchIdAvailable, setTouchIdAvailable] = useState(false);
  const [faceIdAvailable, setFaceIdAvailable] = useState(false);
  const [fingerprintAvailable, setFingerprintAvailable] = useState(false);
  const [biometricsNotSupported, setBiometricsNotSupported] = useState(false);
  const biometricFailedMessage = 'Biometric linking failed, please try again';

  useEffect(async () => {
    if (route.params && route.params.RegistrationFlow) {
      setIsRegistrationFlow(route.params.RegistrationFlow);
    }
    AsyncStorage.getItem('user_id').then((value) => {
      AESEncryption('decrypt', value).then((respp) => {
        if (respp) {
          setTokenValue('' + JSON.parse(respp).data.Token);
        }
      });
    });

    const {
      available,
      biometryType,
    } = await ReactNativeBiometrics.isSensorAvailable();
    if (available && biometryType === ReactNativeBiometrics.TouchID) {
      setTouchIdAvailable(true);
    } else if (available && biometryType === ReactNativeBiometrics.FaceID) {
      setFaceIdAvailable(true);
    } else if (available && biometryType === ReactNativeBiometrics.Biometrics) {
      setFingerprintAvailable(true);
    } else {
      setBiometricsNotSupported(true);
    }
  }, []);

  const getBiometricsType = () => {
    return touchIdAvailable
      ? 'Touch ID'
      : faceIdAvailable
      ? 'Face ID'
      : 'fingerprint';
  };

  const GetBiometricsIcon = () => {
    return faceIdAvailable ? <FACEIDSVG /> : <FINGERPRINTSVG />;
  };

  const sendBiometricKey = async (publicKey) => {
    if (tokenValue !== '') {
      setLoading(true);
      const response = await postBiometricKey(tokenValue, publicKey);
      // // console.log('biometric setup response', response.status);
      if (response && response.status === 200) {
        onContinuePressed();
      } else {
        showMessage(biometricFailedMessage, ToastAndroid.SHORT);
      }
      setLoading(false);
    } else {
      showMessage(biometricFailedMessage, ToastAndroid.SHORT);
    }
  };

  const onSetupPressed = async () => {
    try {
      const {success, error} = await ReactNativeBiometrics.simplePrompt({
        promptMessage: `Confirm ${getBiometricsType()}`,
      });

      if (success) {
        const {publicKey} = await ReactNativeBiometrics.createKeys(
          `Confirm ${getBiometricsType()}`,
        );
        if (publicKey) {
          sendBiometricKey(publicKey);
        } else {
          showMessage(biometricFailedMessage, ToastAndroid.SHORT);
        }
      } else if (error === 'User cancellation') {
        showMessage('Biometric linking cancelled', ToastAndroid.SHORT);
      } else {
        showMessage(biometricFailedMessage, ToastAndroid.SHORT);
        console.error('Biometric authentication error: ', error);
      }
    } catch (err) {
      if (err.message === 'No fingerprints enrolled.') {
        showMessage(
          `No ${getBiometricsType()} enabled on device.`,
          ToastAndroid.SHORT,
        );
      } else {
        showMessage(biometricFailedMessage, ToastAndroid.SHORT);
        console.error('Biometric authentication error: ', err.message);
      }
    }
  };

  const onContinuePressed = () => {
    if (isRegistrationFlow) {
      navigation.navigate('LoginStack');
    } else {
      AsyncStorage.setItem('skip_biometrics', 'true');
      navigation.navigate('LoadingStack');
    }
  };

  return (
    <View style={styles.mainBody}>
      <View style={styles.overlay}>
        <Loader loading={loading} />
        <ScrollView keyboardShouldPersistTaps="handled">
          <View style={{marginTop: 0}}>
            <KeyboardAvoidingView enabled>
              <View style={{alignItems: 'center'}}>
                <LOGOSVG
                  style={{marginTop: 0, marginBottom: 100}}
                  width={250}
                  height={110}
                />
                {isRegistrationFlow ? (
                  <></>
                ) : (
                  <Text style={styles.welcomeTextStyle}>
                    You haven't set up your {getBiometricsType()}
                  </Text>
                )}
                <GetBiometricsIcon />
                <Text style={styles.welcomeTextStyle}>
                  Setup your {getBiometricsType()} for easier,{'\n'}
                  faster and more secure log in.
                </Text>
                <TouchableOpacity
                  style={{
                    ...styles.buttonStyle,
                    width: '80%',
                  }}
                  activeOpacity={0.5}
                  onPress={onSetupPressed}>
                  <Text
                    style={{
                      ...styles.buttonTextStyle,
                      textTransform: 'uppercase',
                    }}>
                    Setup {getBiometricsType()}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    ...styles.buttonInvertStyle,
                    width: '80%',
                  }}
                  activeOpacity={0.5}
                  onPress={onContinuePressed}>
                  <Text
                    style={{
                      ...styles.buttonTextInvertStyle,
                      textTransform: 'uppercase',
                    }}>
                    No Thanks, Continue
                  </Text>
                </TouchableOpacity>
                <Text
                  style={styles.registerTextStyle}
                  onPress={() => navigation.navigate('RegisterScreen')}>
                  Need Help? Contact our support
                </Text>
              </View>
            </KeyboardAvoidingView>
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

export default SetupBiometricsScreen;
