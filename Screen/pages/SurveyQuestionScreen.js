import React, { useState, useEffect } from 'react';

import {
    StyleSheet,
    View,
    Image,
    ActivityIndicator,
    FlatList,
    TextInput,
    Text,
    ScrollView,
    SafeAreaView,
    TouchableOpacity,
    Dimensions,
    BackHandler,
    Alert
} from 'react-native';
import {API_URL} from '@env';
import { Modalize } from 'react-native-modalize';

import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import AsyncStorage from '@react-native-community/async-storage';

import AESEncryption from './../Components/AESEncryption';

import DeviceInfo from 'react-native-device-info';

const { width } = Dimensions.get('window');
const widthMultiplier = width / 400;

const SurveyQuestionScreen = ({route, navigation}) => {


    var [ loading, setLoading ] = useState(true);
    var [ currentUserAnswer, setCurrentUserAnswer ] = useState("");
    var [ currentQuestionPosition, setCurrentQuestionPosition ] = useState(0);

    const [ itemList, setItemList ] = useState([]);
    const [ fontScale, setFontScale ] = useState(1);

    const [ tokenValue, setTokenValue ] = useState('');

    const [ onOpenPurpose, setOnOpenPurpose ] = useState('')

    DeviceInfo.getFontScale().then((fontScaleTemp) => {
      setFontScale(fontScaleTemp)
    });     

    useEffect(() => 
    {
      setLoading(true);
      AsyncStorage.getItem('user_id').then(
        (value) =>
        {
            AESEncryption("decrypt",value).then((respp)=>{
                setTokenValue("" + JSON.parse(respp).data.Token);
                var dataToSend = {Token: ''+JSON.parse(respp).data.Token, SurveyID:''+route.params.SurveyID};
    
                var formBody = [];
                for (let key in dataToSend){
                    var encodedKey = encodeURIComponent(key);
                    var encodedValue = encodeURIComponent(dataToSend[key]);
                    formBody.push(encodedKey + '=' + encodedValue);
                }
                formBody = formBody.join('&');
                let url = `${API_URL}/WebApi1/access/api/marketsurveyquestion`;
                fetch(url, {
                    method: 'POST',
                    body: formBody, 
                    headers: {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
                    },
                })
                .then((response) => response.json())
                .then(json => {
                    let counter = 0;
                    let jsonTemp = [];
                    while(counter < json.length){
                        let counter2 = 0;
                        while(counter2 < json[counter].QuestionChoices.length){
                            json[counter].QuestionChoices[counter2].answer = "";
                            counter2++;
                        }
                        jsonTemp.push(json[counter]);
                        counter++;
                    }
                    setItemList(jsonTemp);
                    setLoading(false);
                });
    
                const parent = navigation.dangerouslyGetParent();
                parent.setOptions({
                  tabBarVisible: false
                });
                return () =>
                  parent.setOptions({
                    tabBarVisible: true
                });                 
            });// End of encryption/decryption
        });

        const backAction = () => {
            Alert.alert("Information", "Please use close button to exit the survey", [
              {
                text: "Cancel",
                onPress: () => null,
                style: "cancel"
              },
              { text: "YES", onPress: () => null }
            ]);
            return true;
          };
      
          const backHandler = BackHandler.addEventListener(
            "hardwareBackPress",
            backAction
          );
      
          return () => backHandler.remove();
    }, []);

    const choose = (questionChoiceIDTemp, userAnswerTemp) => {

        setLoading(true);
        let itemListTemp = itemList;
        let currentUserAnswerTemp = "";

        let counter = 0;
        for(const temp of itemListTemp[currentQuestionPosition].QuestionChoices)
        {
            if(temp.QuestionChoiceID == questionChoiceIDTemp){
                if(itemListTemp[currentQuestionPosition].QuestionType == "Short Answer"){
                    itemListTemp[currentQuestionPosition].QuestionChoices[counter].answer = userAnswerTemp;
                }
                else{
                    itemListTemp[currentQuestionPosition].QuestionChoices[counter].answer = (!itemListTemp[currentQuestionPosition].QuestionChoices[counter].answer) ? userAnswerTemp : (itemListTemp[currentQuestionPosition].QuestionChoices[counter].answer == "" ? userAnswerTemp : "")
                }
            }else{
                if(itemListTemp[currentQuestionPosition].QuestionType == "Single Choice"){
                    itemListTemp[currentQuestionPosition].QuestionChoices[counter].answer = "";
                }                
            }
            currentUserAnswerTemp += (currentUserAnswerTemp == "" ? "" : ",") + itemListTemp[currentQuestionPosition].QuestionChoices[counter].answer;
            counter++;
        }
        setItemList(itemListTemp);

        setCurrentUserAnswer(currentUserAnswerTemp);

        setLoading(false);
    }

    const submitSurvey = () => {
        handleClose();
        //var wasServerTimeout = false;
        var timeoutCounter = setTimeout(() => {
            wasServerTimeout = true;
            setLoading(false); 
            navigation.navigate('PulpAndPaperUpdate', {notificationText:'Apps experiences some issue during send feedback, Please try again later',status:'failed'});
        }, 300000);            

        setLoading(true);

        if(currentQuestionPosition+1 == itemList.length){

            let formBodyAnswers = "";
            let counter = 0;
            while(counter < itemList.length){
                let formBodyAnswers2 = "";
                let counter2 = 0;
                while(counter2 < itemList[counter].QuestionChoices.length){
                    if(itemList[counter].QuestionChoices[counter2].answer){
                        if(itemList[counter].QuestionChoices[counter2].answer != "")
                        {
                            formBodyAnswers2 += (formBodyAnswers2 == "" ? "" : ",") + 
                                                "{" + 
                                                    '"AnswerChoiceID":' + itemList[counter].QuestionChoices[counter2].QuestionChoiceID + ',' + 
                                                    '"AnswerChoiceValue":"' + ((itemList[counter].QuestionChoices[counter2].QuestionChoiceValue) ? itemList[counter].QuestionChoices[counter2].QuestionChoiceValue : itemList[counter].QuestionChoices[counter2].answer) + '"' +
                                                "}"
                        }
                    }
                    counter2++;
                }

                formBodyAnswers += (formBodyAnswers == "" ? "" : ",") + "{" + 
                                        '"QuestionID":' + itemList[counter].QuestionID + ',' + 
                                        '"AnswerChoices":[' + formBodyAnswers2 + ']' + 
                                    "}"

                counter++;
            }

            let formBody = "";
            formBody = "{" + 
                          '"Token":"' + tokenValue + '",' + 
                          '"SurveyID":"' + route.params.SurveyID + '",' + 
                          '"Questions":[' + formBodyAnswers + ']' + 
                        "}";

            //console.log(formBody);
            let url = `${API_URL}/WebApi1/access/api/submitmarketsurveyresponse`;
            fetch(url ,{
              method: 'POST',
              body: formBody,
              headers: {
                // Header Defination
                'Content-Type': 'application/json',
              },
            })
            .then((response) => {
              // console.log(JSON.stringify(response));
              clearTimeout(timeoutCounter);
              if(response.status == 200){
                navigation.navigate('PulpAndPaperUpdate', {notificationText:'Feedback submitted. Thank you for completing the survey.',status:'ok'})
              }     
              else
              {
                navigation.navigate('PulpAndPaperUpdate', {notificationText:'Error during survey submission, Please try again later',status:'failed'})
              }
            })
            .catch((error) => { 
              clearTimeout(timeoutCounter);
              navigation.navigate('PulpAndPaperUpdate', {notificationText:'Error during send feedback (' + error + ")",status:'failed'})
            })

            return false
        }        
    }

    const goNext = () => {

        if((!currentUserAnswer) || currentUserAnswer == "")
            return false

        let itemListTemp = itemList;
        let currentUserAnswerTemp = "";
        let counter=0;

        if(currentQuestionPosition+1 == itemList.length){
            onOpen("submit");
            return false;
        }              

        for(const temp of itemListTemp[currentQuestionPosition+1].QuestionChoices){
            currentUserAnswerTemp += (currentUserAnswerTemp == "" ? "" : ",") + itemListTemp[currentQuestionPosition+1].QuestionChoices[counter].answer;
            counter++;
        }  

        setCurrentUserAnswer(currentUserAnswerTemp);
        setCurrentQuestionPosition(currentQuestionPosition+1);
        setLoading(false);
    }

    const goPrevious = () => {

        if(currentQuestionPosition-1 == -1)
            return false

        setLoading(true);
        let itemListTemp = itemList;
        let currentUserAnswerTemp = "";
        let counter=0;
        for(const temp of itemListTemp[currentQuestionPosition-1].QuestionChoices){
            currentUserAnswerTemp += (currentUserAnswerTemp == "" ? "" : ",") + itemListTemp[currentQuestionPosition-1].QuestionChoices[counter].answer;
            counter++;
        }

        setCurrentUserAnswer(currentUserAnswerTemp);            
        setCurrentQuestionPosition(currentQuestionPosition-1);
        setLoading(false);
    }


    const modalizeRef = React.createRef();

    const onOpen = (purpose) => {
        setOnOpenPurpose(purpose);
        modalizeRef.current?.open();
    };        

    const handleClose = () => {
        if (modalizeRef.current) {
          modalizeRef.current.close();
        }
    };

    const renderContent = () => [
        <View style={s.content__header} key="0">
            <Text style={s.content__heading}>{onOpenPurpose == "exit" ? "Exit Survey" : "Submit Survey"}</Text>
        </View>,
        <View style={s.content__inside} key="1">
          <ScrollView style={s.content__scrollview}>
          <View 
            style={{
              backgroundColor:'#FDFDFD',
              width:'100%',
            }}
          >
            <Text style={{width:'65%',fontSize:17,top:10,fontWeight:'bold', marginLeft:18, }}>{onOpenPurpose == "exit" ? " Are you sure you want to quit the survey?" : " Are you sure you want to submit the survey?"}</Text>
            <Text style={{width:'75%',fontSize:14,top:20,marginLeft:18,}}>{onOpenPurpose == "exit" ? " You will lose all of your progress in this survey" : ""}</Text>
            <FontAwesome raised name={onOpenPurpose == "exit" ?  "exclamation-circle" : "send"} size={50} style={{position:'absolute',right:0, padding:22,}} color={onOpenPurpose == "exit" ? '#c6481c' : "#00854F"} onPress={() => handleClose()}/>
            <View
              style={{
              marginTop:10,
              alignItems:'stretch',
              justifyContent:'flex-start', 
              left:15,
              right:15,
              marginRight:25,
              ...(Platform.OS !== 'android' && {zIndex:10})
              }}
            >
              <TouchableOpacity
                    style={{
                        fontFamily:'sans-serif-light',
                        backgroundColor: (onOpenPurpose == "exit" ? '#c6481c' : "#00854F"),
                        fontWeight:'bold',
                        borderWidth: 0,
                        color: '#000000',
                        borderColor: '#228B22',
                        height: 50,
                        alignItems: 'center',
                        borderRadius: 25,
                        marginTop: 20,
                        marginBottom: 15,
                    }} 
                    onPress={() => { 
                        if(onOpenPurpose == "exit"){
                            const parent = navigation.dangerouslyGetParent();
                            parent.setOptions({
                              tabBarVisible: true
                            });                            
                            navigation.goBack();
                        }
                        else
                            submitSurvey()

                    }}
              >
                <Text style={{flex:1,fontSize:17,padding:13,color:'#FDFDFD',fontWeight:'bold'}}>{onOpenPurpose == "exit" ? "Exit Survey" : "Submit Survey"}</Text>
              </TouchableOpacity>
            </View>
          </View>
          </ScrollView>
        </View>,
    ];

    const buildInput = ({item}) => 
    {
        if(itemList[currentQuestionPosition].QuestionType == "Short Answer")
        {
            return (
                <TextInput
                    style={{
                        borderStyle:'solid',
                        borderColor:currentUserAnswer == "" ? '#191e24' : "#000",
                        borderWidth:0.5,
                        borderRadius:7,
                        height:189,
                        marginRight:30,
                        marginLeft:30,
                    }}
                    multiline
                    editable
                    numberOfLines={10}
                    textAlignVertical="top"
                    placeholder="Please type your answer here" // 12345
                    placeholderTextColor="#191E2460" 
                    keyboardType="default"
                    value={item.answer}
                    onChangeText={tempValue => choose(item.QuestionChoiceID, tempValue)}
                />
            )
        }
        else if(itemList[currentQuestionPosition].QuestionType == "Single Choice")
        {
            if((item.answer) && item.answer != "")
            {
                return (
                    <TouchableOpacity
                        style={{
                            borderRadius:8,
                            backgroundColor:'#002369',
                            borderColor:'#ccc',
                            borderWidth:1,
                            marginBottom:5, 
                            marginTop:5,
                            paddingLeft:5,
                            width:'90%',
                            paddingTop:10,
                            paddingBottom:10,
                            alignItems:'center',
                            alignSelf:'center'
                        }}
                        onPress={()=>{choose(item.QuestionChoiceID, item.QuestionChoiceID)}}
                    >
                        <Text 
                            style={{
                                color:'#fff',
                                fontSize:14,
                                fontFamily: 'HelveticaNeue', 
                                marginTop:2, 
                                marginRight:4, 
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
                            borderRadius:8,
                            backgroundColor:'#FFFFFF',
                            borderColor:'#ccc',
                            borderWidth:1,
                            marginBottom:5, 
                            marginTop:5,
                            paddingLeft:5,
                            width:'90%',
                            paddingTop:10,
                            paddingBottom:10,
                            alignItems:'center',
                            alignSelf:'center'
                        }}
                        onPress={()=>{choose(item.QuestionChoiceID, item.QuestionChoiceID)}}
                    >
                        <Text 
                            style={{
                                color:'#000',
                                fontSize:14,
                                fontFamily: 'HelveticaNeue', 
                                marginTop:2, 
                                marginRight:4, 
                                opacity:0.6
                            }}
                        >
                            {item.QuestionChoiceValue}
                        </Text>
                    </TouchableOpacity>
                )            
            }
        }else{ 
            if((item.answer) && item.answer != "")
            {
                return (
                    <TouchableOpacity
                        style={{
                            marginBottom:5, 
                            marginTop:5,
                            paddingLeft:5,
                            width:'90%',
                            paddingTop:3,
                            paddingBottom:3,
                            alignItems:'center',
                            alignSelf:'center',
                            flex:2,
                            flexDirection:'row'
                        }}
                        onPress={()=>{choose(item.QuestionChoiceID, item.QuestionChoiceID)}}
                    >
                        <MaterialIcons name="check-box" size={25} color="#002369"/>
                        <Text 
                            style={{
                                color:'#000',
                                fontSize:14,
                                fontFamily: 'HelveticaNeue', 
                                marginTop:2, 
                                marginRight:4, 
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
                            width:'90%',
                            paddingTop:3,
                            paddingBottom:3,
                            alignItems:'center',
                            alignSelf:'center',
                            flex:2,
                            flexDirection:'row'
                        }}
                        onPress={()=>{choose(item.QuestionChoiceID, item.QuestionChoiceID)}}
                    >
                        <MaterialIcons name="check-box-outline-blank" size={25} color="#002369"/>                        
                        <Text 
                            style={{
                                color:'#000',
                                fontSize:14,
                                fontFamily: 'HelveticaNeue', 
                                marginTop:2, 
                                marginRight:4,
                                marginLeft:10,                                 
                                opacity:0.6
                            }}
                        >
                            {item.QuestionChoiceValue}
                        </Text>
                    </TouchableOpacity>
                )            
            }            
        }
    }
    
    return (
        <SafeAreaView style={{ flex:1, justifyContent:'center' }}>       
            {loading ? <ActivityIndicator size="large" color="#000000"/> : (
                    <View style={{ flex:1, backgroundColor:'#fff5f5' }}>
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
                            <TouchableOpacity 
                                style={{position:'absolute',left:0,marginLeft:10,marginTop:4,}} 
                                onPress={() => {onOpen("exit")}}
                            >
                                <Entypo raised name="cross" size={30} color="#FFFFFF"/> 
                            </TouchableOpacity>
                            <Text style={{ marginTop:7,color:'#FDFDFD',fontSize:(fontScale < 1.2 ? 19 : 20/fontScale), fontFamily:'HelveticaNeue-Bold' }}>Survey Questions</Text>
                        </View>
                            <View
                                style={{
                                    paddingTop:10,
                                    paddingBottom:10,
                                }}
                            >
                                <Text style={{color:'#00854F',fontSize:15,fontFamily: 'HelveticaNeue-Bold', marginLeft:25, marginRight:25, textAlign:'justify'}}>
                                    Question {currentQuestionPosition+1} of {itemList.length}
                                </Text>
                            </View>                        
                            <View style={{width:'85%', height:8,backgroundColor:'#C4C4C4',alignItems:'center',alignSelf:'center',borderRadius:3,flexDirection:'row'}}>
                                <View style={{width:((currentQuestionPosition+1)/itemList.length*100)+'%',height:7,backgroundColor:'#00854F',borderRadius:3,left:0}}/>
                            </View>
                            <View
                                style={{
                                    paddingTop:10,
                                    paddingBottom:10,
                                }}
                            >
                                <Text style={{color:'#000000',fontSize:15,fontFamily: 'HelveticaNeue-Bold', marginLeft:25, marginRight:25, textAlign:'justify'}}>{(itemList[currentQuestionPosition]) ? itemList[currentQuestionPosition].Question : ""}</Text>
                            </View>
                            {(itemList[currentQuestionPosition])
                            ?
                            <FlatList
                                data={itemList[currentQuestionPosition].QuestionChoices}
                                keyExtractor={(item, index) => "ItemList_" + index.toString()}
                                renderItem={buildInput}
                            />
                            :
                            <></>
                            }
                            <View style={{marginTop:20, alignItems:'stretch',justifyContent:'flex-start'}}>
                                {
                                    (currentQuestionPosition+1 != itemList.length && currentUserAnswer != "" && (currentUserAnswer)) 
                                    ? 
                                    (
                                        <TouchableOpacity
                                            style={{
                                                backgroundColor: '#00854F',
                                                fontWeight:'bold',
                                                borderWidth: 0,
                                                color: '#FFFFFF',
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
                                            onPress={()=>{goNext()}}
                                        >
                                            <Text style={{fontFamily:'HelveticaNeue-Bold',color:'#FFF'}}>Next</Text>
                                        </TouchableOpacity>
                                    )
                                    :
                                    (
                                        (currentQuestionPosition+1 == itemList.length && (currentUserAnswer) && currentUserAnswer != "")
                                        ?
                                        (
                                            <TouchableOpacity
                                                style={{
                                                    fontFamily:'HelveticaNeue-Bold',
                                                    backgroundColor: '#00854F',
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
                                                    marginBottom: 5,
                                                    justifyContent:'center'
                                                }}
                                                activeOpacity={0.5}
                                                onPress={()=>{goNext()}}
                                            >
                                                <Text style={{fontFamily:'HelveticaNeue-Bold',color:'#FFF',fontSize:15}}>Submit Survey</Text>
                                            </TouchableOpacity>
                                        )
                                        :
                                        (
                                            <TouchableOpacity
                                                style={{
                                                    fontFamily:'HelveticaNeue-Bold',
                                                    backgroundColor: '#75787C',
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
                                                    marginBottom: 5,
                                                    justifyContent:'center'
                                                }}
                                                activeOpacity={0.5}
                                                onPress={()=>{goNext()}}
                                            >
                                                <Text style={{fontFamily:'HelveticaNeue-Bold',color:'#fff',fontSize:15}}>Next</Text>
                                            </TouchableOpacity>
                                        )
                                    )
                                }
                            </View>
                            <View style={{marginTop:0, alignItems:'stretch',justifyContent:'flex-start'}}>
                            {currentQuestionPosition-1 == -1 ? 
                                    (
                                        <TouchableOpacity
                                            style={{
                                                fontFamily:'HelveticaNeue-Bold',
                                                backgroundColor:'#75787C',
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
                                                marginBottom: 5,
                                                justifyContent:'center'
                                            }}
                                            onPress={()=>{goPrevious()}}
                                        >
                                            <Text style={{fontFamily:'HelveticaNeue-Bold',color:'#FFF',fontSize:15}}>Previous</Text>
                                        </TouchableOpacity>
                                    )
                                    :
                                    (
                                        <TouchableOpacity
                                            style={{
                                                fontFamily:'HelveticaNeue-Bold',
                                                backgroundColor:'#FFFFFF',
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
                                                marginBottom: 5,
                                                justifyContent:'center'                                        
                                            }}
                                            onPress={()=>{goPrevious()}}
                                        >
                                            <Text style={{fontFamily:'HelveticaNeue-Bold',color:'#75787C',fontSize:15}}>Previous</Text>
                                        </TouchableOpacity>
                                    )
                                }
                            </View>                        
                        </ScrollView>
                    </View>
            )}
        <Modalize 
                ref={modalizeRef}
                modalHeight={250}
                scrollViewProps={{
                    showsVerticalScrollIndicator: false,
                    stickyHeaderIndices: [0],
                }}
            > 
                {renderContent()}
            </Modalize>                           
        </SafeAreaView >
    )
}

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
      marginLeft: 15,
    },
  
    content__paragraph: {
      fontSize: 15,
      fontFamily:'Rubik-Regular',      
      fontWeight: '200',
      lineHeight: 22,
      color: '#666',
    },
  
    content__scrollview: {
      marginVertical: 20,
    },
  
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

export default SurveyQuestionScreen;