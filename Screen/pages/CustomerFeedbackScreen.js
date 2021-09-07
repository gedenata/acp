// import React in our code
import React, {useState} from 'react';

// import all the components we are going to use
import {
  Keyboard,
  SafeAreaView,
  View,
  StyleSheet,
  Image,
  ActivityIndicator,
  Text,
  TextInput,
  ScrollView,
  ToastAndroid,
  Alert,
  TouchableOpacity,
  KeyboardAvoidingView,
  Dimensions,
  Platform
} from 'react-native';

import {ACCESS_API} from '@env';

import { Modalize } from 'react-native-modalize';

import Loader from './../Components/loader';

import AsyncStorage from '@react-native-community/async-storage';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Feather from 'react-native-vector-icons/Feather';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import ImagePicker from 'react-native-image-crop-picker';

import DropDownPicker from 'react-native-dropdown-picker';
import Moment from 'moment';

import RNFS from 'react-native-fs';

import DeviceInfo from 'react-native-device-info';

const { width } = Dimensions.get('window');
const widthMultiplier = width / 400;
import DocumentPicker from 'react-native-document-picker';
import AESEncryption from './../Components/AESEncryption';

const CustomerFeedbackScreen = ({route, navigation}) => {

  const [isLoadingPicker, setLoadingPicker] = useState(true);
  const [pickerItems, setPickerItems] = useState([]);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [pickerValue, setPickerValue] = useState(null);
  const [tokenValue, setTokenValue] = useState('');

  const [descriptionValue, setDescriptionValue] = useState('');
  const [categoryValue, setCategoryValue] = useState('');

  const [ onOpenPurpose, setOnOpenPurpose ] = useState('');

  const setDescriptionChange = (value) => {
    setDescriptionValue(value);
  }

  const setDropdownChange = (valueTemp) => {
    setCategoryValue(valueTemp);
  }

  const [ fontScale, setFontScale ] = useState(1);

  DeviceInfo.getFontScale().then((fontScaleTemp) => {
    setFontScale(fontScaleTemp);
  });

  const modalizeRef = React.createRef();

  const onOpen = (purpose) => {

      if(categoryValue == "" || categoryValue == "Choose Support Category")
      {
        if (Platform.OS === 'android') {
          ToastAndroid.show('Failed: Please choose one category!', ToastAndroid.SHORT);
        } else {
          Alert.alert('Failed: Please choose one category!');
        }
        return false;
      }
      if(descriptionValue == "")
      {
        if (Platform.OS === 'android') {
          ToastAndroid.show('Failed: Please provide some description!', ToastAndroid.SHORT);
        } else {
          Alert.alert('Failed: Please provide some description!');
        }
        return false;
      }
      if(multipleFile.length > 5){
        if (Platform.OS === 'android') {
          ToastAndroid.show("Failed: The number of file can't be more than 5 files and please make sure each file has less than 2 MB size!", ToastAndroid.SHORT);
        } else {
          Alert.alert("Failed: The number of file can't be more than 5 files and please make sure each file has less than 2 MB size!");
        }
          return false;
      }

      let isComplyingType = true;
      for(const temp of multipleFile)
      {
        if(temp.size / 1024 > 2048){
          if (Platform.OS === 'android') {
            ToastAndroid.show("Failed: Any file can't be more than 2 MB!", ToastAndroid.SHORT);
          } else {
            Alert.alert("Failed: Any file can't be more than 2 MB!");
          }
          return false;
        }

        if(temp.mime.toLowerCase() == "image/jpeg" || temp.mime.toLowerCase() == "image/png"  || temp.mime.toLowerCase() == "image/jpg"){
          isComplyingType = true;
        }
        else{
          isComplyingType = false;
        }
      }

      if(!isComplyingType){
        if (Platform.OS === 'android') {
          ToastAndroid.show("Only png and jpeg is allowed!", ToastAndroid.SHORT);
        } else {
          Alert.alert("Only png and jpeg is allowed!");
        }
        // alert("Only png and jpeg is allowed");
        return false;
      }

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
        <Text style={s.content__heading}>{"Submit Feedback"}</Text>
    </View>,
    <View style={s.content__inside} key="1">
      <ScrollView style={s.content__scrollview}>
      <View
        style={{
          backgroundColor:'#FDFDFD',
          width:'100%',
        }}
      >
        <Text style={{width:'65%',fontSize:17,top:10,fontWeight:'bold', marginLeft:18, }}>{onOpenPurpose == "exit" ? " Are you sure you want to quit the survey?" : " Are you sure you want to submit the feedback?"}</Text>
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
              handleClose();
              setLoading(true);
              uploadImage()
            }}
          >
            <Text style={{flex:1,fontSize:17,padding:13,color:'#FDFDFD',fontWeight:'bold'}}>{onOpenPurpose == "exit" ? "Exit Customer Support" : "Submit Feedback"}</Text>
          </TouchableOpacity>
        </View>
      </View>
      </ScrollView>
    </View>,
  ];

  AsyncStorage.getItem('user_id').then(
    (value) =>
    {
      AESEncryption("decrypt",value).then((respp)=>{

        setTokenValue("" + JSON.parse(respp).data.Token)
        var dataToSend = {Token: ''+JSON.parse(respp).data.Token};
        var formBody = [];
        for (let key in dataToSend)
        {
          var encodedKey = encodeURIComponent(key);
          var encodedValue = encodeURIComponent(dataToSend[key]);
          formBody.push(encodedKey + '=' + encodedValue);
        }
        formBody = formBody.join('&');
        const loadingItems = [];

        if(isLoadingPicker)
        {
          let url = `${ACCESS_API}/feedbackcategories`;
          fetch(url ,{method: 'POST', body: formBody, headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8', },})
          .then((response) => response.json())
          .then(json => {
            loadingItems.push({"label":"Choose Support Category","value":"Choose Support Category"});
            for(var i = 0; i < json.length; i++){ loadingItems.push({"label":json[i],"value":json[i]}); }
            setPickerItems(loadingItems);
            setLoadingPicker(false);
          })
          .catch((error) => console.error(error))
        }
      });// End of encryption/decryption

    },
  );

  const goBackToPage = () => { navigation.goBack() };

    const clearForm = () => {
      setMultipleFile([]);
      setDescriptionValue('');
      setCategoryValue('');
    }

    const [multipleFile, setMultipleFile] = useState([]);

    const handleFilePicker = async () => {
      //Opening Document Picker for selection of multiple file
      try {
        ImagePicker.openPicker({
          width: 300,
          height: 400,
          multiple: true,
          mediaType:'photo',
        }).then(image => {
          // console.log(image);
          setMultipleFile(image);
        });

        //Setting the state to show multiple file attributes
      } catch (err) {
        //Handling any exception (If any)
        if (DocumentPicker.isCancel(err)) {
          //If user canceled the document selection
          // alert('Canceled from multiple doc picker');
          // console.log('Canceled from multiple doc picker');
        } else {
          //For Unknown Error
          ToastAndroid.show('Unknown Error: ' + JSON.stringify(err), ToastAndroid.SHORT);
          // alert('Unknown Error: ' + JSON.stringify(err));
          throw err;
        }
      }
    }

    const takeOutOneFile = (fileUri) => {
      let multipleFileTemp = [];
      for(const temp of multipleFile){
        if(temp.path != fileUri){
          multipleFileTemp.push(temp);
        }
      }
      setMultipleFile(multipleFileTemp);
    }

    let uploadImage = async () => {
      var timeoutCounter = setTimeout(() => {
        setLoading(false);
        setMultipleFile([]);
        setDescriptionValue('');
        navigation.push('More', {
          notificationText:
            'Apps experiences some issue during send feedback, Please try again later',
          status: 'failed',
        });
      }, 100000);
      try {
        setLoading(true);

        const filesToUpload = multipleFile.map((res) => {
          return {
            filename: res['path'].substring(res['path'].lastIndexOf('/') + 1),
            filepath: res['path'].replace('file:///', ''),
            filetype: res['mime'],
          };
        });
        const {promise} = RNFS.uploadFiles({
          toUrl: `${ACCESS_API}/customerfeedback`,
          files: filesToUpload,
          headers: {
            Accept: 'application/json',
          },
          fields: {
            Token: tokenValue,
            FeedbackContent: descriptionValue.replace('"', '\\"'),
            CategoryName: categoryValue,
          },
          method: 'POST',
        });
        promise
          .then((response) => {
            setLoading(false);
            setMultipleFile([]);
            setDescriptionValue('');
            clearTimeout(timeoutCounter);
            if (response.statusCode == 200) {
              navigation.push('More', {
                notificationText:
                  'Feedback submitted. Thank you for your feedback and we will revert back to you soon.',
                status: 'ok',
              });
            } else if (response.statusCode == 417) {
              navigation.push('More', {
                notificationText:
                  'Total count of attachments exceeds 5 (Custom error message if the attachment count > 5',
                status: 'failed',
              });
            } else if (response.statusCode == 404) {
              navigation.push('More', {
                notificationText:
                  'Unable to find the Support Category ID (Custom error message if the feedback category is null/empty)',
                status: 'failed',
              });
            } else if (response.statusCode == 501) {
              navigation.push('More', {
                notificationText:
                  'Unable to Insert Customer Support. Please contact Application support engineer (Custom error message if there is a problem in inserting data.)',
                status: 'failed',
              });
            } else if (response.statusCode == 403) {
              navigation.push('More', {
                notificationText: 'User Not Found',
                status: 'failed',
              });
            } else {
              navigation.push('More', {
                notificationText:
                  'Error during send feedback, Please try again later',
                status: 'failed',
              });
            }
          })
          .catch((error) => {
            setLoading(false);
            handleClose();
            clearTimeout(timeoutCounter);
            setMultipleFile([]);
            setDescriptionValue('');
            navigation.push('More', {
              notificationText: 'Error during send feedback (' + error + ')',
              status: 'failed',
            });
          });
      } catch (error) {
        setLoading(false);
        handleClose();
        clearTimeout(timeoutCounter);
        setMultipleFile([]);
        setDescriptionValue('');
        navigation.push('More', {
          notificationText: 'Error during send feedback (' + error + ')',
          status: 'failed',
        });
      }
    };

    Moment.locale('en');

    let [loading, setLoading] = useState(false);

    return (
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: '#fdfdfd',
        }}
      >
      <Loader loading={loading} />
      <ScrollView>
      <KeyboardAvoidingView enabled>
        <View>
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
        </View>
        <View style={{ alignItems: 'center', position:'absolute', top:10, left:0, right:0 }}>
            <TouchableOpacity style={{position:'absolute',left:0,marginLeft:10,marginTop:4,}} onPress={goBackToPage}>
              <Icon raised name="arrow-left" size={30} color="#FDFDFD"/>
            </TouchableOpacity>
            <Text style={{ marginTop:7,color:'#FDFDFD',fontSize:(fontScale < 1.2 ? 19 : 20/fontScale), fontFamily:'HelveticaNeue-Bold' }}>Customer Support</Text>
        </View>
        <TouchableOpacity  style={{marginTop:0, marginLeft:20, marginRight:20, alignItems:'stretch',justifyContent:'flex-start'}} onPress={() => clearForm()}>
            <Text style={{alignSelf:'center',alignItems:'center',textDecorationLine:'underline'}}>Clear Forms</Text>
        </TouchableOpacity>
        <View
          style={{
            marginTop:10,
            marginLeft:22,
            height:50,
            marginBottom:20,
            marginRight:20,
            alignItems:'stretch',
            justifyContent:'flex-start',
            ...(Platform.OS !== 'android' && {zIndex:10})
          }}
        >
          <Text style={{marginBottom:10,color:'#000000',fontWeight:'bold'}}>Category</Text>
          {
          isLoadingPicker
          ?
            <ActivityIndicator size="large" color="#00ff00"/>
          :
            (
              <DropDownPicker
                placeholder="Choose Support Category"
                open={pickerOpen}
                value={pickerValue}
                items={pickerItems}
                setOpen={setPickerOpen}
                setValue={setPickerValue}
                setItems={setPickerItems}
                listMode="SCROLLVIEW"
                containerProps={{
                  marginLeft: -2
                }}
                onChangeValue={(dropDownObject) => {
                  setDropdownChange(dropDownObject);
                }}
              />
            )
          }
        </View>
        <View
          style={{
            marginTop:18,
            marginLeft:22,
            marginBottom:20,
            marginRight:20,
            alignItems:'stretch',
            justifyContent:'flex-start',
          }}
        >
          <Text style={{marginBottom:10,color:'#000000',fontWeight:'bold',}}>Description</Text>
          <TextInput
            style={{
              borderStyle:'solid',
              borderColor:descriptionValue.length == 0 ? '#ccc' : '#5c3b3b',
              borderWidth:1,
              borderRadius:7,
              height:120,
              textAlignVertical: 'top'
            }}
            multiline
            editable
            numberOfLines={10}
            placeholder="Describe your experience with us" //12345
            placeholderTextColor="#3CB371"
            keyboardType="default"
            value={descriptionValue}
            onChangeText={tempValue => setDescriptionChange(tempValue)}
          />
        </View>
        <View
          style={{
            marginTop:0,
            marginLeft:22,
            marginBottom:20,
            marginRight:20,
            alignItems:'stretch',
            justifyContent:'flex-start',
          }}
        >
          <Text style={{marginBottom:10,color:'#000000',fontWeight:'bold',}}>Attach Files</Text>
            {
              multipleFile.length > 0 ?
              <View
                style={{
                  borderStyle:'dashed',
                  borderColor:'#000000',
                  borderWidth:1,
                  borderRadius:7,
                  height:150,
                }}
                multiline
                numberOfLines={10}
                placeholderTextColor="#3CB371"
                keyboardType="default"
                onPress={handleFilePicker}
                onSubmitEditing={Keyboard.dismiss}
                blurOnSubmit={false}
              >
                <ScrollView>
                  {
                    multipleFile.map((item, key) => (
                      <View key={key} style={{marginTop:0}}>
                        <AntDesign name="checkcircle" size={20} color="#5e7d40" style={{margin:5}} />
                        <Text style={{position:'absolute',left:40, top:7,fontSize:13, color:'#000000'}}>File Name: {item.path.substring(item.path.lastIndexOf('/') + 1)}</Text>
                        <TouchableOpacity
                          style={{position:'absolute',top:8,right:10}}
                          onPress={takeOutOneFile.bind(this, item.path)}
                        >
                          <AntDesign name="closecircleo" size={18} color="#835b5b"/>
                        </TouchableOpacity>
                      </View>
                    ))
                  }
                </ScrollView>
              </View>
              :
                <TouchableOpacity
                  style={{
                    borderStyle:'dashed',
                    borderColor:'#ccc',
                    borderWidth:1,
                    borderRadius:7,
                    height:150,
                  }}
                  multiline
                  numberOfLines={10}
                  placeholderTextColor="#3CB371"
                  keyboardType="default"
                  onPress={handleFilePicker}
                  onSubmitEditing={Keyboard.dismiss}
                  blurOnSubmit={false}
                >
                  <Feather raised name="upload" size={25} color="#835b5b" style={{textAlign:'center',alignItems:'center',marginTop:10}}/>
                  <Text style={{alignItems:'center',textAlign:'center',marginTop:5,color:'#835b5b'}}>Only JPEG & PNG</Text>
                  <Text style={{alignItems:'center',textAlign:'center',marginTop:5,color:'#835b5b'}}>Maximum 5 Files</Text>
                  <Text style={{alignItems:'center',textAlign:'center',marginTop:5,color:'#835b5b'}}>Maximum 2 MB Files each</Text>
                </TouchableOpacity>
            }
        </View>
        <View style={{marginTop:0, alignItems:'stretch',justifyContent:'flex-start'}}>
          <TouchableOpacity
            style={{
              fontFamily:'sans-serif-light',
              backgroundColor: descriptionValue.length == 0 || categoryValue == "Choose Support Category" ? '#858585' : '#2E8B57' ,
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
            }}
            activeOpacity={0.5}
            onPress={() => {
              onOpen('submit');
            }}
          >
            <Text style={styles.buttonTextStyle}>SEND FEEDBACK</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
      </ScrollView>
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
      </SafeAreaView>
    );
};

const styles = StyleSheet.create({
  buttonStyle: {
    fontFamily:'sans-serif-light',
    backgroundColor:  '#2E8B57' ,
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

export default CustomerFeedbackScreen;