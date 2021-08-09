import React, { useState }  from 'react';
import {APP_API} from '@env';
import { SafeAreaView,   StyleSheet, Text, TouchableOpacity, } from 'react-native';
import {WebView} from 'react-native-webview';

const TnCScreen = props => {

    const [dataHTML, setDataHTML] = useState('');
    async function getHTML() {
        try {
          let url = `${APP_API}/tnc`; 
          let response = await fetch(url,{
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
            },
          })
          let responseJson = await response.json();
          setDataHTML(''+responseJson.Details); 
          return ""+responseJson.Details;
        } catch (error) {}
    }
    
    getHTML();
    let dataHTMLNew = "<html><head><style>body{font-size:30;padding-left:30;padding-right:30}</style></head><center style='margin-top:100;margin-bottom:100'><h2>Terms & Condition</h2></center><body>" + dataHTML + "</body></html>";
    
  return (
    <SafeAreaView style={{flex: 1,backgroundColor:'#FDFDFD'}}>
      <WebView
        source={{html:''+dataHTMLNew}}
        style={{marginTop: 1, paddingLeft:10, paddingRight:10, marginLeft:5, marginRight:5}}
      />
     <TouchableOpacity
        style={styles.buttonStyle}
        activeOpacity={0.5}
        onPress={() => props.navigation.navigate('CreatePassword')}
      >
        <Text style={styles.buttonTextStyle}>AGREE</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.buttonStyle2}
        activeOpacity={0.5}
        onPress={() => props.navigation.navigate('LoginStack')}
      >
        <Text style={styles.buttonTextStyle2}>DISAGREE</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default TnCScreen;


const styles = StyleSheet.create({
    image: {
      flex: 1,
      resizeMode: "center",
      justifyContent: "center"
    },
    mainBody: {
      flex: 1,
      justifyContent: 'center',
      backgroundColor: '#FDFDFD',
    },
    LabelStyle: {
      flexDirection: 'row',
      height: 14,
      marginTop: 2,
      marginLeft: 35,
      marginRight: 45,
      margin: 2,
    },  
    originalLabelStyle: {
      color: '#000000',
      textAlign: 'center',
      fontWeight: 'bold',
      fontSize: 13,
    },    
    searchIcon: {
      padding: 10,
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
      marginTop: 5,
      marginBottom: 2,
    },
    buttonStyle2: {
        fontFamily:'sans-serif-light',
        backgroundColor: '#FDFDFD',
        fontWeight:'bold',
        borderWidth: 1,
        color: '#000000',
        borderColor: '#000000',
        height: 40,
        alignItems: 'center',
        borderRadius: 40,
        marginLeft: 35,
        marginRight: 35,
        marginTop: 2,
        marginBottom: 20,
      },    
      buttonTextStyle2: {
        color: '#2E8B57',
        paddingVertical: 10,
        fontSize: 16,
      },      
    buttonTextStyle: {
      color: '#FFFFFF',
      paddingVertical: 10,
      fontSize: 16,
    },
    SectionStyle: {
      flex:1,
      flexDirection: 'row',
      alignItems:'center',
      height:50,
      marginLeft:35,
      marginRight:35,
      marginBottom:5,
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
    welcomeTextStyle: {
      marginBottom:50,
      color: '#000000',
      textAlign: 'center',
      fontWeight: 'normal',
      fontSize: 13,
    },  
    originalTextStyle: {
      color: '#000000',
      textAlign: 'center',
      fontWeight: 'normal',
      fontSize: 13,
    },  
    registerTextStyle: {
      color: '#000000',
      textAlign: 'center',
      fontWeight: 'bold',
      fontSize: 14,
    },
    errorTextStyle: {
      color: 'red',
      textAlign: 'center',
      fontSize: 14,
    },
  });