//Import React and Hook we needed
import React, { useState, useEffect } from 'react';
// import LinearGradient from 'react-native-linear-gradient';
import {APP_API} from '@env';
// Import all required component
import {
  TextInput,
  View,
  Text,
  ScrollView,
  ToastAndroid,
  TouchableOpacity,
  KeyboardAvoidingView,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import ReactNativeBiometrics from 'react-native-biometrics';

import AsyncStorage from '@react-native-community/async-storage';
import Loader from './Components/loader';
import AESEncryption from './Components/AESEncryption';
import styles from './Components/StylesComponent';
import LOGOSVG from 'AnRNApp/Image/svg_logo/aprilconnect_verticallogo-coloured.svg';
import FINGERPRINTSVG from 'AnRNApp/Image/svg_logo/Fingerprint.svg';
import FACEIDSVG from 'AnRNApp/Image/svg_logo/Faceid.svg';
import { showMessage } from './Components/biometricUtils';

const LoginScreenNext = props => {

  let [userEmail, setUserEmail] = useState('');
  let [userPhoneNumber, setUserPhoneNumber] = useState('');
  let [loading, setLoading] = useState(false);
  let [errortext, setErrortext] = useState('');
  const [touchIdAvailable, setTouchIdAvailable] = useState(false);
  const [faceIdAvailable, setFaceIdAvailable] = useState(false);
  const [fingerprintAvailable, setFingerprintAvailable] = useState(false);
  const [biometricSensorAvailable, setBiometricSensorAvailable] = useState(false);
  const [biometricsNotSupported, setBiometricsNotSupported] = useState(false);
  const [biometricKeysExist, setBiometricKeysExist] = useState(false);
  const [showBiometrics, setShowBiometrics] = useState(false);

  const biometricFailedMessage = 'Biometric login failed, please try again.';

  useEffect(async () => {
    const {
      available,
      biometryType,
    } = await ReactNativeBiometrics.isSensorAvailable();
    setBiometricSensorAvailable(available);
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

  useEffect(() => {
    if (
      biometricSensorAvailable &&
      biometricKeysExist &&
      !biometricsNotSupported
    ) {
      setShowBiometrics(true);
    } else {
      setShowBiometrics(false);
    }
  }, [biometricSensorAvailable, biometricsNotSupported, biometricKeysExist]);

  const getBiometricsType = () => {
    return touchIdAvailable
      ? 'Touch ID'
      : faceIdAvailable
      ? 'Face ID'
      : 'Biometric Authentication';
  };

  const GetBiometricsIcon = ({style, width, height}) => {
    return faceIdAvailable ?
    <FACEIDSVG style={style} width={width} height={height} /> :
    <FINGERPRINTSVG style={style} width={width} height={height} />;
  };

  const handleSubmitPress = () => {
    setErrortext('');
    if (!userEmail) {
      showMessage("Please fill Email", ToastAndroid.SHORT);
      return;
    }

    setLoading(true);
    var dataToSend = { RegisterEmail: userEmail, RegisterTelPhone: userPhoneNumber };
    var formBody = [];
    for (let key in dataToSend) {
      var encodedKey = encodeURIComponent(key);
      var encodedValue = encodeURIComponent(dataToSend[key]);
      formBody.push(encodedKey + '=' + encodedValue);
    }
    formBody = formBody.join('&');
    let url = `${APP_API}/register`;
    fetch(url, {
      method: 'POST',
      body: formBody,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
      },
    })
    .then(response => response.json())
    .then(responseJson => {
      setLoading(false);

      if (responseJson.EncryptedText){
          // console.log(JSON.stringify(responseJson))
          responseJson.email = userEmail;
          AESEncryption('encrypt', userEmail).then((res) => {
            AsyncStorage.setItem('user_email', res);
          });
          AESEncryption('encrypt', userPhoneNumber).then((res) => {
            AsyncStorage.setItem('user_phone', res);
          });

          AESEncryption("encrypt",JSON.stringify(responseJson)).then((respp)=>{
              AsyncStorage.setItem(
                'user_id',
                respp
              );

              if(responseJson.Status == 202){
                props.navigation.navigate('TnCStack');
              }
              else{
                props.navigation.navigate('LoginPassword');
              }
          }); // End of encryption/decryption
      }
      else{
        setErrortext('Please check your email id or phone number');
      }
    })
    .catch(error => {
      //Hide Loader
      setLoading(false);
      console.error(error);
      setErrortext('App is experiencing issue. Please contact support or try again later.' + error);
    });
  };

  const handleBiometricLogin = async () => {
    let _userEmail = '';
    const user_email = await AsyncStorage.getItem('user_email');
    if (user_email) {
      const respp = await AESEncryption('decrypt', user_email);
      if (respp) {
          _userEmail = respp;
      }
    }
    let _userPhoneNumber = '';
    const user_phone = await AsyncStorage.getItem('user_phone');
    if (user_phone) {
      const userPhone = await AESEncryption('decrypt', user_phone);
      if (userPhone) {
        _userPhoneNumber = userPhone;
      }
    }
    if (_userEmail === '' || _userPhoneNumber === '') {
      showMessage(biometricFailedMessage, ToastAndroid.SHORT);
      return false;
    }
    let payload = `${_userEmail};${_userPhoneNumber}`;
    const {success, signature} = await ReactNativeBiometrics.createSignature({
      promptMessage: `Confirm ${getBiometricsType(true)}`,
      payload: payload,
    });
    if (success && signature) {
      var dataToSend = {
        payload: payload,
        signature: signature,
      };
      // // console.log('data to send', dataToSend);
      var formBody = [];
      for (let key in dataToSend) {
        var encodedKey = encodeURIComponent(key);
        var encodedValue = encodeURIComponent(dataToSend[key]);
        formBody.push(encodedKey + '=' + encodedValue);
      }
      formBody = formBody.join('&');
      let url = `${APP_API}/biometrics`;
      setLoading(true);
      fetch(url, {
        method: 'POST',
        body: formBody,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        },
      })
        .then((response) => {
          // // console.log('biometric login response', response.status);
          if (response.status !== 200) {
            showMessage(biometricFailedMessage, ToastAndroid.SHORT);
            setLoading(false);
            return false;
          }
          const statusCode = response.status;
          const data = response.json();
          return Promise.all([statusCode, data]).then((res) => ({
            statusCode: res[0],
            data: res[1],
          }));
        })
        .then((responseJson) => {
          if (responseJson) {
            const {statusCode, data} = responseJson;
            if (statusCode !== 200) {
              showMessage(biometricFailedMessage, ToastAndroid.SHORT);
              setLoading(false);
              return false;
            } else {
              if (data.Token) {
                responseJson.data.UserEmail = userEmail;

                AESEncryption('encrypt', JSON.stringify(responseJson)).then(
                  (resp) => {
                    AsyncStorage.setItem('user_id', resp);
                    setLoading(false);
                    props.navigation.navigate('LoadingStack');
                  },
                );
              } else {
                showMessage(biometricFailedMessage, ToastAndroid.SHORT);
                setLoading(false);
              }
            }
          } else {
            showMessage(biometricFailedMessage, ToastAndroid.SHORT);
            setLoading(false);
          }
        })
        .catch((error) => {
          showMessage(biometricFailedMessage, ToastAndroid.SHORT);
          console.error(error);
          setLoading(false);
        });
    } else {
      showMessage(biometricFailedMessage, ToastAndroid.SHORT);
      setLoading(false);
    }
  };

  return (
    <View style={styles.mainBody}>
      <View style={styles.overlay}>
          <Loader loading={loading} />
          <ScrollView keyboardShouldPersistTaps="handled">
            <View style={{ marginTop: 0 }}>
              <KeyboardAvoidingView enabled>
                <View style={{ alignItems: 'center' }}>
                  <LOGOSVG
                    style={{marginTop:50}}
                    width={250}
                    height={110}
                  />
                    <Text
                        style={styles.welcomeTextStyle}>
                        Please log in to continue
                    </Text>
                </View>
                <View style={styles.LabelStyle}>
                  <Text
                      style={styles.originalLabelStyle}>
                      EMAIL
                  </Text>
                </View>
                <View style={styles.SectionStyle}>
                  <Icon raised name="envelope-o" size={20} color="#000" style={styles.searchIcon}/>
                  <TextInput
                    style={styles.inputStyle}
                    onChangeText={UserEmail => setUserEmail(UserEmail)}
                    underlineColorAndroid="#FFFFFF"
                    placeholder="name@email.com" //dummy@abc.com
                    placeholderTextColor="#3CB371"
                    autoCapitalize="none"
                    keyboardType="email-address"
                    returnKeyType="next"
                    onSubmitEditing={() =>
                      this._passwordinput && this._passwordinput.focus()
                    }
                    blurOnSubmit={false}
                  />
                  {showBiometrics? (
                    <TouchableOpacity onPress={handleBiometricLogin}>
                      <GetBiometricsIcon
                        style={{margin: 5}}
                        width={30}
                        height={30}
                      />
                    </TouchableOpacity>
                  ):
                  (
                    <></>
                  )}
                </View>
                <View style={styles.LabelStyle}>
                  <Text
                      style={styles.originalLabelStyle}>
                      PHONE NUMBER
                  </Text>
                </View>
                <View style={styles.SectionStyle}>
                  <Icon raised name="phone" size={20} color="#000" style={styles.searchIcon}/>
                  <TextInput
                    style={styles.inputStyle}
                    onChangeText={UserPhoneNumber => setUserPhoneNumber(UserPhoneNumber)}
                    underlineColorAndroid="#FFFFFF"
                    keyboardType="number-pad"
                    placeholder="+X XXX XXX XXXX" //dummy@abc.com
                    placeholderTextColor="#3CB371"
                    autoCapitalize="none"
                    returnKeyType="next"
                    onSubmitEditing={() =>
                      this._passwordinput && this._passwordinput.focus()
                    }
                    blurOnSubmit={false}
                  />
                </View>
                {errortext != '' ? (
                  <Text style={styles.errorTextStyle}> {errortext} </Text>
                ) : null}
                <TouchableOpacity
                  style={{
                      backgroundColor: '#2E8B57',
                      fontWeight:'bold',
                      borderWidth: 0,
                      color: '#FFFFFF',
                      borderColor: '#228B22',
                      height: 40,
                      alignItems: 'center',
                      borderRadius: 40,
                      marginLeft: 35,
                      marginRight: 35,
                      marginTop: 20,
                      marginBottom: 20,
                      justifyContent:'center',
                  }}
                  activeOpacity={0.5}
                  onPress={handleSubmitPress}>
                  <Text style={{
                      color: '#FFFFFF',
                      fontFamily:'HelveticaNeue-Bold',
                      fontSize: 15,
                  }}>LOG IN</Text>
                </TouchableOpacity>
                <Text
                  style={styles.registerTextStyle}
                  onPress={() => props.navigation.navigate('RegisterScreen')}>
                  Need Help? Contact our support
                </Text>
              </KeyboardAvoidingView>
            </View>
          </ScrollView>
        </View>
    </View>
  );
};
export default LoginScreenNext;