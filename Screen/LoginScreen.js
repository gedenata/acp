// Import React and Hook we needed
import React from 'react';

// Import all required component
import {
  StyleSheet,
  ImageBackground,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
} from 'react-native';

import LOGOSVG from 'AnRNApp/Image/svg_logo/aprilconnect_verticallogo-coloured.svg';

const LoginScreen = props => {

  return (
    <View style={styles.mainBody}>
    <ImageBackground source={require('../Image/ForestBig2.png')} style={styles.image}>
      <View style={styles.overlay}>
          <ScrollView keyboardShouldPersistTaps="handled">
            <View style={{ marginTop: 65 }}>
              <KeyboardAvoidingView enabled>
                <View style={{ alignItems:'center'}}>
                  <LOGOSVG
                    style={{marginTop:50}}
                    width={250}
                    height={110}
                  />
                </View>
                <Text style={styles.welcomeTextStyle}>
                  Welcome to APRIL Connect!
                </Text>
                <Text style={styles.originalTextStyle}>
                  Access your order status in real time
                </Text>
                <TouchableOpacity style={styles.buttonStyle} activeOpacity={0.9} onPress={() => props.navigation.navigate('LoginNextStack')}>
                  <Text style={styles.buttonTextStyle}>LOG IN</Text>
                </TouchableOpacity>
                <Text style={styles.originalTextStyle}>
                  v2.6.3
                </Text>
              </KeyboardAvoidingView>
            </View>
          </ScrollView>
        </View>
      </ImageBackground>            
    </View>
  );
};
export default LoginScreen;

const styles = StyleSheet.create({
  image: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center"
  },overlay: {
    flex:1,
    backgroundColor:'rgba(0,0,51,0)',
  },
  mainBody: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#307ecc',
  },
  SectionStyle: {
    flexDirection: 'row',
    height: 40,
    marginTop: 20,
    marginLeft: 35,
    marginRight: 35,

    margin: 10,
  },
  buttonStyle: {
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
  },
  buttonTextStyle: {
    color: '#FFFFFF',
    fontFamily:'HelveticaNeue-Bold',
    fontSize: 15,
  },
  inputStyle: {
    flex: 1,
    color: 'white',
    paddingLeft: 15,
    paddingRight: 15,
    borderWidth: 1,
    borderRadius: 30,
    borderColor: 'white',
  },
  welcomeTextStyle: {
    marginTop:200,
    color: '#FFFFFF',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 18,
  },  
  originalTextStyle: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontWeight: 'normal',
    fontSize: 13,
  },  
  registerTextStyle: {
    color: '#FFFFFF',
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