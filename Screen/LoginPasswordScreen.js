//Import React and Hook we needed
import React, { useState, useEffect, createRef } from 'react';
import {API_URL} from '@env';
// Import all required component
import {
  TextInput,
  View,
  Text,
  ScrollView,
  Keyboard,
  TouchableOpacity,
  KeyboardAvoidingView,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

import AsyncStorage from '@react-native-community/async-storage';
import Loader from './Components/loader';
import AESEncryption from './Components/AESEncryption';
import styles from './Components/StylesComponent';
import LOGOSVG from 'AnRNApp/Image/svg_logo/aprilconnect_verticallogo-coloured.svg';
import DeviceInfo from 'react-native-device-info';
import ReactNativeBiometrics from 'react-native-biometrics';

const LoginPasswordScreen = props => {

  let [userPassword, setUserPassword] = useState('');
  let [loading, setLoading] = useState(false);
  let [errortext, setErrortext] = useState('');
  let [encryptedTextValue, setEncryptedText] = useState('');
  let [userEmail, setUserEmail] = useState('');
  let [secureTextEntryStatus, setSecureTextEntryStatus] = useState(true);
  const [userAgent, setUserAgent] = useState('');
  const [biometricSensorAvailable, setBiometricSensorAvailable] = useState(false);
  const [biometricsNotSupported, setBiometricsNotSupported] = useState(false);
  const [biometricKeysExist, setBiometricKeysExist] = useState(false);
  const [showBiometrics, setShowBiometrics] = useState(false);
  const [skipBiometrics, setSkipBiometrics] = useState(false);

  const passwordInputRef = createRef();

  useEffect(async () => {
    const {
      available,
      biometryType,
    } = await ReactNativeBiometrics.isSensorAvailable();
    setBiometricSensorAvailable(available);
    if (available && biometryType === ReactNativeBiometrics.TouchID) {
    } else if (available && biometryType === ReactNativeBiometrics.FaceID) {
    } else if (available && biometryType === ReactNativeBiometrics.Biometrics) {
    } else {
      setBiometricsNotSupported(true);
    }
    const {keysExist} = await ReactNativeBiometrics.biometricKeysExist();
    setBiometricKeysExist(keysExist);
    const skip_biometrics = await AsyncStorage.getItem('skip_biometrics');
    setSkipBiometrics(skip_biometrics === 'true');
  }, []);

  useEffect(() => {
    if (
      // // biometricSensorAvailable &&
      !biometricKeysExist
      // // && !biometricsNotSupported
      && !skipBiometrics
    ) {
      setShowBiometrics(true);
    } else {
      setShowBiometrics(false);
    }
  }, [
    // // biometricSensorAvailable, biometricsNotSupported,
    biometricKeysExist, skipBiometrics]);

  AsyncStorage.getItem('user_id').then(
    (value) =>
    {
        getDataAsync();
        AESEncryption("decrypt",value).then((respp)=>{
          setEncryptedText("" + JSON.parse(respp).EncryptedText);
          setUserEmail("" + JSON.parse(respp).email);
        });// End of encryption/decryption
    },
  );

  const getDataAsync = async () => {
    let deviceJSON = {};
    try {
      deviceJSON.userAgent = await DeviceInfo.getUserAgent();
      setUserAgent(deviceJSON.userAgent);
      try {
        deviceJSON.deviceToken = await DeviceInfo.getDeviceToken();
      } catch (e) {
        // console.log('Unable to get device token. Either simulator or not iOS11+');
      }
    } catch (e) {
      // console.log('Trouble getting device info ', e);
    }
  };

  const handleSecureTextEntry = () => {
    if(secureTextEntryStatus){ setSecureTextEntryStatus(false) }
    else{ setSecureTextEntryStatus(true) }
  }

  const handleSubmitPress = () => {
    setErrortext('');

    // console.log("ya : " + encryptedTextValue + "::" + userEmail);
    // return false;

    setLoading(true);
    var dataToSend = { EncryptText: encryptedTextValue, Password: userPassword };
    var formBody = [];
    for (let key in dataToSend) {
      var encodedKey = encodeURIComponent(key);
      var encodedValue = encodeURIComponent(dataToSend[key]);
      formBody.push(encodedKey + '=' + encodedValue);
    }
    formBody = formBody.join('&');
    let url = `${API_URL}/WebApi1/april/api/password`;
    fetch(url, {
      method: 'POST',
      body: formBody,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        'User-Agent':userAgent,
      },
    }).then(response => {
      if(response.status == 202){
        response.EncryptedText = encryptedTextValue;
        response.UserEmail = userEmail;

        AESEncryption("encrypt", JSON.stringify(response)).then((resp)=>{
          AsyncStorage.setItem(
            'user_id',
            resp
          );
          props.navigation.navigate('CreatePassword');
		});// End of encryption/decryption


      }
      if(response.status != 200){
        setErrortext('Please check your password');
        return false;
      }
      const statusCode = response.status;
      const data = response.json();
      return Promise.all([statusCode, data]).then(res => ({
        statusCode: res[0],
        data: res[1]
      }));
    })
    .then(responseJson => {
        if(responseJson){
          const { statusCode, data } = responseJson;

          if(statusCode != 200){
            setErrortext('Please check your password');
            AsyncStorage.removeItem('user_id');
          }else{
            if(data.Token)
            {
              responseJson.data.EncryptText = encryptedTextValue;
              responseJson.data.UserEmail = userEmail;

              AESEncryption("encrypt", JSON.stringify(responseJson)).then((resp) => {
                AsyncStorage.setItem(
                  'user_id',
                  resp
                );
                if(showBiometrics){
                  props.navigation.navigate('SetupBiometrics');
                } else {
                  props.navigation.navigate('LoadingStack');
                }
              });

            }else{
              AsyncStorage.removeItem('user_id');
            }
          }
        }

        setLoading(false);
    })
    .catch(error => {
      setLoading(false);
      console.error(error);
    });
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
                      width={230}
                      height={100}
                    />
                    <Text
                        style={styles.welcomeTextStyle}>
                        Please enter password to continue
                    </Text>
                </View>
                <View style={styles.LabelStyle}>
                  <Text
                      style={styles.originalLabelStyle}>
                      PASSWORD
                  </Text>
                </View>
                <View style={styles.SectionStyle}>
                  <Icon raised name="lock" size={20} color="#000" style={styles.searchIcon} />
                  <TextInput
                    style={styles.inputStyle}
                    onChangeText={UserPassword => setUserPassword(UserPassword)}
                    underlineColorAndroid="#FFFFFF"
                    placeholder="********" //12345
                    placeholderTextColor="#3CB371"
                    keyboardType="default"
                    ref={passwordInputRef}
                    onSubmitEditing={Keyboard.dismiss}
                    blurOnSubmit={false}
                    secureTextEntry={secureTextEntryStatus}
                  />
                  <Icon raised name={(secureTextEntryStatus) ? "eye" : "eye-slash"} size={20} color="#000" style={{right:30}} onPress={handleSecureTextEntry}/>
                </View>
                {errortext != '' ? (
                  <Text style={styles.errorTextStyle}> {errortext} </Text>
                ) : null}
                <TouchableOpacity
                  style={styles.buttonStyle}
                  activeOpacity={0.5}
                  onPress={handleSubmitPress}>
                  <Text style={styles.buttonTextStyle}>LOG IN</Text>
                </TouchableOpacity>
                <Text
                  style={styles.registerTextStyle}
                  onPress={() => props.navigation.navigate('RegisterScreen')}>
                  Needs Help? Contact our support
                </Text>
              </KeyboardAvoidingView>
            </View>
          </ScrollView>
        </View>
    </View>
  );
};
export default LoginPasswordScreen;