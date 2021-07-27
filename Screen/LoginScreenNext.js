//Import React and Hook we needed
import React, { useState } from 'react';
// import LinearGradient from 'react-native-linear-gradient';
import {API_URL} from '@env';
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

import AsyncStorage from '@react-native-community/async-storage';
import Loader from './Components/loader';
import AESEncryption from './Components/AESEncryption';
import styles from './Components/StylesComponent';
import LOGOSVG from 'AnRNApp/Image/svg_logo/aprilconnect_verticallogo-coloured.svg';

const LoginScreenNext = props => {

  let [userEmail, setUserEmail] = useState('');
  let [userPhoneNumber, setUserPhoneNumber] = useState('');
  let [loading, setLoading] = useState(false);
  let [errortext, setErrortext] = useState('');   

  const handleSubmitPress = () => {
    setErrortext('');
    if (!userEmail) {
      ToastAndroid.show("Please fill Email", ToastAndroid.SHORT);
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
    let url = `${API_URL}/WebApi1/april/api/register`;
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