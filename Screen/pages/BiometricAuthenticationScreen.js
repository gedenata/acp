import React, {useState, useEffect, useCallback, createRef} from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  Image,
  View,
  Text,
  SafeAreaView,
  Dimensions,
  ScrollView,
  ToastAndroid,
  Linking,
  Platform,
} from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome';
import Moment from 'moment';
import AsyncStorage from '@react-native-community/async-storage';
import {Modalize} from 'react-native-modalize';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import ReactNativeBiometrics from 'react-native-biometrics';
import IntentLauncher from 'react-native-intent-launcher';
import DeviceInfo from 'react-native-device-info';

import AESEncryption from './../Components/AESEncryption';
import Loader from './../Components/loader';
import FINGERPRINTSVG from 'AnRNApp/Image/svg_logo/Fingerprint.svg';
import FACEIDSVG from 'AnRNApp/Image/svg_logo/Faceid.svg';
import BIOMETRICSVG from 'AnRNApp/Image/svg_logo/biometric-icon.svg';
import {
  showMessage,
  postBiometricKey,
  removeBiometricKey,
} from './../Components/biometricUtils';

const {width} = Dimensions.get('window');
const widthMultiplier = width / 400;

const BiometricAuthenticationScreen = ({route, navigation}) => {
  const [isLoading, setLoading] = useState(false);
  const [tokenValue, setTokenValue] = useState('');
  const [touchIdAvailable, setTouchIdAvailable] = useState(false);
  const [faceIdAvailable, setFaceIdAvailable] = useState(false);
  const [fingerprintAvailable, setFingerprintAvailable] = useState(false);
  const [biometricsNotSupported, setBiometricsNotSupported] = useState(false);
  const [biometricKeysExist, setBiometricKeysExist] = useState(false);
  const [biometricNotSetup, setBiometricNotSetup] = useState(false);
  const [deviceNotSupported, setDeviceNotSupported] = useState(false);

  const modalizeRef = createRef();
  const biometricFailedMessage = 'Biometric linking failed, please try again.';
  const biometricRemovalFailedMessage =
    'Biometric removal failed, please try again.';

  useEffect(async () => {
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

    const {keysExist} = await ReactNativeBiometrics.biometricKeysExist();
    setBiometricKeysExist(keysExist);
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

  const sendBiometricKey = async (publicKey) => {
    if (tokenValue !== '') {
      setLoading(true);
      const response = await postBiometricKey(tokenValue, publicKey);
      // // console.log('biometric setup response', response.status);
      if (response && response.status === 200) {
        setBiometricKeysExist(true);
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
        AsyncStorage.setItem('skip_biometrics', 'true');
        setDeviceNotSupported(true);
      } else {
        showMessage(biometricFailedMessage, ToastAndroid.SHORT);
        console.error('Biometric authentication error: ', err.message);
      }
    }
  };

  const OpenSettingsButton = ({children}) => {
    const handlePress = useCallback(async () => {
      setBiometricNotSetup(false);
      if (Platform.OS === 'android') {
        //await Linking.sendIntent('android.settings.SECURITY_SETTINGS');
        const apiLevel = await DeviceInfo.getApiLevel();
        IntentLauncher.startActivity({
          action:
            apiLevel >= 30
              ? 'android.settings.BIOMETRIC_ENROLL'
              : apiLevel >= 28
              ? 'android.settings.FINGERPRINT_ENROLL'
              : 'android.settings.SECURITY_SETTINGS',
        });
      } else {
        await Linking.openURL('App-Prefs:root=TOUCHID_PASSCODE');
      }
    }, []);

    return (
      <TouchableOpacity
        style={{
          ...styles.buttonStyle,
          marginTop: 300,
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

  const closeModal = () => {
    if (modalizeRef.current) {
      // // console.log('on close modal');
      modalizeRef.current.close();
    }
  };

  const onRemovePressed = () => {
    modalizeRef.current?.open();
  };

  const onRemoveConfirmPressed = async () => {
    if (tokenValue !== '') {
      setLoading(true);
      closeModal();
      const response = await removeBiometricKey(tokenValue);
      // // console.log('biometric remove response', response.status);
      if (response && response.status === 200) {
        await ReactNativeBiometrics.deleteKeys();
        setBiometricKeysExist(false);
      } else {
        showMessage(biometricRemovalFailedMessage, ToastAndroid.SHORT);
      }
      setLoading(false);
    } else {
      showMessage(biometricRemovalFailedMessage, ToastAndroid.SHORT);
    }
  };

  Moment.locale('en');

  const goBackToPage = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.mainBody}>
      <Loader loading={isLoading} />
      <ScrollView>
        <View>
          <View>
            <Image
              source={require('AnRNApp/Image/bar.png')}
              style={{
                width: '100%',
                height: 85,
                top: 0,
                resizeMode: 'contain',
                borderRadius: 1000,
                borderTopLeftRadius: 0,
                borderTopRightRadius: 0,
                transform: [{scaleX: 7 * widthMultiplier}],
              }}
            />
          </View>
          <View
            style={{
              alignItems: 'center',
              position: 'absolute',
              top: 10,
              left: 0,
              right: 0,
            }}>
            <TouchableOpacity
              style={{
                position: 'absolute',
                left: 0,
                marginLeft: 20,
                marginTop: 10,
              }}
              onPress={goBackToPage}>
              <Icon raised name="arrow-left" size={30} color="#FDFDFD" />
            </TouchableOpacity>
            <Text
              style={{
                marginTop: 12,
                color: '#FDFDFD',
                fontSize: 19,
                fontWeight: 'bold',
              }}>
              Biometric Authentication
            </Text>
          </View>
          <View
            style={{
              left: 0,
              right: 0,
              marginLeft: 35,
              marginRight: 35,
              textAlign: 'justify',
              top: 40,
              marginBottom: 31,
              alignItems: 'center',
            }}>
            <GetBiometricsIcon />
            <Text
              style={{
                color: '#000000',
                fontWeight: 'normal',
                fontSize: 12,
                textAlign: 'left',
                lineHeight: 20,
                width: '100%',
                marginLeft: 20,
                marginTop: 40,
                minHeight: 50
              }}>
              {biometricNotSetup
                ? `Sorry, you haven't set up your ${getBiometricsType()}\non your device.`
                : deviceNotSupported
                ? `Sorry, your device does not support ${getBiometricsType()}.`
                : `Setup your ${getBiometricsType()} for easier, faster and more\nsecure log in.`}
            </Text>
          </View>
          {deviceNotSupported ? (
            <></>
          ) : (
            <View
              style={{
                left: 0,
                right: 0,
                marginLeft: 35,
                marginRight: 35,
                textAlign: 'justify',
                marginTop: 30,
                marginBottom: 1,
                flexDirection: 'row',
              }}>
              <Icon
                raised
                name={biometricKeysExist ? 'check-circle-o' : 'times-circle-o'}
                size={24}
                color={biometricKeysExist ? '#2E8B57' : '#afa3a3'}
                style={styles.checkIcon}
              />
              <Text
                style={{
                  color: biometricKeysExist ? '#2E8B57' : '#000000',
                  fontWeight: 'normal',
                  fontSize: 12,
                  textAlign: 'left',
                  lineHeight: 20,
                  textTransform: 'capitalize',
                  marginRight: 5,
                }}>
                {getBiometricsType()}
              </Text>
              <Text
                style={{
                  color: biometricKeysExist ? '#2E8B57' : '#000000',
                  fontWeight: 'normal',
                  fontSize: 12,
                  textAlign: 'left',
                  lineHeight: 20,
                }}>
                has {biometricKeysExist ? '' : 'not'} been set up
              </Text>
            </View>
          )}
          {!biometricKeysExist ? (
            biometricNotSetup ? (
              <OpenSettingsButton>Go to System Settings</OpenSettingsButton>
            ) : deviceNotSupported ? (
              <></>
            ) : (
              <TouchableOpacity
                style={{
                  ...styles.buttonStyle,
                  marginTop: 300,
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
            )
          ) : (
            <TouchableOpacity
              style={{
                ...styles.buttonStyle,
                marginTop: 300,
                backgroundColor: '#c6481c',
              }}
              activeOpacity={0.5}
              onPress={onRemovePressed}>
              <Text
                style={{
                  ...styles.buttonTextStyle,
                  textTransform: 'uppercase',
                }}>
                Remove {getBiometricsType()}
              </Text>
            </TouchableOpacity>
          )}
          <Modalize
            ref={modalizeRef}
            modalHeight={250}
            scrollViewProps={{
              showsVerticalScrollIndicator: false,
              stickyHeaderIndices: [0],
            }}>
            <View style={s.content__header} key="0">
              <TouchableOpacity style={s.content__icon} onPress={closeModal}>
                <Icon raised name="chevron-down" size={15} />
              </TouchableOpacity>
              <Text
                style={{...s.content__heading, textTransform: 'capitalize'}}>
                Remove {getBiometricsType()}
              </Text>
            </View>
            <View style={s.content__inside} key="1">
              <ScrollView style={s.content__scrollview}>
                <View
                  style={{
                    backgroundColor: '#FDFDFD',
                    width: '100%',
                  }}>
                  <Text style={s.content__textblockbold}>
                    Are you sure you want to remove your {getBiometricsType()}?
                  </Text>
                  <Text style={s.content__textblock}>
                    You will have to login manually with your email, phone
                    number and password.
                  </Text>
                  <FontAwesome
                    raised
                    name="exclamation-circle"
                    size={50}
                    style={s.content_insideicon}
                    color="#c6481c"
                  />
                  <View
                    style={{
                      marginTop: 10,
                      alignItems: 'stretch',
                      justifyContent: 'flex-start',
                      left: 15,
                      right: 15,
                      marginRight: 25,
                      ...(Platform.OS !== 'android' && {zIndex: 10}),
                    }}>
                    <TouchableOpacity
                      style={{
                        ...styles.buttonStyle,
                        backgroundColor: '#c6481c',
                      }}
                      onPress={onRemoveConfirmPressed}>
                      <Text style={styles.buttonTextStyle}>REMOVE</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </ScrollView>
            </View>
          </Modalize>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  mainBody: {
    flex: 1,
    backgroundColor: '#fdfdfd',
  },
  LabelStyle: {
    flexDirection: 'row',
    height: 14,
    marginTop: 11,
    marginLeft: 40,
    marginRight: 45,
  },
  originalLabelStyle: {
    color: '#000000',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 12,
  },
  SectionStyle: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    height: 42,
    marginLeft: 35,
    marginRight: 35,
    marginBottom: 2,
    marginTop: 5,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: '#685640',
  },
  inputStyle: {
    flex: 1,
    color: 'black',
    paddingLeft: 5,
    paddingRight: 15,
  },
  buttonStyle: {
    fontFamily: 'sans-serif-light',
    backgroundColor: '#2E8B57',
    fontWeight: 'bold',
    borderWidth: 0,
    color: '#000000',
    borderColor: '#228B22',
    height: 40,
    alignItems: 'center',
    borderRadius: 40,
    marginLeft: 35,
    marginRight: 35,
    marginTop: 20,
    marginBottom: 20,
  },
  buttonTextStyle: {
    color: '#FFFFFF',
    paddingVertical: 10,
    fontSize: 16,
  },
  searchIcon: {
    padding: 10,
  },
  checkIcon: {
    paddingLeft: 12,
    marginRight: 15,
  },
});

const s = StyleSheet.create({
  content__header: {
    padding: 15,
    paddingBottom: 0,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },

  content__heading: {
    marginBottom: 2,
    textAlign: 'center',
    fontFamily: 'HelveticaNeue-Bold',
    fontSize: 14,
    color: '#000',
  },

  content__subheading: {
    marginBottom: 20,
    fontSize: 16,
    color: '#ccc',
  },

  content__inside: {
    marginLeft: 15,
    marginRight: 15,
  },

  content__paragraph: {
    fontSize: 15,
    fontFamily: 'Rubik-Regular',
    fontWeight: '200',
    lineHeight: 22,
    color: '#666',
  },

  content__scrollview: {
    marginVertical: 20,
  },

  content__block: {
    width: 200,
    height: 80,
    marginRight: 20,
    backgroundColor: '#ccc',
  },

  content__input: {
    paddingVertical: 15,
    marginBottom: 10,
    width: '100%',
    borderWidth: 1,
    borderColor: 'transparent',
    borderBottomColor: '#cdcdcd',
    borderRadius: 6,
  },

  content__icon: {
    height: 24,
    width: 24,
    position: 'absolute',
    zIndex: 10,
  },

  content_insideicon: {
    position: 'absolute',
    right: 0,
    padding: 22,
  },

  content__textblockbold: {
    width: '65%',
    fontSize: 17,
    marginLeft: 18,
    fontWeight: 'bold',
    top: 10,
  },

  content__textblock: {
    width: '75%',
    fontSize: 14,
    marginLeft: 18,
    top: 20,
  },
});

export default BiometricAuthenticationScreen;
