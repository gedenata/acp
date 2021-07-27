import React, { useState, useEffect }  from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  Image,  
  View,
  Text,
  SafeAreaView,
  Dimensions,  
  Modal,
  FlatList,
  ScrollView,
  ActivityIndicator,    
} from 'react-native';
import { SliderBox } from 'react-native-image-slider-box';
import AsyncStorage from '@react-native-community/async-storage';
import Carousel from 'react-native-anchor-carousel';
import LOGOSVG from 'AnRNApp/Image/aprilconnect_horinzontallogo.svg';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import {InternetLinkHandler} from './../Components/InternetLinkHandler';

import DeviceInfo from 'react-native-device-info';
import AESEncryption from './../Components/AESEncryption';
import {API_URL} from '@env';

const HomeScreen = props => {

  const [isLoadingOutstanding, setLoadingOutstanding] = useState(true);
  const [isLoadingDelivered, setLoadingDelivered] = useState(true);
  const [isLoadingImage, setLoadingImage] = useState(true);
  const [tokenValue, setTokenValue] = useState('');       
  const [dataOutstanding, setOutstandingData] = useState([]);
  const [dataDelivered, setDeliveredData] = useState([]);
  const [firstScrollMarginLeftOutstanding, setFirstScrollMarginLeftOutstanding] = useState(0);
  const [firstScrollMarginLeftDelivered, setFirstScrollMarginLeftDelivered] = useState(0);
  const [bannerImages, setBannerImages] = useState([]);
  const [bannerImageLinks, setBannerImageLinks] = useState([]);

  const [ isLoadingSurvey, setIsLoadingSurvey ] = useState(false);
  const [ isLoadingSurveyData, setIsLoadingSurveyData ] = useState(false);
  const [ isLoadingNotificationToUser, setIsLoadingNotificationToUser ] = useState(false);
  const [ notificationToUser, setNotificationToUser ] = useState('');
  const [ notificationStatus, setNotificationStatus ] = useState('ok');
  const [ surveyData, setSurveyData ] = useState([]);
  const [ surveyQuestion, setSurveyQuestion ] = useState([])

  const [ fontScale, setFontScale ] = useState(1);

  DeviceInfo.getFontScale().then((fontScaleTemp) => {
    setFontScale(fontScaleTemp)
  });

  useEffect(() => {
    AsyncStorage.getItem('user_id').then(
    (value) =>
    {
        AESEncryption("decrypt",value).then((respp)=>{      
            setTokenValue("" + ((JSON.parse(respp).data != null && (JSON.parse(respp).data)) ? JSON.parse(respp).data.Token : ""))

            let dataToSend = {Token: JSON.parse(respp).data.Token};
            var formBody = [];
            for (let key in dataToSend){
                let v1_encodedKey = encodeURIComponent(key);
                let v1_encodedValue = encodeURIComponent(dataToSend[key]);
                formBody.push(v1_encodedKey + '=' + v1_encodedValue);
            }
            formBody = formBody.join('&');
            let url = `${API_URL}/WebApi1/access/api/marketsurveyandupdatespopup`;
            fetch(url, {
              method: 'POST',
              body: formBody,
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
              },
            })
            .then((response) => response.json())
            .then(json => {
              if(json.length > 0)
              {
                setIsLoadingSurvey(true);
                setIsLoadingSurveyData(true);
                setSurveyData(json);

                if(json[0].SurveyType == "Poll")
                {
                  let surveyDataToSend = {Token: ''+JSON.parse(respp).data.Token, SurveyID:''+json[0].SurveyID};

                  var formBody2 = [];
                  for (let key in surveyDataToSend)
                  {
                      let v2_encodedKey = encodeURIComponent(key);
                      let v2_encodedValue = encodeURIComponent(surveyDataToSend[key]);
                      formBody2.push(v2_encodedKey + '=' + v2_encodedValue);
                  }
                  formBody2 = formBody2.join('&');
                  let marketQuestionURL = `${API_URL}/WebApi1/access/api/marketsurveyquestion`;
                  fetch(marketQuestionURL, {
                      method: 'POST',
                      body: formBody2, 
                      headers: {
                      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
                      },
                  })
                  .then((response) => response.json())
                  .then(json2 => {
                      let counter = 0;
                      let jsonTemp = [];
                      while(counter < json2.length){
                          let counter2 = 0;
                          while(counter2 < json2[counter].QuestionChoices.length){
                            json2[counter].QuestionChoices[counter2].answer = "";
                              counter2++;
                          }
                          jsonTemp.push(json2[counter]);
                          counter++;
                      }
                      setIsLoadingSurveyData(false);
                      setSurveyQuestion(jsonTemp);
                  });
                }else{
                  setIsLoadingSurveyData(false);
                }


              }
            })
            .catch((error) => console.error(error))

            dataToSend = { SalesOrderID: '', Token: ''+JSON.parse(respp).data.Token, Skip:'0' /* route.params.SalesOrderID */ };
            formBody = [];
            for (let key in dataToSend) {
              var encodedKey = encodeURIComponent(key);
              var encodedValue = encodeURIComponent(dataToSend[key]);
              formBody.push(encodedKey + '=' + encodedValue);
            }
            formBody = formBody.join('&');
          
            if(isLoadingImage)
            {
              let bannerURL = `${API_URL}/WebApi1/access/api/banner`;
              fetch(bannerURL, {
                method: 'POST',
                body: formBody,      
                headers: {
                  //Header Defination
                  'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
                },
              })
              .then((response) => response.json())
              .then(json => {
                for(var i = 0; i < json.length; i++){
                  images.push(`data:image/png;base64,${json[i].BannerImage}`)
                  imageLinks.push(json[i]);
                }
                setBannerImages(images);
                setBannerImageLinks(imageLinks);
                setLoadingImage(false);
              })
              .catch((error) => console.error(error))    
            }
          
            if(isLoadingDelivered) {
              let deliveredURL = `${API_URL}/WebApi1/access/api/delivered`;
              fetch(deliveredURL,{
                method: 'POST',
                body: formBody,      
                headers: {
                  'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
                },
              })
              .then((response) => response.json())
              .then(json => {
                var jsonNew = [];
                for(var i = 0; i < json.length; i++){
                  jsonNew.push(json[i]);
                  if(i == 4){ i = json.length; }
                }
                setDeliveredData(jsonNew);
                setLoadingDelivered(false);
              })
              .catch((error) => console.error(error))
            }
          
            if(isLoadingOutstanding)
            {
              let outstandingURL = `${API_URL}/WebApi1/access/api/outstanding`;
              fetch(outstandingURL,{    
                method: 'POST',
                body: formBody,      
                headers: {
                  'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
                },
              })
              .then((response) => response.json())
              .then(json => {
                var jsonOutstanding = [];
                for(var i = 0; i < json.length; i++){
                  jsonOutstanding.push(json[i])
                  if(i == 4){
                    i = json.length;
                  }
                }
                setOutstandingData(jsonOutstanding);
                setLoadingOutstanding(false);
              })
              .catch((error) => console.error(error))
            }

        })
      }
    );
  }, []);

  const openBrowser = (imageIndex) => {
    InternetLinkHandler(bannerImageLinks[imageIndex].BannerLink);
  }

  const directToSurveyQuestion = (SurveyID) => {
    setIsLoadingSurvey(false);
    props.navigation.navigate('SurveyQuestion', {SurveyID:SurveyID})
  }  

  const { width } = Dimensions.get('window');
  
  const widthMultiplier = width / 400;
  const widthMultiplierOutstandingOrder = width / 400;

  const images = [];
  const imageLinks = [];

  const renderItemDelivered = ({ item, index }) => {

    return (
      <TouchableOpacity 
      style={{borderRadius:7,backgroundColor:'#091376',height:105,width:132,color:'#FDFDFD'}}
      onPress={() => showDetailOrder(''+(item.OrderNumber != "ALL" ? item.OrderNumber : ''))}
      key={item.OrderNumber}
    >
      <Text style={{color:'#FDFDFD',paddingLeft:10,paddingTop:5,fontSize:(fontScale < 1.2 ? 12 : 12/fontScale),fontWeight:'bold'}}>{(item.OrderNumber != "ALL" ? "Order No" : "View All Orders")}</Text>
      <Text style={{color:'#FDFDFD',paddingLeft:10,paddingTop:0,fontSize:(fontScale < 1.2 ? 12 : 12/fontScale),fontWeight:'bold'}}>{(item.OrderNumber != "ALL" ? item.OrderNumber : "View All Orders")}</Text>
      <Text style={{position:'absolute',color:'#FDFDFD',paddingLeft:10,paddingRight:10,bottom:10,fontSize:(fontScale < 1.2 ? 11 : 11/fontScale),fontWeight:'normal'}}>{(item.CustomerName != "ALL" ? item.CustomerName : "")}</Text>
    </TouchableOpacity> 
  );
  };

  const renderItemOutstanding = ({ item, index }) => {

    return (
        <TouchableOpacity 
        style={{borderRadius:7,backgroundColor:'#091376',height:105,width:132,color:'#FDFDFD'}}
        onPress={() => showDetailOrder(''+(item.OrderNumber != "ALL" ? item.OrderNumber : ''))}
        key={item.OrderNumber}        
      >
      <Text style={{color:'#FDFDFD',paddingLeft:10,paddingTop:5,fontSize:(fontScale < 1.2 ? 12 : 12/fontScale),fontWeight:'bold'}}>{(item.OrderNumber != "ALL" ? "Order No" : "View All Orders")}</Text>
      <Text style={{color:'#FDFDFD',paddingLeft:10,paddingTop:0,fontSize:(fontScale < 1.2 ? 12 : 12/fontScale),fontWeight:'bold'}}>{(item.OrderNumber != "ALL" ? item.OrderNumber : "View All Orders")}</Text>
      <Text style={{position:'absolute',color:'#FDFDFD',paddingLeft:10,paddingRight:10,bottom:10,fontSize:(fontScale < 1.2 ? 11 : 11/fontScale),fontWeight:'normal'}}>{(item.CustomerName != "ALL" ? item.CustomerName : "")}</Text>
      </TouchableOpacity> 
    );
  };    
 
  const showDetailOrder = (SalesOrderID) => {
    if(SalesOrderID == "")
      props.navigation.navigate('AllOrders',{SalesOrderID:'',TokenValue:tokenValue})
    else
      props.navigation.navigate('Details', {SalesOrderID:SalesOrderID,TokenValue:tokenValue})
  };

  const onScrollEndHandlerOutstanding = (item) => {
    var marginLeft = 0;
    for(var i = 0; i < dataOutstanding.length; i++){
      if(dataOutstanding[i].OrderNumber == item.OrderNumber){
        i = dataOutstanding.length;
      }else{
        marginLeft += 13;
      }
    }
    setFirstScrollMarginLeftOutstanding(marginLeft);
  };

  const onScrollEndHandlerDelivered = (item) => {
    var marginLeft = 0;
    for(var i = 0; i < dataDelivered.length; i++){
      if(dataDelivered[i].OrderNumber == item.OrderNumber){
        i = dataDelivered.length;
      }else{
        marginLeft += 13;
      }
    }
    setFirstScrollMarginLeftDelivered(marginLeft);
  };

  const choose = (questionChoiceIDTemp, userAnswerTemp) => {

        var timeoutCounter = setTimeout(() => {
            setIsLoadingSurveyData(false); 
            setIsLoadingNotificationToUser(true);
            setNotificationStatus('failed');
            setNotificationToUser('Apps experiences some issue during send feedback, Please try again later');
        }, 100000);

        setIsLoadingSurveyData(true);

        let formBodyAnswers = "";
        formBodyAnswers += "{" + 
                        '"QuestionID":' + surveyQuestion[0].QuestionID + ',' + 
                        '"AnswerChoices":[' + 
                                "{" + 
                                    '"AnswerChoiceID":' + questionChoiceIDTemp + ',"AnswerChoiceValue":"' + userAnswerTemp + '"' +
                                "}"                                        
                          + ']' + 
        "}"

        let formBody = "";
        formBody = "{" + 
                      '"Token":"' + tokenValue + '","SurveyID":"' + surveyData[0].SurveyID + '","Questions":[' + formBodyAnswers + ']' + 
                    "}";
        let url = `${API_URL}/WebApi1/access/api/submitmarketsurveyresponse`;
        fetch(url ,{
          method: 'POST',
          body: formBody,
          headers: {
            'Content-Type': 'application/json',
          },
        })
        .then((response) => {
          clearTimeout(timeoutCounter);
          setIsLoadingSurveyData(false);
          setIsLoadingSurvey(false);
          
          if(response.status == 200){
            setIsLoadingNotificationToUser(true);
            setNotificationStatus('ok');
            setNotificationToUser('Thank you for submission of the poll');
          }     
          else
          {
            setIsLoadingNotificationToUser(true);
            setNotificationStatus('failed');
            setNotificationToUser('Error during survey submission, Please try again later');                
          }
        })
        .catch((error) => { 
          clearTimeout(timeoutCounter);
          setIsLoadingNotificationToUser(true);
          setNotificationStatus('failed');
          setNotificationToUser('Error during send feedback (' + error + ")");
        })

        return false
}  

  const buildInput = ({item}) => 
  {
      if((item.answer) && item.answer != "")
      {
          return (
              <TouchableOpacity
                  style={{
                      marginBottom:5, 
                      marginTop:5,
                      paddingLeft:5,
                      paddingTop:9,
                      paddingBottom:9,
                      backgroundColor:'#00236930',
                      flex:2,
                      flexDirection:'row'
                  }}
                  onPress={()=>{choose(item.QuestionChoiceID, item.QuestionChoiceValue)}}
              >
                  <MaterialIcons name="radio-button-checked" size={25} color="#002369"/>
                  <Text 
                      style={{
                          color:'#000',
                          fontSize:14,
                          fontFamily: 'HelveticaNeue', 
                          marginTop:2, 
                          marginRight:25, 
                          marginLeft:10,
                          opacity:0.6
                      }}
                  >
                      {item.QuestionChoiceValue}
                  </Text>
              </TouchableOpacity>
          )
      }
      else
      {
          return (
              <TouchableOpacity
                  style={{
                      marginBottom:5, 
                      marginTop:5,
                      paddingLeft:5,
                      paddingTop:9,
                      paddingBottom:9,
                      flex:2,
                      flexDirection:'row',
                      backgroundColor:'#00236930', 
                      borderRadius:5,
                  }}
                  onPress={()=>{choose(item.QuestionChoiceID, item.QuestionChoiceID)}}
              >
                  <MaterialIcons name="radio-button-off" size={25}/>
                  <Text 
                      style={{
                          color:'#191E24',
                          fontSize:14,
                          fontFamily: 'HelveticaNeue-Bold',                              
                          marginTop:2, 
                          marginRight:25,
                          marginLeft:5,                                 
                          opacity:0.6
                      }}
                  >
                      {item.QuestionChoiceValue}
                  </Text>
              </TouchableOpacity>
          )            
      }
  }  

  return (
    <SafeAreaView style={styles.mainBody}>
      <ScrollView>        
      <View>    
        {(isLoadingSurvey) ? 
          <Modal
            transparent={true}
            animationType={'none'}
            style={{ minHeight:200, }}
          >
              <View 
                style={{
                  flex: 1,
                  alignItems: 'center',
                  justifyContent: 'space-around',
                  backgroundColor: '#00000070',  
                  minHeight:150,
              }}>
                {
                  isLoadingSurveyData 
                  ? 
                  <ActivityIndicator
                    animating={true}
                    color="#000000"
                    size="large"
                    style={{
                      backgroundColor: '#FFFFFF',
                      height: 100,
                      width: 100,
                      borderRadius: 10,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-around',                      
                    }}
                  />
                  :
                  (
                    <View 
                      style={{
                        backgroundColor: '#FFFFFF',
                        borderRadius: 10,
                        display: 'flex',
                        width:'90%',
                        minHeight:'30%',
                        alignItems: 'center',
                        justifyContent: 'space-around',
                      }}
                    >                 
                      {
                      (
                        surveyData[0]) 
                        ?
                          <View
                            style={{
                              width:'100%',
                              minHeight:35,
                              borderTopLeftRadius:12,
                              borderTopRightRadius:12,
                            }}
                          >
                            {surveyData[0].SurveyImageData != "" && surveyData[0].SurveyImageData
                              ?
                              <Image
                                source={{ uri: `data:image/png;base64,${surveyData[0].SurveyImageData}`}}
                                style={{
                                  width: '100%',
                                  borderRadius:8,
                                  height:180
                                }}
                              />
                              :
                              <></>
                            }
                            <TouchableOpacity 
                              onPress={()=>{setIsLoadingSurvey(false)}}
                              style={{
                                position:'absolute',
                                right:1,
                                padding:9,
                              }}
                            >
                              <AntDesign 
                                raised
                                name="closecircle" 
                                size={25} 
                                color="#00854F" 
                                onPress={()=>{setIsLoadingSurvey(false)}}
                              />
                            </TouchableOpacity>
                          </View>
                          :
                          <></>
                      }
                      {
                        (surveyData[0]) ?
                          (surveyData[0].SurveyType == "Poll" ?
                            <View style={{width:'95%', minHeight:180}}>
                            <ScrollView style={{width:'100%', maxHeight:160, }}>
                              <Text style={{color:'#002369', fontSize:18, textAlign:'center',fontFamily:'HelveticaNeue-Bold',}}>{(surveyData[0]) ? surveyData[0].SurveyTitle : ""}</Text>
                              <Text style={{color:'#002369', fontSize:16, textAlign:'center',fontFamily:'HelveticaNeue'}}>{"\n"}{(surveyQuestion[0]) ? surveyQuestion[0].Question : ""}</Text>                        
                            </ScrollView>
                              <Text style={{color:'#00854F', fontSize:16, textAlign:'left',fontFamily:'HelveticaNeue-Bold',marginLeft:10,}}>Poll Choices &bull;</Text>                              
                            </View>                            
                          :
                            <View style={{width:'95%', minHeight:100}}>
                              <Text style={{color:'#002369', fontSize:18, textAlign:'center',fontFamily:'HelveticaNeue-Bold'}}>{(surveyData[0]) ? surveyData[0].SurveyPopupTitle : ""}</Text>
                              <Text style={{color:'#002369', fontSize:14, textAlign:'center',fontFamily:'HelveticaNeue'}}>{(surveyData[0]) ? surveyData[0].SurveyPopupText : ""}</Text>
                              <TouchableOpacity
                                  style={{
                                      backgroundColor: '#00854F',
                                      borderWidth: 0,
                                      color: '#000000',
                                      borderColor: '#228B22',
                                      height: 40,
                                      alignItems: 'center',
                                      borderRadius: 40,
                                      marginLeft: 35,
                                      marginRight: 35,
                                      marginTop: 15,
                                      marginBottom: 5,
                                      justifyContent:'center'
                                  }}
                                  activeOpacity={0.5}
                                  onPress={ () => { directToSurveyQuestion(surveyData[0].SurveyID) } }
                              >
                                  <Text style={{fontFamily:'HelveticaNeue-Bold',color:'#FFF',fontSize:15}}>Fill Survey</Text>
                              </TouchableOpacity>
                              <TouchableOpacity
                                  style={{
                                      fontFamily:'HelveticaNeue-Bold',
                                      borderWidth: 0,
                                      color: '#000000',
                                      borderColor: '#228B22',
                                      height: 40,
                                      alignItems: 'center',
                                      borderRadius: 40,
                                      marginLeft: 35,
                                      marginRight: 35,
                                      marginTop: 5,
                                      marginBottom: 5,
                                      justifyContent:'center'
                                  }}
                                  activeOpacity={0.5}
                                  onPress={()=>{setIsLoadingSurvey(false)}}
                              >
                                  <Text style={{fontFamily:'HelveticaNeue-Bold',color:'#191E24',fontSize:12}}>Dismiss</Text>
                              </TouchableOpacity>
                            </View>
                          )
                        :
                        <></>
                      }
                      <View style={{minHeight:30,maxHeight:300,justifyContent:'center',width:'90%'}}>
                      {
                        (surveyQuestion[0]) ?
                          <ScrollView>
                            <FlatList
                                data={surveyQuestion[0].QuestionChoices}
                                keyExtractor={(item, index) => "ItemList_" + index.toString()}
                                renderItem={buildInput} 
                            />
                            </ScrollView>
                            :
                            <></>
                      }
                        <Text style={{marginTop:15,marginBottom:15, color:'#191E24', fontSize:12, textAlign:'center',fontFamily:'HelveticaNeue-Bold',marginLeft:10,}}>Your participation is much appreciated</Text>                      
                      </View>
                    </View>                    
                  )
                }
            </View>
          </Modal>
          :
          <></>
        } 
      <Image
            source={require('AnRNApp/Image/bar.png')}
            style={{
              width: '100%',
              height: 200,
              top:0,
              resizeMode:'contain',
              borderRadius: 1000,
              borderTopLeftRadius:0,
              borderTopRightRadius:0,
              transform: [
                {scaleX: 4*widthMultiplier}
              ]
            }}
          />
      </View>
      <View style={{ alignItems: 'center', position:'absolute', top:5, left:0, right:0 }}>
          <LOGOSVG
            width={160}
            height={40}
          />
      </View>
      <View style={{ 
          position:'absolute',
          right:0,
          left:0,
          padding:0,
          marginTop:40,      
      }}>
        {isLoadingImage ? <ActivityIndicator size="large" color="#00ff00"/> : (
          <SliderBox
            images={bannerImages}
            onCurrentImagePressed={index => openBrowser(index)}
            dotColor="#002369"
            inactiveDotColor="#CCD3E1"
            autoplay
            resizeMode="contain"
            resizeMethod="resize"
            circleLoop
            paginationBoxStyle={{
              position: "absolute",
              bottom: -5,
              padding: 0,
              alignItems: "center",
              alignSelf: "center",
              justifyContent: "center",
              paddingVertical: 10
            }}
            dotStyle={{
              width: 10,
              height: 10,
              borderRadius: 5,
              marginHorizontal: 0,
              marginTop:0,
              marginBottom:0,
              padding: 0,
              margin:0,
            }}
            ImageComponentStyle={{
              borderRadius: 14,
              right:0,
              left:0,
              transform: [
                {scaleY: 1.19}
              ],
              height:210,
              width:'90%',
              alignItems:'center',
              alignSelf:'center',
              marginTop:0,
              marginBottom:0,
              top:0,
              bottom:0,
            }}
          />
        )}
      </View>        
      <View style={{justifyContent:'center',alignItems:'center', marginTop:55}}>
        <Text
          style={{textDecorationLine:'underline',color:'#00854F', fontFamily:'HelveticaNeue', fontSize:14}}
          onPress={() => props.navigation.navigate('AllOrders',{SalesOrderID:'',TokenValue:tokenValue, OrderType:'Outstanding'})}
        >
          View All Orders
        </Text>
      </View>
      <View style={{justifyContent:'flex-start',alignItems:'stretch', marginTop:10, marginLeft:15, marginRight:15}}>
        <Text style={{fontWeight:'bold', fontSize:17, fontFamily:'HelveticaNeue-Bold'}}>Outstanding Orders</Text>
        {isLoadingOutstanding ? <ActivityIndicator size="large" color="#00ff00"/> : (
        <View style={{flexDirection:'row', marginTop:10}}>
          <Carousel
            data={dataOutstanding}
            renderItem={renderItemOutstanding}
            separatorWidth={(dataOutstanding.length == 2 ? 0 : (width <= 340 ? 0 : -45) )}
            itemWidth={200*widthMultiplierOutstandingOrder}
            onScrollEnd={(item) => onScrollEndHandlerOutstanding(item)}
            inActiveScale={1}
          />
        </View>        
        )}
      </View>
      { dataOutstanding.length == 0 ? 
        <View style={{width:'85%',height:90,alignItem:'center',alignSelf:'center',borderWidth:2,borderStyle:'solid',borderRadius:10,borderColor:'#b57979'}}>
          <Text style={{alignItems:'center',alignSelf:'center',paddingTop:35,fontSize:11,color:'#b57979'}}>No Orders Made Yet</Text>
        </View> : (
      <View style={{width:100,height:4,backgroundColor:'#c9cddb',alignItems:'center',alignSelf:'center',marginTop:20,borderRadius:3,flexDirection:'row'}}>
          <View style={{width:35,height:4,backgroundColor:'#0f1a44',borderRadius:3,left:firstScrollMarginLeftOutstanding}}/>
      </View>
      )}
      <View style={{justifyContent:'flex-start',alignItems:'stretch', marginTop:30, marginLeft:15, marginRight:15, marginBottom:2}}>
        <Text style={{fontWeight:'bold', fontSize:17, fontFamily:'HelveticaNeue-Bold'}}>Delivered Orders</Text>
        {isLoadingDelivered ? <ActivityIndicator size="large" color="#00ff00"/> : (         
        <View style={{flexDirection:'row', marginTop:10}}>
          <Carousel
            data={dataDelivered}
            renderItem={renderItemDelivered}
            separatorWidth={(dataDelivered.length == 2 ? 0 : (width <= 340 ? 0 : -45) )}
            itemWidth={200*widthMultiplierOutstandingOrder}
            onScrollEnd={(item) => onScrollEndHandlerDelivered(item)}
            inActiveScale={1}
          />
        </View>
        )}
      </View>
      { dataDelivered.length == 0 ? 
        <View style={{width:'85%',height:90,alignItem:'center',alignSelf:'center',borderWidth:2,borderStyle:'solid',borderRadius:10,borderColor:'#b57979'}}>
          <Text style={{alignItems:'center',alignSelf:'center',paddingTop:35,fontSize:11,color:'#b57979'}}>No Orders Delivered Yet</Text>
        </View> : (
      <View style={{width:100,height:4,backgroundColor:'#c9cddb',alignItems:'center',alignSelf:'center',marginTop:20, marginBottom:30,borderRadius:3,flexDirection:'row'}}>
          <View style={{width:35,height:4,backgroundColor:'#0f1a44',borderRadius:3,left:firstScrollMarginLeftDelivered}}/>
      </View>      
      )}
      </ScrollView>
      {
      (isLoadingNotificationToUser) ? 
      (
        (notificationToUser != "") ? 
        (
        <View
        >
          <View>
            <TouchableOpacity
              visible={isLoadingNotificationToUser}            
              style={{bottom:60,right:10,position:'absolute',height:20,width:20,}} 
              onPress={() => {
                setIsLoadingNotificationToUser(false);
              }}
            > 
              <AntDesign 
                name="closesquare" 
                size={20} 
                color="#00854F" 
                style={{
                  borderRadius:5,
                  zIndex:1000,
                }}
              />          
            </TouchableOpacity>          
          </View>        
          <View
            visible={isLoadingNotificationToUser}
            style={{
              position:'absolute',
              bottom:10,
              left:10,
              right:10,
              height:50,
              borderRadius:7,
              backgroundColor:'#00854F',
              paddingTop:10,
              paddingBottom:10,
            }}
          >
            <AntDesign name={(notificationStatus == "ok") ? "checkcircle" : "closecircle"} size={35} color="#FDFDFD" style={{margin:6,marginLeft:10,position:'absolute'}} />
            <Text style={{color:'#FDFDFD',position:'absolute',left:60,right:60, top:7, fontSize:12}}>{(notificationToUser!='') ? notificationToUser : ''}</Text>
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
});
export default HomeScreen;