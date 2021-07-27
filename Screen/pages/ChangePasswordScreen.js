import React, { useState, createRef } from 'react';
import {
  TouchableOpacity,
  TextInput,  
  StyleSheet,
  Image,  
  Keyboard,
  View,
  Text,
  SafeAreaView,
  Dimensions,    
  ScrollView,
  ToastAndroid,
  ActivityIndicator,  
} from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome';
import Moment from 'moment';
import AsyncStorage from '@react-native-community/async-storage';

import AESEncryption from './../Components/AESEncryption';
import {API_URL} from '@env';

const { width } = Dimensions.get('window');
const widthMultiplier = width / 400;

const ChangePasswordScreen = ({route, navigation}) => {      

  let [errortext, setErrortext] = useState('');
  let [userOldPassword, setUserOldPassword] = useState('');
  let [userNewPassword, setUserConfirmNewPassword] = useState('');
  let [userNewConfirmedPassword, setUserNewPassword] = useState('');
  const [isLoading, setLoading] = useState(false);
  const [iconNameEightCharacter, setIconNameEightCharacter] = useState('times-circle-o');
  const [iconNameNumericalCharacter, setIconNameNumerical] = useState('times-circle-o');  
  let [encryptedTextValue, setEncryptedText] = useState('');

  const passwordInputRef = createRef();  

  AsyncStorage.getItem('user_id').then(
    (value) =>{
      AESEncryption("decrypt",value).then((respp)=>{
        setEncryptedText("" + JSON.parse(respp).data.EncryptText)
      });// End of encryption/decryption
    },
  );   

  const handleSubmitPress = () => {

    if(userNewPassword != userNewConfirmedPassword){
      ToastAndroid.show("Your password and confirmation password don't match", ToastAndroid.LONG);
      // alert("Your password and confirmation password don't match");
      return false;
    }

    if(iconNameEightCharacter == "check-circle-o" && iconNameNumericalCharacter == "check-circle-o"){
      setLoading(true);
      var dataToSend = { 
        EncryptText: encryptedTextValue,
        OldPassword:userOldPassword, 
        NewPassword: userNewPassword,
      };

      var formBody = [];
      for (let key in dataToSend) {
        var encodedKey = encodeURIComponent(key);
        var encodedValue = encodeURIComponent(dataToSend[key]);
        formBody.push(encodedKey + '=' + encodedValue);
      }
      formBody = formBody.join('&');
      let url = `${API_URL}/WebApi1/april/api/reset/password`;
      fetch(url, {
        method: 'POST',
        body: formBody,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        },
      })
      .then(response => {
          if(response.status == 200){
            setLoading(false);
            ToastAndroid.show("Password Successfully Updated", ToastAndroid.LONG);
            navigation.navigate('Profile');
          }else{
            if(response.status == 400){
              setErrortext("Missing a needed input (check input variable name)")
            }else if(response.status == 401){
              setErrortext("Unauthorized")              
            }
            setLoading(false);
          }
      })
      .catch(error => {
        setLoading(false);
        console.error(error);
      });      

    }else{
      ToastAndroid.show("Invalid Password Format", ToastAndroid.LONG);      
      setLoading(false);
    }
  }

  Moment.locale('en');  

  const goBackToPage = () => {
    navigation.goBack()
  };     

  function validateNewPassword(newPassword){

    const numericalCharacterCondtion = new RegExp('(?=.*[0-9])', 'g')
    
    setIconNameNumerical(numericalCharacterCondtion.test(newPassword) ? 'check-circle-o' : 'times-circle-o')
    setIconNameEightCharacter((newPassword.length > 7) ? 'check-circle-o' : 'times-circle-o')
    setUserNewPassword(newPassword);
  }

  return (
    <SafeAreaView style={styles.mainBody}>
      <ScrollView>       
        <View>                 
          <View>    
          <Image
            source={require('AnRNApp/Image/bar.png')}
            style={{
              width: '100%',
              height: 85,
              top:0,
              resizeMode:'contain',
              borderRadius: 1000,
              borderTopLeftRadius:0,
              borderTopRightRadius:0,
              transform: [
                {scaleX: 7*widthMultiplier}
              ]
            }}
          />
          </View>
          <View style={{ alignItems: 'center', position:'absolute', top:10, left:0, right:0 }}>
              <TouchableOpacity 
                style={{position:'absolute',left:0,marginLeft:20,marginTop:10,}}
                onPress={goBackToPage}
              >
                <Icon raised name="arrow-left" size={30} color="#FDFDFD"/>          
              </TouchableOpacity>
              <Text style={{ marginTop:12,color:'#FDFDFD',fontSize:19, fontWeight:'bold'}}>
                Change Password
              </Text>
          </View>
          <View 
              style={{
                justifyContent:'flex-start',
                flexDirection:'row',
                marginTop:110,
                position:'absolute',
                color:'#FDFDFD',
                left:0,
                right:0,
                alignItems:'center',
              }}
          >
          </View>
            <View style={{left:0,right:0,marginLeft:35,marginRight:35, textAlign:'justify',top:20, marginBottom:31,}}>
                <Text style={{color:'#000000', fontWeight:'normal', fontSize:12, textAlign:'left', lineHeight:20}}>Update your password as below. Please note that passwords are case sensitive</Text>
            </View>
            <View style={styles.LabelStyle}>
              <Text
                  style={styles.originalLabelStyle}>
                  OLD PASSWORD
              </Text>
            </View>                                
            <View style={styles.SectionStyle}>
              <Icon raised name="lock" size={20} color="#2a2d4a" style={styles.searchIcon}/>
              <TextInput
                style={styles.inputStyle}
                onChangeText={UserPassword => setUserOldPassword(UserPassword)}
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
            <View style={styles.LabelStyle}>
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
            <View style={styles.LabelStyle}>
              <Text style={styles.originalLabelStyle}>CONFIRM PASSWORD</Text>
            </View>
            <View style={styles.SectionStyle}>
              <Icon raised name="lock" size={20} color="#2a2d4a" style={styles.searchIcon}/>
              <TextInput
                style={styles.inputStyle}
                onChangeText={UserPassword => setUserConfirmNewPassword(UserPassword)}
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
            {(isLoading) ? (
            <ActivityIndicator
              color="#000000"
              style={{margin: 35}} />
            ) : null}
            {errortext != '' ? (
                  <Text style={styles.errorTextStyle}> {errortext} </Text>
                ) : null}
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
              <Text style={styles.buttonTextStyle}>CONFIRM</Text>
            </TouchableOpacity>
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
    flex:1,
    flexDirection: 'row',
    alignItems:'center',
    height:42,
    marginLeft:35,
    marginRight:35,
    marginBottom:2,
    marginTop:5,
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
    fontFamily:'sans-serif-light',
    backgroundColor: '#2E8B57',
    fontWeight:'bold',
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
    marginRight:15
  },    
});
export default ChangePasswordScreen;