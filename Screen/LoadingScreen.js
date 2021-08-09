//Import React and Hooks we needed
import React, { useState, useEffect } from 'react';

//Import all required component
import { ActivityIndicator, View, StyleSheet, Text } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import LOGOSVG from 'AnRNApp/Image/svg_logo/user-icon.svg';
import LOGOSVG2 from 'AnRNApp/Image/svg_logo/aprilconnect_verticallogo-white-large.svg';
import AESEncryption from './Components/AESEncryption';

const LoadingScreen = props => {
  //State for ActivityIndicator animation
  let [animating, setAnimating] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setAnimating(false);
      //Check if user_id is set or not
      //If not then send for Authentication
      //else send to Home Screen
      AsyncStorage.getItem('user_id').then(value =>{
        AESEncryption("decrypt",value).then((respp)=>{
          props.navigation.navigate(
            value === null ? 'HomeStack' : 'DrawerNavigationRoutesStack'
          )
        });// End of encryption/decryption
      });
    }, 2000);
  }, []);

  return (
    <View style={styles.container}>
      <LOGOSVG2
        style={{marginTop:50}}
        width={250}
        height={110}
      />      
      <LOGOSVG
        style={{marginTop:50}}
        width={190}
        height={60}
      />
      <Text style={{color:'#FDFDFD'}}>Login Successful!</Text>
      <Text style={{color:'#FDFDFD'}}>Please stand by</Text>
      <ActivityIndicator
        animating={animating}
        color="#FFFFFF"
        size="large"
        style={styles.activityIndicator}
      />
    </View>
  );
};
export default LoadingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#228B22',
  },
  activityIndicator: {
    alignItems: 'center',
    height: 80,
  },
});
