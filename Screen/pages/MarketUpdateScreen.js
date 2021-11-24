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
  TouchableOpacity,
  Dimensions
} from 'react-native';
import {ACCESS_API} from '@env';
import Loader from './../Components/loader';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Moment from 'moment';
import AsyncStorage from '@react-native-community/async-storage';

import DeviceInfo from 'react-native-device-info';
import LOGOSVG from 'AnRNApp/Image/svg_logo/emptystate_noresults.svg';

import AESEncryption from './../Components/AESEncryption';
//import {MarketUpdateContext} from './../Components/MarketUpdateContext';
import { fetchMarketUpdates, readTempMarketUpdates } from './../Components/marketUpdateUtils';

const { width } = Dimensions.get('window');
const widthMultiplier = width / 400;

const MarketUpdateScreen = ({route, navigation}) =>
{
    const [itemList, setItemList] = useState([]);

    const [ fontScale, setFontScale ] = useState(1);

    //const [ unreadMarketUpdates, setUnreadMarketUpdates ] = useContext(MarketUpdateContext);

    DeviceInfo.getFontScale().then((fontScaleTemp) => {
      setFontScale(fontScaleTemp)
    });

    const goBackToPage = () => { navigation.goBack(); };

    const directToDetail = async(SurveyID) => {
      await readTempMarketUpdates(SurveyID);
      navigation.navigate('MarketUpdateDetail', {id:SurveyID})
      const parent = navigation.dangerouslyGetParent();
      parent.setOptions({
        tabBarVisible: true
      });
      return () => parent.setOptions({ tabBarVisible: true });
    }

    const buildUpdateList = ({item}) => {
      return (
        <View
          style={{
            flex: 1,
            backgroundColor:'#FFFFFF',
            minHeight: 56,
            marginRight:((width <= 360 || fontScale > 1.2) ? 7 : 30),
            marginLeft:((width <= 360 || fontScale > 1.2) ? 7 : 30),
            color:'#000000',
            marginBottom:10,
            marginTop:10,
          }}
          key="outstanding{item.OrderNumber}"
        >
          {item.SurveyImageData != null
          ?
          <View
            style={{
              width:'100%',
              height:180,
              overflow:'hidden',
              borderTopLeftRadius:12,
              borderTopRightRadius:12,
              borderWidth:1,
              borderColor:'#fff',
            }}
          >
            <Image
              style={{
                width: '100%',
                height: '100%',
              }}
              source={{ uri: `data:image/jpg;base64,${ item.SurveyImageData }`}}
            />
          </View>
          :
          <></>
          }
          <TouchableOpacity
            style={{
              flex: 1,
              backgroundColor:'#ffffff',
              borderBottomLeftRadius:12,
              borderBottomRightRadius:12,
              borderTopLeftRadius:(item.SurveyImageData != null ? 0 : 12),
              borderTopRightRadius:(item.SurveyImageData != null ? 0 : 12),
              borderColor:'#ddd',
              borderWidth:1,
            }}
            onPress={ () => {
              directToDetail(item.MarketUpdateId) }
            }
          >
            <View style={{position:'absolute',left:0,height:30,width:3,backgroundColor:'#00854F',marginTop:8, borderTopRightRadius:2, borderBottomRightRadius:2}}/>
            <View style={{flex: 1, }}>
              <View style={{flex: 1,}}>
                <View style={{flex: 1, flexDirection: "row", marginTop:10, marginBottom:10,}}>
                  <View style={{flex: 1, paddingLeft: 10, marginRight:100}}>
                    <Text style={{ fontSize:12, color:'#000000', fontFamily:'HelveticaNeue-Bold'}}>{item.Title}</Text>
                  </View>
                </View>
                <View style={{flex: 2, marginBottom:3, marginTop:10}}>
                  <View style={{flex: 1, paddingLeft: 10}}>
                    <Text style={{fontSize:13, color:'#000000', fontFamily:'HelveticaNeue', opacity:0.6, marginRight:5,}}>{item.Details.replace(/(<([^>]+)>)/ig, ' ').replace(/(\&([a-zA-Z0-9]+);)/,' ').replace('  ',' ').substring(0,150).trim()}</Text>
                  </View>
                  <View style={{flex: 2, paddingLeft: 10, flexDirection:'row',marginTop:8, marginBottom:5}}>
                    <View style={{flex:1}}>
                      <Text style={{fontSize:12, color:'#000000',textAlign:'left',fontFamily:'HelveticaNeue-Bold'}}>Updated on</Text>
                    </View>
                    <View style={{flex:1}}>
                      <Text style={{fontSize:12, color:'#000000',textAlign:'right',fontFamily:'HelveticaNeue', marginRight:10}}>{item.LastUpdated}</Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        </View>
      )
    }

    useEffect(() =>
    {
      setLoading(true);
      AsyncStorage.getItem('user_id').then(
        (value) =>
        {
          AESEncryption("decrypt",value).then(async(respp)=>{
            var json = await fetchMarketUpdates(JSON.parse(respp).data.Token);
            setItemList(json);
            setLoading(false);
          });// End of encryption/decryption
        }
      );
    }, []);

    Moment.locale('en');

    let [loading, setLoading] = useState(false);

    return (
      <SafeAreaView style={styles.mainBody}>
      <Loader loading={loading} />
      <ScrollView>
      <Image
          source={require('AnRNApp/Image/bar.png')}
          style={{
            width: '100%',
            height: 100,
            top:-30,
            resizeMode:'contain',
            borderRadius: 1000,
            borderTopLeftRadius:0,
            borderTopRightRadius:0,
            transform: [
              {scaleX: 8*widthMultiplier}
            ]
          }}
      />
      <View style={{ alignItems: 'center', position:'absolute', top:10, left:0, right:0 }}>
          <TouchableOpacity style={{position:'absolute',left:0,marginLeft:10,marginTop:4,}} onPress={goBackToPage}>
            <Icon raised name="arrow-left" size={30} color="#FDFDFD"/>
          </TouchableOpacity>
          <Text style={{ marginTop:7,color:'#FDFDFD',fontSize:(fontScale < 1.2 ? 19 : 20/fontScale), fontFamily:'HelveticaNeue-Bold' }}>Market Update</Text>
      </View>
      {
      itemList.length == 0
      ?
        <View>
              <LOGOSVG
                style={{marginTop:20,alignSelf:'center',alignItems:'center'}}
                width={300}
                height={140}
              />
              <Text
                  style={{
                    alignSelf:'center',
                    alignItems:'center'
                  }}
              >No survey is available now</Text>
        </View>
      :
        <FlatList
            data={itemList}
            keyExtractor={(item, index) => "ItemList_" + index.toString()}
            renderItem={buildUpdateList}
        />
      }
      </ScrollView>
      {
      (route.params) ?
      (
        (route.params.notificationText != "") ?
        (
        <View
        >
          <View>
            <TouchableOpacity
              style={{bottom:60,right:10,position:'absolute',height:20,width:20,}}
              onPress={() => {
                navigation.navigate('MarketUpdate',{notificationText:'',status:''});
              }}
            >
              <AntDesign
                name="closesquare"
                size={20}
                color="#00854F"
                style={{borderRadius:5,}}
              />
            </TouchableOpacity>
          </View>
          <View style={{ position:'absolute', bottom:10, left:10, right:10, height:50, borderRadius:7, backgroundColor:'#00854F', paddingTop:10, paddingBottom:10, }}>
            <AntDesign name={(route.params.status == "ok") ? "checkcircle" : "closecircle"} size={35} color="#FDFDFD" style={{margin:6,marginLeft:10,position:'absolute'}} />
            <Text style={{color:'#FDFDFD',position:'absolute',left:60,right:60, top:7, fontSize:12}}>{(route.params) ? route.params.notificationText : ''}</Text>
          </View>
        </View>
        )
        :
        (<></>)
      )
      :
        (<></>)
      }
      </SafeAreaView>
    );
};

const styles = StyleSheet.create({
  mainBody: {
    flex: 1,
    backgroundColor: '#fdfdfd',
  },
  SectionStyle: {
    flex:1,
    flexDirection: 'row',
    alignItems:'center',
    height:50,
    marginLeft:35,
    marginRight:35,
    marginBottom:15,
    borderWidth: 0.5,
    borderRadius: 10,
    borderColor: '#685640',
  },
  searchIcon: {
    padding: 10,
  },
  buttonStyle: {
    backgroundColor: '#2E8B57',
    fontWeight:'bold',
    borderWidth: 0,
    color: '#000000',
    borderColor: '#228B22',
    height: 30,
    alignItems: 'center',
    borderRadius: 15,
    width:75,
    justifyContent:'center',
  },
  buttonTextStyle: {
    fontFamily:'HelveticaNeue-Bold',
    color: '#FFFFFF',
    fontSize: 12,
  },
});

export default MarketUpdateScreen;