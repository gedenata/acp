import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  ScrollView,
  ToastAndroid,
  TouchableOpacity,
  KeyboardAvoidingView,
  Linking,
  Platform,
} from 'react-native';
import ReactNativeBiometrics from 'react-native-biometrics';
import AsyncStorage from '@react-native-community/async-storage';

import Loader from './../Components/loader';
import AESEncryption from './../Components/AESEncryption';
import styles from './../Components/StylesComponent';
import LOGOSVG from 'AnRNApp/Image/svg_logo/aprilconnect_verticallogo-coloured.svg';
import FINGERPRINTSVG from 'AnRNApp/Image/svg_logo/Fingerprint.svg';
import FACEIDSVG from 'AnRNApp/Image/svg_logo/Faceid.svg';
import BIOMETRICSVG from 'AnRNApp/Image/svg_logo/biometric-icon.svg';
import {showMessage, postBiometricKey} from './../Components/biometricUtils';

const SetupBiometricsScreen = ({route, navigation}) => {
  const [loading, setLoading] = useState(false);
  const [isRegistrationFlow, setIsRegistrationFlow] = useState(false);
  const [tokenValue, setTokenValue] = useState('');
  const [touchIdAvailable, setTouchIdAvailable] = useState(false);
  const [faceIdAvailable, setFaceIdAvailable] = useState(false);
  const [fingerprintAvailable, setFingerprintAvailable] = useState(false);
  const [biometricsNotSupported, setBiometricsNotSupported] = useState(false);
  const [biometricNotSetup, setBiometricNotSetup] = useState(false);
  const [deviceNotSupported, setDeviceNotSupported] = useState(false);
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
      : 'biometric authentication';
  };

  const GetBiometricsIcon = () => {
    return faceIdAvailable ? (
      <FACEIDSVG />
    ) : touchIdAvailable ? (
      <FINGERPRINTSVG />
    ) : (
      <BIOMETRICSVG />
    );
  };

  const OpenSettingsButton = ({children}) => {
    const handlePress = useCallback(async () => {
      setBiometricNotSetup(false);
      if (Platform.OS === 'android') {
        await Linking.sendIntent('android.settings.SECURITY_SETTINGS');
      } else {
        await Linking.openURL('App-Prefs:root=TOUCHID_PASSCODE');
      }
    }, []);

    return (
      <TouchableOpacity
        style={{
          ...styles.buttonStyle,
          width: '80%',
        }}
        activeOpacity={0.5}
        onPress={handlePress}>
        <Text
          style={{
            ...styles.buttonTextStyle,
            textTransform: 'uppercase',
          }}>
          {children}
        </Text>
      </TouchableOpacity>
    );
  };

  const SkipButton = ({children}) => {
    const handlePress = useCallback(async () => {
      onContinuePressed();
    }, []);

    return (
      <TouchableOpacity
        style={{
          ...styles.buttonStyle,
          width: '80%',
          marginTop: 50
        }}
        activeOpacity={0.5}
        onPress={handlePress}>
        <Text
          style={{
            ...styles.buttonTextStyle,
            textTransform: 'uppercase',
          }}>
          {children}
        </Text>
      </TouchableOpacity>
    );
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
        setBiometricNotSetup(true);
      } else if (err.message === 'Error generating public private keys') {
        setDeviceNotSupported(true);
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
                  {biometricNotSetup
                    ? `Sorry, you haven't set up your ${getBiometricsType()}\non your device.`
                    : deviceNotSupported
                    ? `Sorry, your device does not support ${getBiometricsType()}.`
                    : `Setup your ${getBiometricsType()} for easier,\nfaster and more secure log in.`}
                </Text>
                {biometricNotSetup ? (
                  <OpenSettingsButton>Go to System Settings</OpenSettingsButton>
                ) : deviceNotSupported ? (
                  <SkipButton>Skip</SkipButton>
                ) : (
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
                )}
                {deviceNotSupported ? (
                  <></>
                ) : (
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
                )}
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
