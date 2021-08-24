//Import React and Hooks we needed
import React, { useState, useEffect } from 'react';

//Import all required component
import {ACCESS_API} from '@env';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import LOGOSVG from 'AnRNApp/Image/svg_logo/aprilconnect_verticallogo-white.svg';
import AESEncryption from './Components/AESEncryption';

const SplashScreen = props => {
  let [animating, setAnimating] = useState(true);
  
  useEffect(() => {
    setTimeout(() => 
    {
      if(animating)
      {
        setAnimating(false);
      
        if(AsyncStorage.getItem('user_id'))
        {
            // console.log("ada async storage");
            AsyncStorage.getItem('user_id').then(value =>
            {
                if (value === null) {
                  props.navigation.navigate('LoginStack');
                } else {
                    AESEncryption("decrypt",value).then((respp)=>{
                        if(respp !== null && (JSON.parse(respp).data))
                        {
                          var validTokenValue = (JSON.parse(respp).data.Token) ? JSON.parse(respp).data.Token : "";
                          if(!validTokenValue){
                            props.navigation.navigate('LoginStack');
                          }
                          else
                          {
                            var dataToSend = { SalesOrderID: '', Token: ''+validTokenValue, Skip:'0' };
                            var formBody = [];
                            for (let key in dataToSend) {
                              var encodedKey = encodeURIComponent(key);
                              var encodedValue = encodeURIComponent(dataToSend[key]);
                              formBody.push(encodedKey + '=' + encodedValue);
                            }
                            formBody = formBody.join('&');

                            var wasServerTimeout = false;
                            var timeoutCounter = setTimeout(() => {
                              wasServerTimeout = true;
                              props.navigation.navigate('LoginStack');
                            }, 15000); 

                            let url = `${ACCESS_API}/outstanding`; 
                            fetch(url,{
                              method: 'POST',
                              body: formBody,
                              headers: {
                                //Header Defination
                                'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
                              },
                            })
                            .then(response => {
                              timeoutCounter && clearTimeout(timeoutCounter);
                              // console.log("Processing token expiration response");
                              if(!wasServerTimeout){
                                props.navigation.navigate(
                                  (response.status == 200 || response.status == 406 ) ?  'DrawerNavigationRoutesStack' : 'LoginStack'
                                )
                              }
                            })
                            .catch((error) => {
                              timeoutCounter && clearTimeout(timeoutCounter);
                              // if (!wasServerTimeout) {
                              //   // console.log("Mobile app errror");
                              // }else{
                              //   // console.log("fetch errror");
                              // }
                              props.navigation.navigate('LoginStack');
                            })            
                          }
                        }else{
                          props.navigation.navigate('LoginStack');
                        }
                    })// End of encryption/decryption
                    .catch((error)=>{
                      props.navigation.navigate('LoginStack');
                    })
                }
            });
        }else{
          // console.log("no async storage");
          props.navigation.navigate('LoginStack'); 
        }
      }
    }, 2500);
  }, []);

  return (
    <View style={styles.container}>
      <LOGOSVG
        style={{marginTop:50}}
        width={190}
        height={60}
      />
      <ActivityIndicator
        animating={animating}
        color="#FFFFFF"
        size="large"
        style={styles.activityIndicator}
      />
    </View>
  );
};
export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#27408B',
  },
  activityIndicator: {
    alignItems: 'center',
    height: 80,
  },
});