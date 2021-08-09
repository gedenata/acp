import {StyleSheet} from 'react-native';

const StylesComponent = StyleSheet.create({
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
      height: 18,
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
      marginTop: 20,
      marginBottom: 20,
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
      marginTop:10,
      marginBottom:50,
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

  export default StylesComponent;