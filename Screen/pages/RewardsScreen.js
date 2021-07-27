// import React in our code
import React, {useState, useEffect} from 'react';

// import all the components we are going to use
import {
  SafeAreaView,
  View,
  StyleSheet,
  Image,
  Text,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  FlatList
} from 'react-native';
import {API_URL} from '@env';
import Loader from './../Components/loader';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Octicons from 'react-native-vector-icons/Octicons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import AntDesign from 'react-native-vector-icons/AntDesign';

import AsyncStorage from '@react-native-community/async-storage';
import DeviceInfo from 'react-native-device-info';
import LOGOSVG from 'AnRNApp/Image/svg_logo/emptystate_noresults.svg';

import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

const { width } = Dimensions.get('window');
const widthMultiplier = width / 400;

import { Modalize } from 'react-native-modalize';
import AESEncryption from './../Components/AESEncryption';

const RewardsScreen = ({route, navigation}) => 
{
    const [ fontScale, setFontScale ] = useState(1);
    const [ loading , setLoading ] = useState(false);
    const [ itemList, setItemList] = useState([]);
    const [ companyList, setCompanyList] = useState([]);
    const [ listProducts, setListProducts] = useState([]);
    const [ displayedCompany, setDisplayedCompany ] = useState("");
    const [ selectedProduct, setSelectedProduct ] = useState("");

    const [ expandedCard, setExpandedCard ] = useState('');
    const [ modalizePurpose, setModalizePurpose ] = useState('company');

    const Tab = createMaterialTopTabNavigator();
    const modalizeRef = React.createRef();

    const onOpen = (purpose) => { 
      setModalizePurpose(purpose);
      modalizeRef.current?.open(); 
    };

    const handleSelect = (nameTemp) => {
      let counter=0;
      let multipleCategoriesTemp = [];
      while(true){
          if(companyList[counter].companyName == nameTemp){
              multipleCategoriesTemp.push({ companyName:companyList[counter].companyName,products:companyList[counter].products,selected: true })
              setDisplayedCompany(nameTemp);
          }else{
            multipleCategoriesTemp.push({ companyName:companyList[counter].companyName,products:companyList[counter].products,selected: false })
          }
          counter++;
          if(counter >= companyList.length)
              break;
      }
      setCompanyList(multipleCategoriesTemp);
      modalizeRef.current.close();
      navigation.push('Rewards', {companyName:nameTemp});
    }

    const renderContent = () => [
          <View style={s.content__header} key="0">
              <Text style={s.content__heading}>Change {modalizePurpose == "company" ? "Company" : "Products"}</Text>
          </View>,
          <View style={s.content__inside} key="1">
            <ScrollView style={s.content__scrollview}>
            <View 
              style={{
                backgroundColor:'#FDFDFD',
                width:'100%',
              }}
            >
              <Text style={{width:'65%',fontSize:17,fontWeight:'bold', marginLeft:18, }}>Please Select {modalizePurpose == "company" ? "Company" : "Products"}</Text>
              {
                  modalizePurpose == "company"
                  ?
                  companyList.map((item, key) => (
                    <TouchableOpacity key={key} style={{marginTop:0, minHeight:45, borderBottomWidth:1, borderBottomColor:'#e4c2c250', flex:2, flexDirection:'row'}} onPress={() => { handleSelect(item.companyName) }}>
                      <View style={{left:20, justifyContent:'center', width:'70%' }}>
                        <Text style={{ fontSize:15, color:'#000000', textAlign:'left'}}>{item.companyName}</Text> 
                      </View>
                      <TouchableOpacity 
                          style={{position:'absolute',top:10,right:35}}
                          onPress={() => {
                            handleSelect(item.companyName)
                          }}
                      >
                          {companyList[key].selected == true ? (<AntDesign name="check" size={24} color="#00854F"/>) : (<AntDesign name="check" size={18} color="#00000060"/>) }
                      </TouchableOpacity>
                    </TouchableOpacity>
                  ))
                  :
                  listProducts.map((item, key) => (
                    <TouchableOpacity key={key} style={{marginTop:0, minHeight:45, borderBottomWidth:1, borderBottomColor:'#e4c2c250', flex:2, flexDirection:'row'}} onPress={() => { handleSubmitPress(key) }}>
                      <View style={{left:20, justifyContent:'center', width:'70%' }}>
                        <Text style={{ fontSize:15, color:'#000000', textAlign:'left'}}>{item}</Text> 
                      </View>
                      <TouchableOpacity 
                          style={{position:'absolute',top:10,right:35}}
                          onPress={() => { handleSubmitPress(key) }}
                      >
                          {item == selectedProduct ? (<AntDesign name="check" size={24} color="#00854F"/>) : (<AntDesign name="check" size={18} color="#00000060"/>) }
                      </TouchableOpacity>
                    </TouchableOpacity>
                  ))
                }
            </View>
            </ScrollView>
          </View>,
    ];

    const renderFooter = () => {
      return (
        <Text style={{justifyContent:'center', alignContent:'center', alignItems:'center', textAlign:'center', fontFamily:'HelveticaNeue', marginLeft:10, marginRight:10,}}>This values in this page are just an indicator, your achievements are not final</Text>
      );
    };

    const goBackToPage = () => { navigation.navigate("More") };
    DeviceInfo.getFontScale().then((fontScaleTemp) => {
      setFontScale(fontScaleTemp)
    });

    useEffect(() => 
    {
      setLoading(true);
      AsyncStorage.getItem('user_id').then(
        (value) =>
        {
          AESEncryption("decrypt",value).then((respp) =>
          {
            var dataToSend = {Token: ''+JSON.parse(respp).data.Token};

            var formBody = [];
            for (let key in dataToSend){
                var encodedKey = encodeURIComponent(key);
                var encodedValue = encodeURIComponent(dataToSend[key]);
                formBody.push(encodedKey + '=' + encodedValue);
            } 
            formBody = formBody.join('&');
            let companyURL = `${API_URL}/WebApi1/access/api/companylist`;
            fetch(companyURL,{
              method: 'POST',
              body: formBody, 
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
              },
            })
            .then((response) => response.json())
            .then(json => {
              let jsonTemp = [];
              setListProducts(json[0].products);
  
              setDisplayedCompany((route.params) ? (route.params.companyName) : json[0].companyName);
              setSelectedProduct((route.params) ? (route.params.productName) : json[0].products[0]);

              let parameterProduct = (route.params) ? (route.params.productName) : json[0].products[0];
  
              for(let i=0; i < json.length; i++)
              {
                json[i].selected = (route.params) ? (route.params.companyName == json[i].companyName ? true : false)  : ((i==0) ? true : false);
                jsonTemp.push(json[i]);
                if(route.params)
                {
                  if(route.params.companyName == json[i].companyName){
                    setListProducts(json[i].products);
                    if(!route.params.productName){
                      parameterProduct = json[i].products[0];
                      setSelectedProduct(json[i].products[0]);
                    }
                  }
                }
              }
              setCompanyList(jsonTemp);

              let dataToSend2 = {Token: ''+JSON.parse(respp).data.Token, CompanyName : (route.params) ? (route.params.companyName) : json[0].companyName, Product : parameterProduct};
  
              let formBody2 = [];
              for (let key in dataToSend2){
                  let encodedKey2 = encodeURIComponent(key);
                  let encodedValue2 = encodeURIComponent(dataToSend2[key]);
                  formBody2.push(encodedKey2 + '=' + encodedValue2);
              }
              formBody2 = formBody2.join('&');
              let rewardURL = `${API_URL}/WebApi1/access/api/rewardslist`;
              fetch(rewardURL,{
                method: 'POST',
                body: formBody2, 
                headers: {
                  'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
                },
              })
              .then((response) => response.json())
              .then(rwJsonData => {
                setItemList(rwJsonData);
              })
              .catch((error) => console.error(error))
              .finally(() => setLoading(false))            
  
            })
            .catch((error) => console.error(error))
          });          

        }
      );
    }, []);

    const buildItem = ({item}) => {

      return (
        <View 
          style={{
            marginRight:(fontScale > 1.2 ? 4 : 20), 
            marginLeft:(fontScale > 1.2 ? 4 : 20)
          }} 
          key={item.Header + item.Status}
        >
          <TouchableOpacity 
            key="outstanding{theCards.length}"
            style={{
              borderRadius:14,
              backgroundColor:(item.Status == "Term Ended" ? '#00000010' : '#fff'),
              minHeight:100,
              borderColor:'#ccc',
              borderWidth:1,
              color:'#000000',
              marginBottom:5, 
              marginTop:5,
              paddingLeft:8,
            }}
            onPress={()=>{
              setExpandedCard(expandedCard == item.Header ? "" : item.Header)
            }}
          >
            <View style={{position:'absolute',left:0,height:30,width:3,borderBottomRightRadius:2,borderTopRightRadius:2, backgroundColor:'#00854F',marginTop:8}}/>
                <Text style={{color:'#000000',marginTop:20, alignSelf:'center', fontSize:13,fontWeight:'bold'}}>{item.Header}</Text>
                <FontAwesome5
                  style={{position:'absolute',top:10,right:20}}
                  name="chevron-down" 
                  size={15}
                  color="#000000"
                />
            <View 
                style={{
                  flexDirection:'column',
                  flex:1,
                  width:'100%'
                }}
            >
              <View style={{ flex:3, flexDirection:'row',}}>
                  <View style={{flex:2}}>
                    <Text style={{marginTop:1,flex:1, color:(item.Status == "" ? "#00000080" : '#000000'),fontFamily:'HelveticaNeue-Bold', fontSize:35, textAlign:'center'}}>{item.TotalTarget}</Text>
                    <Text style={{marginTop:1,flex:1, color:(item.Status == "" ? "#00000080" : '#000000'),fontFamily:'HelveticaNeue-Bold', fontSize:14, textAlign:'center'}}>Target</Text>
                  </View>
                  <FontAwesome5
                    style={{top:12}}
                    name="grip-lines-vertical"
                    size={30}
                    color="#00000050"
                  />
                  <View style={{flex:2,}}>
                    <Text style={{marginTop:1,flex:1, color:(item.Status == "" ? "#00000080" : (item.TotalAchievement < item.TotalTarget ? '#FFAE34' : '#00854F')),fontFamily:'HelveticaNeue-Bold', fontSize:35, textAlign:'center'}}>{item.TotalAchievement}</Text>
                    <Text style={{marginTop:1,flex:1, color:(item.Status == "" ? "#00000080" : '#000000'),fontFamily:'HelveticaNeue-Bold', fontSize:14, textAlign:'center'}}>Achievement</Text>
                  </View>
              </View>
              {
                item.Header == expandedCard 
                ?
                setDetails(item.Details, item.Status)
                :
                (<></>)
              }
            </View>
            <View style={{width:'85%', marginTop:15, height:8,backgroundColor:'#C4C4C4',alignItems:'center',alignSelf:'center',borderRadius:3,flexDirection:'row'}}>
                <View style={{width:((item.TotalAchievement/item.TotalTarget)*100)+'%',height:7,backgroundColor:(item.TotalAchievement < item.TotalTarget ? '#FFAE34' : '#00854F'),borderRadius:3,left:0}}/>
            </View>
            <View style={{minHeight:30,marginTop:15, marginBottom:10, alignItems:'center', flex:2, flexDirection:'row'}}>
              <View style={{flex:1}}>
                <Text style={{color:(item.Status == "" || item.Status == "Current Status" ? '#000000' : '#75787C') ,marginTop:4, fontSize:14, fontWeight:'bold', textAlign:'left',paddingLeft:12}}>{item.Status}</Text>
              </View>
              <View style={{flex:1}}>
                <Text style={{color:(item.Status == "" ? "#000000" : item.TotalAchievement < item.TotalTarget ? '#FFAE34' : '#00854F'),marginTop:4, fontSize:14, fontWeight:'bold', textAlign:'right',paddingRight:20}}>{parseFloat((item.TotalAchievement/item.TotalTarget)*100).toFixed(2)}%</Text>
              </View>
            </View>              
          </TouchableOpacity>                     
        </View>
      )
    }

    function setDetails(details){
      let template = [];
      for(let key in details){
        template.push(
          <View style={{ flex:4, flexDirection:'row'}}>
              <View style={{width:'25%'}}>
                <Text style={{marginTop:0,left:23,color:'#000000',fontFamily:'HelveticaNeue-Bold', fontSize:12, textAlign:'left'}}>{details[key].Name}</Text>
              </View>
              <View style={{width:'25%'}}>
                <Text style={{marginTop:0,color:'#000000',fontFamily:'HelveticaNeue-Bold', fontSize:12,textAlign:'right', paddingRight:10, borderRightWidth:1, borderRightColor:'#00000070'}}>{details[key].Target}</Text>
              </View>
              <View style={{width:'30%'}}>
                <Text style={{marginTop:0,left:20,color:'#000000',fontFamily:'HelveticaNeue-Bold', fontSize:12, textAlign:'left'}}>{details[key].Name}</Text>
              </View>
              <View style={{width:'20%', paddingRight:0}}>
                <Text style={{marginTop:0,color:(details[key].Achievement < details[key].Target ? "#FFAE34" : '#000000'),fontFamily:'HelveticaNeue-Bold', fontSize:12, textAlign:'right', paddingRight:30,}}>{details[key].Achievement}</Text>
              </View>
          </View>
        )
      }
      return template;
    }

    function TabPage(data){
      let dataParsed = data.data;
      return (
        (data)
        ?
        <View style={{flex:1,backgroundColor:'#fff'}}>
          <View
            style={{
              maxHeight:30,
              flex:3,
              position:'absolute',
              top:0,
              marginTop:5, 
              flexDirection:'row',
            }}
          >
            <Text style={{paddingLeft:15, fontFamily:'HelveticaNeue-Bold',paddingTop:5,color:'#000000',fontSize:14}}>Legend: </Text>
            <Octicons
              name="primitive-dot"
              size={24}
              color="#FFAE34"
              style={{
                padding:5,
                marginLeft:20,
              }}
            />
            <Text style={{paddingLeft:5, fontFamily:'HelveticaNeue',paddingTop:5,color:'#000000',fontSize:14}}>Low</Text>
            <Octicons
              name="primitive-dot"
              size={24}
              color="#00854F"
              style={{
                padding:5,
                marginLeft:20,
              }}
            />
            <Text style={{paddingLeft:5, fontFamily:'HelveticaNeue',paddingTop:5,color:'#000000',fontSize:14}}>Great</Text>
          </View>
          <FlatList
            style={{marginTop:35,backgroundColor:'#fff'}}
            data={dataParsed.CardsInformation}
            keyExtractor={(item, index) => "ItemList_" + index.toString()}
            renderItem={buildItem}
            ListFooterComponent={renderFooter}
            extraData={expandedCard}
          />
        </View>
        :
          <></>
      )
    }

    // Force Load
    const handleSubmitPress = (productNumber) => {
      console.log("{companyName:" + displayedCompany + ", productName:" + listProducts[productNumber] + "}")
      navigation.push('Rewards', {companyName:displayedCompany, productName:listProducts[productNumber]})
    }    

    return (
      <SafeAreaView style={styles.mainBody}>
        <Modalize 
          ref={modalizeRef}
          modalHeight={300}
          scrollViewProps={{
              showsVerticalScrollIndicator: false,
              stickyHeaderIndices: [0],
          }}
        > 
          {renderContent()}
        </Modalize>        
        <Loader loading={loading} />        
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
            <Text style={{ marginTop:7,color:'#FDFDFD',fontSize:(fontScale < 1.2 ? 19 : 20/fontScale), fontFamily:'HelveticaNeue-Bold', }}>Rewards</Text>
        </View>
        <View style={{flexDirection:'row' }}>
            <View style={{paddingRight:11, alignContent:'center', alignSelf:'center', width:'35%', justifyContent:'center'}}>
              <Image
                source={require('AnRNApp/Image/DummyProfile.png')}
                style={{
                  width: 75,
                  height: 75,
                  alignSelf:'flex-end',
                }}
              />
            </View>
            <View style={{paddingRight:15, marginTop:-5, alignContent:'center', alignSelf:'center',flex:1, justifyContent:'center'}}>
              <TouchableOpacity style={{flex:2, flexDirection:'row'}} onPress={() => {onOpen('company')}} >
                <Text
                  style={{
                    fontFamily:'HelveticaNeue-Bold',
                    fontSize:17,
                    alignSelf:'center',
                    color:'#00854F'
                  }}
                >
                  {displayedCompany}
                </Text>
                <TouchableOpacity>
                  <FontAwesome
                    raised 
                    name="chevron-down"
                    size={18}
                    style={{
                      marginLeft:4,
                      marginTop:4
                    }}
                    color="#00854F"
                    onPress={() => {onOpen('company')}} 
                  />              
                </TouchableOpacity>
              </TouchableOpacity>
              <View style={{flex:2, flexDirection:'row', }}>
                {
                  (listProducts.length > 0 && listProducts.length <= 2)
                  ?
                    listProducts.map((item, key) => (
                      <TouchableOpacity
                          style={{
                            backgroundColor: (selectedProduct == listProducts[key] ? '#00854F' : '#00854F90'),
                            fontWeight:'bold',
                            borderWidth: 0,
                            marginRight:10,
                            color: '#000000',
                            borderColor: '#228B22',
                            height: 30,
                            alignItems: 'center',
                            borderRadius: 14,
                            width:75,
                            justifyContent:'center',
                          }}
                          activeOpacity={0.5}
                          onPress={() => { handleSubmitPress(key) }}
                      >
                        <Text style={{
                          fontFamily:'HelveticaNeue',
                          color: '#FFFFFF',
                          fontSize: 14,                              
                        }}>
                            {listProducts[key]}
                        </Text>
                      </TouchableOpacity>
                    ))
                  :
                    (listProducts.length >= 2)
                    ?
                      listProducts.map((item, key) => (
                        selectedProduct == listProducts[key] 
                        ?
                          [
                          <TouchableOpacity
                              style={{
                                backgroundColor: (selectedProduct == listProducts[key] ? '#00854F' : '#00854F90'),
                                fontWeight:'bold',
                                borderWidth: 0,
                                marginRight:10,
                                color: '#000000',
                                borderColor: '#228B22',
                                height: 30,
                                alignItems: 'center',
                                borderRadius: 14,
                                width:75,
                                justifyContent:'center',
                              }}
                              activeOpacity={0.5}
                              onPress={() => { handleSubmitPress(key) }}
                          >
                            <Text style={{
                              fontFamily:'HelveticaNeue',
                              color: '#FFFFFF',
                              fontSize: 14,                              
                            }}>
                                {listProducts[key]}
                            </Text>
                          </TouchableOpacity>
                          ,
                          <TouchableOpacity
                              style={{
                                backgroundColor: '#00854F90',
                                fontWeight:'bold',
                                borderWidth: 0,
                                color: '#000000',
                                borderColor: '#228B22',
                                height: 30,
                                alignItems: 'center',
                                borderRadius: 14,
                                width:125,
                                justifyContent:'center',
                              }}
                              activeOpacity={0.5}
                              onPress={() => { onOpen('products') }}
                          >
                            <Text style={{
                              fontFamily:'HelveticaNeue',
                              color: '#FFFFFF',
                              marginLeft:-20,
                              fontSize: 14,                              
                            }}>
                                Categories
                            </Text>
                            <FontAwesome5
                              style={{position:'absolute',right:20}}
                              name="chevron-down" 
                              size={12}
                              color="#ccc"
                            />
                          </TouchableOpacity>                          
                          ]                          
                        :
                          <></>
                      ))
                    :
                    <></>
                }
              </View>
            </View>            
        </View>
        <View
          style={{
            left:0,
            right:0,
            borderColor:'#eac3c3',  
            backgroundColor:'#FDFDFD',
            flex:1,
          }}
        >        
          {
              (itemList.AchivementCards)
              ?
                itemList.AchivementCards.length > 0
                ?
                  <Tab.Navigator>{
                    itemList.AchivementCards.map((item, key) => (           
                        <Tab.Screen key={key} name={item.Category} children={()=><TabPage data={item}></TabPage>}></Tab.Screen>
                    ))
                  }
                  </Tab.Navigator>
                :
                (
                  <View style={{marginLeft:20,marginRight:20, marginTop:20}}>
                        <LOGOSVG
                          style={{marginTop:20,alignSelf:'center',alignItems:'center'}}
                          width={300}
                          height={140}
                        />
                        <Text style={{alignSelf:'center', alignItems:'center', textAlign:'center', color:'#ac828b' }}>{(itemList.Message) ? itemList.Message : "You are currently not enrolled in our APRIL rewards program, please kindly contact your sales representative."}</Text>
                  </View>
                )
              :
              (
                <View style={{marginLeft:20,marginRight:20, marginTop:20}}>
                      <LOGOSVG
                        style={{marginTop:20,alignSelf:'center',alignItems:'center'}}
                        width={300}
                        height={140}
                      />
                        <Text style={{alignSelf:'center', alignItems:'center', textAlign:'center', color:'#ac828b' }}>{(itemList.Message) ? itemList.Message : "You are currently not enrolled in our APRIL rewards program, please kindly contact your sales representative."}</Text>                      
                </View>
              )
          }
        </View>
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
    marginRight:10,
    color: '#000000',
    borderColor: '#228B22',
    height: 30,
    alignItems: 'center',
    borderRadius: 14,
    width:75,
    justifyContent:'center',
  },
});


const s = StyleSheet.create({
  content__header: {
    padding: 15,
    paddingBottom: 0,
    borderBottomWidth:1,
    borderBottomColor:'#ccc',
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },

  content__heading: {
    marginBottom: 2,
    textAlign:'center',
    fontFamily:'HelveticaNeue-Bold',
    fontSize: 14,
    color: '#000',
  },

  content__subheading: {
    marginBottom: 20,
    fontSize: 16,
    color: '#ccc',
  },

  content__inside: {
    padding: 15,
  },

  content__paragraph: {
    fontSize: 15,
    fontFamily:'Rubik-Regular',      
    fontWeight: '200',
    lineHeight: 22,
    color: '#666',
  },

  content__scrollview: {},

  content__block: {
    width: 200,
    height: 80,
    marginRight: 20,
    backgroundColor: '#ccc',
  },

  content__input: {
    paddingVertical: 15,
    marginBottom: 10,
    width: '100%',
    borderWidth: 1,
    borderColor: 'transparent',
    borderBottomColor: '#cdcdcd',
    borderRadius: 6,
  },
});

export default RewardsScreen;