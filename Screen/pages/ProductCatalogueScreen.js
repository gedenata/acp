// import React in our code
import React, {useState, useEffect} from 'react';

// import all the components we are going to use
import {
  SafeAreaView,
  View,
  StyleSheet,
  Image,
  Text,
  FlatList,
  ScrollView,
  Platform,
  TouchableOpacity,
  Dimensions
} from 'react-native';
import {ACCESS_API} from '@env';
import Loader from './../Components/loader';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Moment from 'moment';
import AsyncStorage from '@react-native-community/async-storage';

import AESEncryption from './../Components/AESEncryption';
import DeviceInfo from 'react-native-device-info';

const { width } = Dimensions.get('window');
const widthMultiplier = width / 400;

const ProductCatalogueScreen = ({route, navigation}) => 
{
    const [itemList, setItemList] = useState([]);

    const goBackToPage = () => { navigation.goBack(); };

    const [ fontScale, setFontScale ] = useState(1);

  DeviceInfo.getFontScale().then((fontScaleTemp) => {
    setFontScale(fontScaleTemp);
  });

    const buildItemProductCatalogueList = ({item}) => {
      // console.log(JSON.stringify(item));
      return (
        <TouchableOpacity
          style={{ marginRight:20,marginLeft:20, marginBottom:20, borderRadius:8, justifyContent:'center'}}
          onPress={() => { 
              navigation.navigate('ProductCatalogueDetail', {PaperType:item.Name,status:'ok'})
            }
          }
        >
          <Image
            source={{ uri: `data:image/jpg;base64,${item.ImageData}`}}
            style={{
              height:90,
              borderRadius:5
            }}
          />
          <View style={{width:'100%', position:'absolute',}}>
            <Text 
              style={{
                color:'#ffffff', 
                textAlign:'center', 
                alignItems:'center',
                alignContent:'center',
                alignSelf:'center', 
                justifyContent:'center' , 
                fontSize:25,
                fontFamily:'HelveticaNeue',
              }}
            >{item.Name}</Text>
          </View>
        </TouchableOpacity>
      )
    }

    useEffect(() => 
    {
      setLoading(true);      
      AsyncStorage.getItem('user_id').then(
        (value) =>
        {
          AESEncryption("decrypt",value).then((respp)=>
          {
            var dataToSend = {Token: ''+JSON.parse(respp).data.Token};

            var formBody = [];
            for (let key in dataToSend){
                var encodedKey = encodeURIComponent(key);
                var encodedValue = encodeURIComponent(dataToSend[key]);
                formBody.push(encodedKey + '=' + encodedValue);
            }
            formBody = formBody.join('&');
            let url = `${ACCESS_API}/papertypes`;
            fetch(url,{
              method: 'POST',
              body: formBody, 
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
              },
            })
            .then((response) => response.json())
            .then(json => {
              setItemList(json);
              setLoading(false);
            })
            .catch((error) => console.error(error))
          });
        }
      );
    }, []);

    Moment.locale('en');  

    let [loading, setLoading] = useState(false);
  
    return (
      <SafeAreaView style={styles.mainBody}>
      <Loader loading={loading} />
        <Image
          source={require('AnRNApp/Image/bar.png')}
          style={{width: '100%', height: 100, top:-30, resizeMode:'contain', borderRadius: 1000, borderTopLeftRadius:0, borderTopRightRadius:0, transform: [ {scaleX: 8*widthMultiplier} ]}}
        />
        <View style={{ alignItems: 'center', position:'absolute', top: (Platform.OS === 'ios') ? 50 : 10, left:0, right:0 }}>
            <TouchableOpacity style={{position:'absolute',left:0,marginLeft:10,marginTop:4,}} onPress={goBackToPage}>
              <Icon raised name="arrow-left" size={30} color="#FDFDFD"/>
            </TouchableOpacity>
            <Text style={{ marginTop:7,color:'#FDFDFD',fontSize:(fontScale < 1.2 ? 19 : 20/fontScale), fontFamily:'HelveticaNeue-Bold' }}>Product Catalogue</Text>
        </View>
        <Text style={{fontWeight:'bold',marginLeft:22, marginBottom:10, fontSize:18, fontFamily:'HelveticaNeue',}}>Please Select Product Paper Type</Text>
        <FlatList
          style={{marginTop:0}}
          data={itemList}
          keyExtractor={(item, index) => "ItemList_" + index.toString()}
          renderItem={buildItemProductCatalogueList}
        />
      </SafeAreaView>              
    );
};

const styles = StyleSheet.create({  
  mainBody: {
    flex: 1,
    backgroundColor: '#fdfdfd',
  },
});
export default ProductCatalogueScreen;