//import React in our code
import React, { useState, useEffect }  from 'react';

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

import Loader from './../Components/loader';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {WebView} from 'react-native-webview';

const { width } = Dimensions.get('window');
const widthMultiplier = width / 400;
const headerTopMargin = Platform.OS === 'ios' ? 53 : 25;

import AsyncStorage from '@react-native-community/async-storage';
import AESEncryption from './../Components/AESEncryption';

const MarketUpdateDetailScreen = ({route, navigation}) => {

    const [dataHTML, setDataHTML] = useState('');
    const [title, setTitle] = useState('');
    const [lastUpdate, setLastUpdate] = useState('');
    let [loading, setLoading] = useState(false);

    const goBackToPage = () => {
      navigation.goBack()
    };

    useEffect(() => 
    {
        setLoading(true);
        AsyncStorage.getItem('user_id').then((value) =>
        {
            AESEncryption("decrypt",value).then((respp)=>
            {
                var dataToSend = {Token: JSON.parse(respp).data.Token,MarketUpdateId:route.params.id};
                var formBody = [];
                for (let key in dataToSend){ var encodedKey = encodeURIComponent(key); var encodedValue = encodeURIComponent(dataToSend[key]); formBody.push(encodedKey + '=' + encodedValue); }
                formBody = formBody.join('&');
                let url = `${API_URL}/WebApi1/access/api/marketupdatedetails`;
                fetch(url, {method: 'POST', body: formBody,  headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8', },})
                .then((response) => response.json())
                .then(json => {
                    setLastUpdate(json.LastUpdated);
                    setTitle(json.Title);
                    setDataHTML("<html><head><style>body{font-size:30;padding-left:35;padding-right:35;margin-top:90;width:'50%'}</style></head><body>"+json.Details.replace(/\: /gi,':').replace(/\; /gi,';').replace(/style\="[a-zA-Z0-9\#\:\;\.\s\(\)\-\,]*"/gi,'')+"</body></html>");
                    setLoading(false);         
                });
            });// End of encryption/decryption  
        });
    }, []);

  return (
    <SafeAreaView style={{flex: 1,backgroundColor:'#FDFDFD'}}>
      <Loader loading={loading} />
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
          <Text style={{ marginTop:0,color:'#FDFDFD',fontSize:19}}>Market Update</Text>
      </View>
        {dataHTML != "" ? <Text style={{fontWeight:'bold',marginLeft:22, marginBottom:5, marginTop:10, fontSize:16, color:'#260679', fontFamily:'HelveticaNeue',}}>{title}</Text> : <></>}
        {dataHTML != "" ? <Text style={{fontWeight:'bold',marginLeft:22, marginTop:5, fontSize:12, color:'#ccc', fontFamily:'HelveticaNeue',}}>Updated on: {lastUpdate}</Text> : <></>}
        {dataHTML != "" ? 
        (
             <WebView
                source={{html:''+dataHTML}}
                style={{ paddingLeft:10, paddingRight:10, marginLeft:5, marginRight:5, borderTopColor:'#000000', borderWidth:1, }}
            />
        )
        :
            <></>
        }
    </SafeAreaView>
  );
};

export default MarketUpdateDetailScreen;