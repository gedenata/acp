//import React in our code
import React, { useState }  from 'react';

// Import all the components we are going to use
import { 
    SafeAreaView, 
    View,
    Text,
    Image,
    TouchableOpacity,
    Dimensions,
    Platform
} from 'react-native';
import {API_URL} from '@env';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {WebView} from 'react-native-webview';

const { width } = Dimensions.get('window');
const widthMultiplier = width / 400;
const headerTopMargin = Platform.OS === 'ios' ? 53 : 25;

const TnCFromMoreScreen = props => {

    const [dataHTML, setDataHTML] = useState('');

    const goBackToPage = () => {
      props.navigation.goBack()
    };

    async function getHTML() {
        try {
          let url = `${API_URL}/WebApi1/april/api/tnc`;
          let response = await fetch(url,{ method: 'POST', headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8', }, })
          let responseJson = await response.json();

          setDataHTML(''+responseJson.Details); 
          return ""+responseJson.Details;
        }catch(error) {}
    }
    
    getHTML();
    let dataHTMLNew = "<html><head><style>body{font-size:30;padding-left:35;padding-right:35;margin-top:90}</style></head><body>" + dataHTML + "</body></html>";
    
  return (
    <SafeAreaView style={{flex: 1,backgroundColor:'#FDFDFD'}}>
      <View>    
        <Image
          source={require('AnRNApp/Image/bar.png')}
          style={{
            width: '100%',
            height: 80,
            top:0,
            resizeMode:'contain',
            borderRadius: 1000,
            borderTopLeftRadius:0,
            borderTopRightRadius:0,
            transform: [
              {scaleX: 12*widthMultiplier}
            ]
          }}
        />    
      </View>
      <View style={{ alignItems: 'center', position:'absolute', top:headerTopMargin, left:0, right:0 }}>
          <TouchableOpacity 
            style={{position:'absolute',left:0,marginLeft:20,marginTop:0,}}
            onPress={goBackToPage}
          >
            <Icon raised name="arrow-left" size={30} color="#FDFDFD"/>          
          </TouchableOpacity>
          <Text style={{ marginTop:0,color:'#FDFDFD',fontSize:19}}>Terms & Condition</Text>
      </View>              
      <WebView
        source={{html:''+dataHTMLNew}}
        style={{marginTop: 1, paddingLeft:10, paddingRight:10, marginLeft:5, marginRight:5}}
      />
    </SafeAreaView>
  );
};

export default TnCFromMoreScreen;