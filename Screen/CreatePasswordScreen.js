import React, { useState, createRef, useEffect } from 'react';
import {APP_API} from '@env';
import {
  TouchableOpacity,
  TextInput,  
  Keyboard,
  View,
  Text,
  SafeAreaView,
  ScrollView,
  ToastAndroid,
  ActivityIndicator,  
} from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome';
import Moment from 'moment';
import styles from './Components/StylesComponent';
import AsyncStorage from '@react-native-community/async-storage';
import AESEncryption from './Components/AESEncryption';
import LOGOSVG from 'AnRNApp/Image/svg_logo/aprilconnect_verticallogo-coloured.svg';

const CreatePasswordScreen = props => {

  let [errortext, setErrortext] = useState('');
  let [userNewPassword, setUserNewPassword] = useState('');
  let [userNewConfirmedPassword, setUserConfirmNewPassword] = useState('');
  const [isLoading, setLoading] = useState(false);
  const [iconNameEightCharacter, setIconNameEightCharacter] = useState('times-circle-o');
  const [iconNameNumericalCharacter, setIconNameNumerical] = useState('times-circle-o');
  let [encryptedTextValue, setEncryptedText] = useState('');  

  const passwordInputRef = createRef();

  useEffect(() => {
    if((AsyncStorage.getItem('user_id')) && JSON.stringify(AsyncStorage.getItem('user_id')) != null){
      AsyncStorage.getItem('user_id').then(
        (value) =>{
          AESEncryption("decrypt",value).then((respp)=>{
            if(JSON.parse(JSON.stringify(respp)).EncryptedText){
              setEncryptedText("" + JSON.parse(JSON.stringify(respp)).EncryptedText)
            }
            else{
              setEncryptedText("" + JSON.parse(respp).EncryptedText)
            }        
          });// End of encryption/decryption
        },
      );
    }
  }, []);

  const handleSubmitPress = () => 
  {
    if(userNewPassword != userNewConfirmedPassword){
      ToastAndroid.show("Your password and confirmation password don't match", ToastAndroid.SHORT);
      return false;
    }

    if(iconNameEightCharacter == "check-circle-o" && iconNameNumericalCharacter == "check-circle-o" ){
      setLoading(true);
      var dataToSend = { 
        EncryptText: encryptedTextValue,
        Password: userNewPassword,
      };

      var formBody = [];
      for (let key in dataToSend) {
        var encodedKey = encodeURIComponent(key);
        var encodedValue = encodeURIComponent(dataToSend[key]);
        formBody.push(encodedKey + '=' + encodedValue);
      }
      formBody = formBody.join('&');
      let url = `${APP_API}/create/password`;
      fetch(url, {
        method: 'POST',
        body: formBody,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        },
      })
      .then(response => 
      {
          if(response.status == 200){
            setLoading(false);
            ToastAndroid.show("Password Successfully Updated", ToastAndroid.SHORT);
            props.navigation.navigate('LoginStack');
          }
          else
          {
            if(response.status == 400){
              setErrortext("Missing a needed input (check input variable name)");
            }else if(response.status == 401){
              setErrortext("Unauthorized")
            }else if(response.status == 202){
              props.navigation.navigate('CreatePassword');
            }
            setLoading(false);
          }
      })
      .catch(error => {
        setLoading(false);
        console.error(error);
      });
    }
    else
    {
      ToastAndroid.show("Invalid Password Format", ToastAndroid.SHORT);            
      setLoading(false);
    }
  }

  Moment.locale('en');

  function validateNewPassword(newPassword){

    const numericalCharacterCondtion = new RegExp('(?=.*[0-9])', 'g')
    
    setIconNameNumerical(numericalCharacterCondtion.test(newPassword) ? 'check-circle-o' : 'times-circle-o')
    setIconNameEightCharacter((newPassword.length > 7) ? 'check-circle-o' : 'times-circle-o')
    setUserNewPassword(newPassword);
  }

  return (
    <SafeAreaView 
      style={{
        flex: 1,
        backgroundColor: '#fdfdfd',      
      }}
    >
      <ScrollView>       
        <View>                 
            <View style={{ alignItems: 'center' }}>
              <LOGOSVG
                style={{marginTop:20}}
                width={250}
                height={110}
              />
            </View>
            <View style={{left:0,right:0,marginLeft:35,marginRight:35, textAlign:'justify',top:10, marginBottom:11,}}>
                <Text style={{color:'#000000', fontWeight:'normal', fontSize:12, textAlign:'center', lineHeight:20}}>
                  Please set your password before proceeding to Order tracking module
                  It's a good idea to use a strong password that you're not using elsewhere.
                </Text>
            </View>
            <View style={{
                  flexDirection: 'row',
                  height: 18,
                  marginTop: 11,
                  marginLeft: 40,
                  marginRight: 45,
            }}>
              <Text
                  style={styles.originalLabelStyle}>
                  NEW PASSWORD
              </Text>
            </View>
            <View style={styles.SectionStyle}>
              <Icon raised name="lock" size={20} color="#2a2d4a" style={styles.searchIcon}/>
              <TextInput
                style={styles.inputStyle}
                onChangeText={UserPassword => validateNewPassword(UserPassword)}
                underlineColorAndroid="#FFFFFF"
                placeholder="********" //12345
                placeholderTextColor="#3CB371"
                keyboardType="default"
                ref={passwordInputRef}
                onSubmitEditing={Keyboard.dismiss}
                blurOnSubmit={false}
                secureTextEntry={true}
              />
            </View>
            <View style={{
                  flexDirection: 'row',
                  height: 18,
                  marginTop: 11,
                  marginLeft: 40,
                  marginRight: 45,
            }}>
              <Text
                  style={styles.originalLabelStyle}>
                  CONFIRM PASSWORD
              </Text>
            </View>                                
            <View style={styles.SectionStyle}>
              <Icon raised name="lock" size={20} color="#2a2d4a" style={styles.searchIcon}/>
              <TextInput
                style={styles.inputStyle}
                onChangeText={UserConfirmedPassword => setUserConfirmNewPassword(UserConfirmedPassword)}
                underlineColorAndroid="#FFFFFF"
                placeholder="********" //12345
                placeholderTextColor="#3CB371"
                keyboardType="default"
                ref={passwordInputRef}
                onSubmitEditing={Keyboard.dismiss}
                blurOnSubmit={false}
                secureTextEntry={true}
              />
            </View>
            {(isLoading) ? ( <ActivityIndicator color="#000000" style={{margin: 35}} /> ) : null}
            {errortext != '' ? ( <Text style={styles.errorTextStyle}> {errortext} </Text> ) : null}
            <View style={{left:0,right:0,marginLeft:35,marginRight:35, textAlign:'justify', marginTop:30, marginBottom:1,flexDirection:'row'}}>
                <Icon raised name={iconNameEightCharacter} size={24} color="#afa3a3" style={styles.checkIcon}/>
                <Text style={{color:'#000000', fontWeight:'normal', fontSize:12, textAlign:'left', lineHeight:20}}>At Least 8 Characters</Text>
            </View>  
            <View style={{left:0,right:0,marginLeft:35,marginRight:35, textAlign:'justify',top:3, marginBottom:3,flexDirection:'row'}}>
                <Icon raised name={iconNameNumericalCharacter} size={24} color="#afa3a3" style={styles.checkIcon}/>
                <Text style={{color:'#000000', fontWeight:'normal', fontSize:12, textAlign:'left', lineHeight:20}}>Contain at least one numerical character</Text>
            </View>
            <TouchableOpacity
              style={styles.buttonStyle}
              activeOpacity={0.5}
              onPress={handleSubmitPress}>
              <Text style={styles.buttonTextStyle}>SUBMIT</Text>
            </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default CreatePasswordScreen;