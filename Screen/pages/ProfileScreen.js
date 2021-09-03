import React, {useEffect, useState} from 'react';
import {
  TouchableOpacity,
  KeyboardAvoidingView,
  Image,
  View,
  Text,
  SafeAreaView,
  ScrollView,
  Dimensions
} from 'react-native';

import AsyncStorage from '@react-native-community/async-storage';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ReactNativeBiometrics from 'react-native-biometrics';

import LOGOSVG from 'AnRNApp/Image/aprilconnect_horinzontallogo.svg';
import AESEncryption from './../Components/AESEncryption';

const ProfileScreen = props => {

  const [userEmail, setUserEmail] = useState('');
  const [biometricKeysExist, setBiometricKeysExist] = useState(false);
  const [biometricsNotSupported, setBiometricsNotSupported] = useState(false);

  useEffect(async () => {
    if(AsyncStorage.getItem('user_id')){

      AsyncStorage.getItem('user_id').then(
        (value) => {

          AESEncryption("decrypt",value).then((respp)=>{
            // console.log("Check session: " + JSON.parse(respp).data);
            if(JSON.parse(respp).data){
              if(JSON.parse(respp).data != null){
                setUserEmail("" + (JSON.parse(respp).data != null && (JSON.parse(respp).data)) ? JSON.parse(respp).data.UserEmail : "");
                // console.log(" Check di sini : " + JSON.parse(respp).data);
              }
            }
          });// End of encryption/decryption
        },
      );
      const {keysExist} = await ReactNativeBiometrics.biometricKeysExist();
      setBiometricKeysExist(keysExist);
      const biometrics_not_supported = await AsyncStorage.getItem('biometrics_not_supported');
      setBiometricsNotSupported(biometrics_not_supported === 'true');
    }
    else {
      props.navigation.navigate('SplashStack');
    }
  }, []);

  const goToChangePassword = () => {
    props.navigation.navigate('ChangePassword');
  }

  const { width } = Dimensions.get('window');

  const widthMultiplier = width / 550;

  const handleLogout = () => {
    AsyncStorage.removeItem('user_id');
    setUserEmail("");
    props.navigation.navigate('LoginStack');
    return;
  }

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: '#fdfdfd',
      }}
    >
      <ScrollView>
      <KeyboardAvoidingView enabled>
      <View>
        <Image
          source={require('AnRNApp/Image/bar.png')}
          style={{
            width: '100%',
            height: 200,
            top:-15,
            resizeMode:'contain',
            borderRadius: 1000,
            borderTopLeftRadius:0,
            borderTopRightRadius:0,
            transform: [{scaleX: 4*widthMultiplier}]
          }}
        />
      </View>
      <View style={{ alignItems: 'center', position:'absolute', top:10, left:0, right:0 }}>
        <LOGOSVG width={150} height={40}/>
      </View>
      <View style={{justifyContent:'flex-start',flexDirection:'row',alignItems:'stretch', position:'absolute', marginTop:60,marginLeft:50}}>
          <View style={{paddingRight:11, paddingBottom:5}}>
            <Image
              source={require('AnRNApp/Image/DummyProfile.png')}
              style={{
                width: 60,
                height: 60,
                borderRadius: 200 / 2
              }}
            />
          </View>
          <View>
          <Text style={{marginLeft:10,marginTop:25,color:'#FDFDFD',fontWeight:'bold',fontSize:15}}>
            {userEmail}
          </Text>
          </View>
      </View>
      <TouchableOpacity
        style={{
          height:25,
          width:'100%',
          right:2,
          left:2,
          marginTop:30,
          flexDirection:'row',
          borderStyle:'solid',
          borderWidth:0,
          borderColor:'#dbd4d4',
          borderBottomWidth:1,
          paddingBottom:10,
        }}
        onPress={goToChangePassword.bind(this)}
      >
        <View style={{left:0, position:'absolute', marginLeft:15,}}>
          <Text>Change Password</Text>
        </View>
        <View style={{right:0, marginBottom:8, position:'absolute', marginRight:20}}>
          <Icon raised name="menu-right" size={21} />
        </View>
      </TouchableOpacity>
      <TouchableOpacity
      style={{
        height:25,
        width:'100%',
        right:2,
        left:2,
        marginTop:30,
        flexDirection:'row',
        borderStyle:'solid',
        borderWidth:0,
        borderColor:'#dbd4d4',
        borderBottomWidth:1,
        paddingBottom:10,
      }}
      onPress={()=>{
        props.navigation.navigate('BiometricAuthentication');
      }}
      >
        <View style={{left:0, position:'absolute',marginLeft:15,marginTop:0,marginBottom:20,flex:2,flexDirection:'row'}}>
          <Text>Biometric Authentication</Text>
          {
            biometricKeysExist || biometricsNotSupported ? <></> :
            <View style={{marginLeft:10,marginTop:-8,height:28,width:28,borderRadius:28,backgroundColor:'#FF3A3A',justifyContent:'center'}}>
              <Text style={{fontFamily:'HelveticaNeue-Bold',fontSize:17,lineHeight:24,textAlign:'center',color:'#fff'}}>!</Text>
            </View>
          }
        </View>
        <View style={{right:0, marginBottom:8, position:'absolute', marginRight:20}}>
          <Icon raised name="menu-right" size={21} />
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        style={{
          height:25,
          width:'100%',
          right:2,
          left:2,
          marginTop:30,
          flexDirection:'row',
          borderStyle:'solid',
          borderWidth:0,
          borderColor:'#dbd4d4',
          borderBottomWidth:1,
          backgroundColor:'#FDFDFD',
          paddingBottom:10,
        }}
        onPress={handleLogout.bind(this)}
      >
        <View style={{
          left:0,
          position:'absolute',
          marginLeft:15,
        }}>
          <Text style={{color:'#c19292', fontWeight:'bold'}}>Sign Out</Text>
        </View>
      </TouchableOpacity>
      </KeyboardAvoidingView>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfileScreen;