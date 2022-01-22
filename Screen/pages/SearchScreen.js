import React, {useState, useEffect} from 'react';
import {
  Keyboard,
  TouchableOpacity,
  KeyboardAvoidingView,
  StyleSheet,
  Image,
  View,
  Text,
  TextInput,
  SafeAreaView,
  ScrollView,
  Dimensions,
  ActivityIndicator,
  Platform
} from 'react-native';
import * as gestureHandler from 'react-native-gesture-handler';
import {ACCESS_API} from '@env';
import AsyncStorage from '@react-native-community/async-storage';
import MyInputSpinner from '../Components/MyInputSpinner';
import RadioForm from 'react-native-simple-radio-button';
import DropDownPicker from 'react-native-dropdown-picker';
import Autocomplete from 'react-native-autocomplete-input';

import LOGOSVG from 'AnRNApp/Image/aprilconnect_horinzontallogo.svg';
import AESEncryption from './../Components/AESEncryption';
var radio_props = [
  {label: 'Order Number                ', value: 0 },
  {label: 'PO Number', value: 1 }
];

const { width } = Dimensions.get('window');
const widthMultiplier = width / 400;

const SearchScreen = props => {

  const [month, setMonth] = useState(new Date().getMonth());
  const [monthTemp, setMonthTemp] = useState(new Date().getMonth());
  const [year, setYear] = useState(new Date().getFullYear());
  const [yearTemp, setYearTemp] = useState(new Date().getFullYear());

  const [POOrOrderNumber, setPOOrOrderNumber] = useState('');
  const [POOrOrderNumberTemporary, setPOOrOrderNumberTemporary] = useState('');
  const [POOrOrderNumberKeyword, setPOOrOrderNumberKeyword] = useState('');
  const [POOrOrderNumberKeywordTemporary, setPOOrOrderNumberKeywordTemporary] = useState('');

  const [productDescriptionCategory, setProductDescriptionCategory] = useState('');
  const [productDescriptionCategoryTemporary, setProductDescriptionCategoryTemporary] = useState('');

  const [searchLocation, setSearchLocation] = useState('');
  const [searchLocationTemporary, setSearchLocationTemporary] = useState('');

  const [productDescriptionKeyword, setProductDescriptionKeyword] = useState('');
  const [productDescriptionKeywordTemporary, setProductDescriptionKeywordTemporary] = useState('');

  const [isLoadingPicker, setLoadingPicker] = useState(true);
  const [pickerItems, setPickerItems] = useState([]);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [pickerValue, setPickerValue] = useState(null);

  const [isLoadingLocPicker, setLoadingLocPicker] = useState(true);
  const [pickerLocItems, setPickerLocItems] = useState([]);
  const [pickerLocOpen, setPickerLocOpen] = useState(false);
  const [pickerLocValue, setPickerLocValue] = useState(null);

  const [isLoadingAutoSearch, setIsLoadingAutoSearch] = useState(false);
  const [autoSearchData, setAutoSearchData] = useState([]);

  const [colourOne, setColourOne] = useState('#d4e7f2');
  const [colourTwo, setColourTwo] = useState('#d4e7f2');
  const [colourThree, setColourThree] = useState('#d4e7f2');
  const [colourFour, setColourFour] = useState('#d4e7f2');
  const [colourFive, setColourFive] = useState('#d4e7f2');
  const [colourSix, setColourSix] = useState('#d4e7f2');
  const [colourSeven, setColourSeven] = useState('#d4e7f2');
  const [colourEight, setColourEight] = useState('#d4e7f2');
  const [colourNine, setColourNine] = useState('#d4e7f2');
  const [colourTen, setColourTen] = useState('#d4e7f2');
  const [colourEleven, setColourEleven] = useState('#d4e7f2');
  const [colourTwelve, setColourTwelve] = useState('#d4e7f2');
  const [tokenValue, setTokenValue] = useState('');
  const [inputColorTextPONumber, setInputColorTextPONumber] = useState("#000000");
  const [inputColorProductDescription, setInputColorProductDescription] = useState("#000000");
  const [inputColorRadio, setInputColorRadio] = useState("#000000");
  const [inputColorDropdown, setInputColorDropdown] = useState("#ae8b8b");
  const [inputColorSpinner, setInputColorSpinner] = useState("#000000");
  let controller;

  useEffect(() => {
    const unsubscribe = props.navigation.addListener('blur', async () => {
      //setLoading(true);
      clearSelection();
      //setLoading(false);
    });

    return unsubscribe;
  }, [props.navigation]);

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
          let url = `${ACCESS_API}/producttype`;
          fetch(url ,{method: 'POST', body: formBody, headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',},})
          .then((response) => response.json())
          .then(json => {
            loadingItems.push({"label":"Choose Product Description Category","value":"Choose Product Description Category"});
            for(var i = 0; i < json.length; i++){ loadingItems.push({"label":json[i],"value":json[i]}); }
            setPickerItems(loadingItems);
            setLoadingPicker(false);
          })
          .catch((error) => console.error(error))
        }
        const loadingLocItems = [];
        if(isLoadingLocPicker)
        {
          let url = `${ACCESS_API}/locationlist`;
          fetch(url ,{method: 'POST', body: formBody, headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',},})
          .then((response) => response.json())
          .then(json => {
            loadingLocItems.push({"label":"Choose Location","value":"Choose Location"});
            for(var i = 0; i < json.length; i++){ loadingLocItems.push({"label":json[i],"value":json[i]}); }
            setPickerLocItems(loadingLocItems);
            setLoadingLocPicker(false);
          })
          .catch((error) => console.error(error))
        }
      });// End of encryption/decryption

    },
  );

  function setTransparentColor(){
    let POOrOrderNumberKeywordTemporary2 = POOrOrderNumberKeywordTemporary;
    let POOrderNumberTemporary2 = POOrOrderNumberTemporary;
    let productDescriptionKeywordTemporary2 = productDescriptionKeywordTemporary;
    let productDescriptionCategoryTemporary2 = productDescriptionCategoryTemporary;
    let monthTemp2 = monthTemp;
    let yearTemp2 = yearTemp;

    setInputColorTextPONumber("#d6bcbc");
    setInputColorProductDescription("#d6bcbc");
    setInputColorRadio("#d6bcbc");
    setInputColorDropdown("#d6bcbc");
    setInputColorSpinner("#d6bcbc");
    setColourOne('#d4e7f2'); setColourTwo('#d4e7f2');setColourThree('#d4e7f2');setColourFour('#d4e7f2');
    setColourFive('#d4e7f2'); setColourSix('#d4e7f2');setColourSeven('#d4e7f2');setColourEight('#d4e7f2');
    setColourNine('#d4e7f2'); setColourTen('#d4e7f2');setColourEleven('#d4e7f2');setColourTwelve('#d4e7f2');

    setPOOrOrderNumber('');
    setPOOrOrderNumberKeyword('');
    setProductDescriptionCategory('');
    setProductDescriptionKeyword('');
    setMonth(0);
    setYear(0);

    setPOOrOrderNumberTemporary(POOrderNumberTemporary2);
    setPOOrOrderNumberKeywordTemporary(POOrOrderNumberKeywordTemporary2);
    setProductDescriptionKeywordTemporary(productDescriptionKeywordTemporary2);
    setProductDescriptionCategoryTemporary(productDescriptionCategoryTemporary2);
    setYearTemp(yearTemp2);
    setMonthTemp(monthTemp2);
  }

  function setFocusRadio()
  {
    setTransparentColor();
    setInputColorRadio("#000000");
    setInputColorTextPONumber("#000000");
    setPOOrOrderNumber(POOrOrderNumberTemporary);
  }

  function setRadioPress(RadioValue){
    setTransparentColor();
    setInputColorRadio("#000000");
    setInputColorTextPONumber("#000000");
    setPOOrOrderNumber(RadioValue);
    setPOOrOrderNumberTemporary(RadioValue);
    setPOOrOrderNumberKeyword(POOrOrderNumberKeywordTemporary);
  }

  function setFocusOrderNumber(){
    setTransparentColor();
    setInputColorTextPONumber("#000000");
    setInputColorRadio("#000000");
    setPOOrOrderNumberKeyword(POOrOrderNumberKeywordTemporary);
    setPOOrOrderNumber(POOrOrderNumberTemporary);
  }

  function setPOOrderNumberChange(POOrOrderNumberKeywordTemp){
    setPOOrOrderNumberKeyword(POOrOrderNumberKeywordTemp);
    setPOOrOrderNumberKeywordTemporary(POOrOrderNumberKeywordTemp);
    getDataAutoCompleteData(POOrOrderNumberKeywordTemp);
  }

  function setFocusProductDesription(){
    setTransparentColor();

    setInputColorDropdown("#000000");
    setInputColorProductDescription("#000000");

    setProductDescriptionCategory(productDescriptionCategoryTemporary);
    setProductDescriptionKeyword(productDescriptionKeywordTemporary);
  }

  function setDropdownChange(ProductDescription){
    setTransparentColor();

    setInputColorDropdown("#000000");
    setInputColorProductDescription("#000000");

    setProductDescriptionCategory(ProductDescription);
    setProductDescriptionCategoryTemporary(ProductDescription);
  }

  function setDropdownLocChange(Location){
    setTransparentColor();
    setSearchLocation(Location);
    setSearchLocationTemporary(Location);
  }

  function setProductDescriptionKeywordChange(keyword){
    setProductDescriptionKeyword(keyword);
    setProductDescriptionKeywordTemporary(keyword);
  }

  function setSpinnerChange(num){
    setTransparentColor();
    setInputColorSpinner("#000000");
    handleClick(monthTemp);
    setYear(num);
    setYearTemp(num);
    setMonth(monthTemp)
  }

  const handleClick = (buttonNumber) => {
    setTransparentColor();
    if(buttonNumber == "1") { setColourOne('#050a76') } else if (buttonNumber == "2") {setColourTwo('#050a76')}
    else if (buttonNumber == "3") {setColourThree('#050a76'); } else if (buttonNumber == "4") {setColourFour('#050a76')}
    else if (buttonNumber == "5") {setColourFive('#050a76'); } else if (buttonNumber == "6") {setColourSix('#050a76')}
    else if (buttonNumber == "7") {setColourSeven('#050a76'); } else if (buttonNumber == "8") {setColourEight('#050a76')}
    else if (buttonNumber == "9") {setColourNine('#050a76'); } else if (buttonNumber == "10") {setColourTen('#050a76')}
    else if (buttonNumber == "11") {setColourEleven('#050a76'); } else if (buttonNumber == "12") {setColourTwelve('#050a76')}
    setInputColorSpinner("#000000");
    setMonth(buttonNumber);
    setMonthTemp(buttonNumber);
    setYear(yearTemp);
  }

  function clearSelection(){
    setTransparentColor();
    setPOOrOrderNumberTemporary('');
    setPOOrOrderNumberKeywordTemporary('');
    setProductDescriptionKeywordTemporary('');
    setProductDescriptionCategoryTemporary('');
    setMonthTemp('');
    setAutoSearchData([]);
    setPickerLocOpen(false);
    setPickerOpen(false);

    if(controller)
      controller.selectItem('Choose Product Description Category');
  }

  const handleSubmitPress = () => {
    //console.log("year => " + year + "::month => " + month + ":: POOrOrderNumber => " + POOrOrderNumber + ":: POOrOrderNumberKeyword => " + POOrOrderNumberKeyword + ":: productDescriptionCategory => " + productDescriptionCategory + ":: productDescriptionKeyword => " + productDescriptionKeyword + ":: searchLocation => " + searchLocation);
    let navigateToScreen = ((productDescriptionCategory == "" || !productDescriptionCategory) && (year == "" || year == '0') && (month == "" || month == '0') && (searchLocation == "" || !searchLocation)) ? 'SearchResult' : 'SearchResultETAProductDesc';
    console.log(navigateToScreen);
    props.navigation.navigate(navigateToScreen, {
        year:year,
        month:month,
        POOrOrderNumber:POOrOrderNumber,
        POOrOrderNumberKeyword:POOrOrderNumberKeyword,
        productDescriptionCategory:productDescriptionCategory,
        productDescriptionKeyword:productDescriptionKeyword,
        TokenValue:tokenValue,
        SearchedLocation:searchLocation,
      }
    )
  };

  const getDataAutoCompleteData = (POOrOrderNumberKeywordTemp) => {
    if (POOrOrderNumberKeywordTemp && POOrOrderNumberKeywordTemp !== '') {
      setIsLoadingAutoSearch(true);
      var dataToSend = {};
      if (!POOrOrderNumber || POOrOrderNumber === '' || POOrOrderNumber === 0) {
        dataToSend = {
          Token: '' + tokenValue,
          OrderNumber: '' + POOrOrderNumberKeywordTemp,
        };
      }
      if (POOrOrderNumber && POOrOrderNumber === 1) {
        dataToSend = {
          Token: '' + tokenValue,
          PONumber: '' + POOrOrderNumberKeywordTemp,
        };
      }
      //console.log({dataToSend, POOrOrderNumber, POOrOrderNumberKeyword});
      var formBody = [];
      for (let key in dataToSend) {
        var encodedKey = encodeURIComponent(key);
        var encodedValue = encodeURIComponent(dataToSend[key]);
        formBody.push(encodedKey + '=' + encodedValue);
      }
      formBody = formBody.join('&');
      let url = `${ACCESS_API}/autocompletesearch`;
      fetch(url, {
        method: 'POST',
        body: formBody,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        },
      })
        .then((response) => response.json())
        .then((json) => {
          setAutoSearchData(json);
          setIsLoadingAutoSearch(false);
        })
        .catch((error) => {
          console.error(error);
          setIsLoadingAutoSearch(false);
        });
    }
    else{
      setAutoSearchData([]);
    }
  };

  return (
    <SafeAreaView style={styles.mainBody}>
      <ScrollView>
      <KeyboardAvoidingView enabled>
      <View>
      <Image
            source={require('AnRNApp/Image/bar.png')}
            style={{
              width: '100%',
              height: 200,
              marginTop:-130,
              resizeMode:'contain',
              borderTopLeftRadius:0,
              borderTopRightRadius:0,
              borderRadius: 1000,
              transform: [
                {scaleX: 4*widthMultiplier}
              ]
            }}
          />
      </View>
      <View style={{ alignItems: 'center', position:'absolute', top:20, left:0, right:0 }}>
          <LOGOSVG
            width={150}
            height={40}
          />
      </View>
      <View  style={{marginTop:10, marginLeft:20, alignItems:'stretch',justifyContent:'flex-start'}}>
          <Text style={{fontFamily:'HelveticaNeue'}}>Choose one of the search filters below:</Text>
      </View>
      <TouchableOpacity  style={{marginTop:10, marginLeft:20, marginRight:20, alignItems:'stretch',justifyContent:'flex-start'}} onPress={() => clearSelection()}>
          <Text style={{alignSelf:'center',alignItems:'center',textDecorationLine:'underline', fontFamily:'HelveticaNeue'}}>Clear Selections</Text>
      </TouchableOpacity>
      <View style={{marginTop:20, marginLeft:22, alignItems:'stretch',justifyContent:'flex-start'}}>
        <RadioForm
          formHorizontal={true}
          labelStyle={{
            fontSize: 12,
            color: inputColorRadio,
            fontFamily:'HelveticaNeue'
          }}
          radio_props={radio_props}
          buttonOuterSize={16}
          onFocus={setFocusRadio}
          animation={false}
          selectedButtonColor={inputColorRadio}
          buttonInnerColor={'#000000'}
          buttonColor={inputColorRadio}
          initial={0}
          onPress={
            (RadioValue) => setRadioPress(RadioValue)
          }
        />
      </View>
      {/*<View style={{
        flex:1,
        flexDirection: 'row',
        alignItems:'center',
        height:40,
        marginLeft:20,
        marginRight:20,
        marginBottom:5,
        marginTop:8,
        borderWidth: 1,
        borderRadius: 7,
        borderColor: inputColorTextPONumber,
      }}>
         <TextInput
          style={{
            flex: 1,
            paddingLeft: 5,
            paddingRight: 15,
          }}
          placeholder="Order/PO Number" //12345
          placeholderTextColor="#191E2460"
          keyboardType="default"
          value={POOrOrderNumberKeyword}
          onFocus={setFocusOrderNumber}
          onChangeText={TextInputValue => setPOOrderNumberChange(TextInputValue)}
          onSubmitEditing={Keyboard.dismiss}
          blurOnSubmit={false}
        />
        </View> */}
      <View>
        <Autocomplete
          listContainerStyle={{
            flex: 1,
            position: 'absolute',
            left: 10,
            top: 45,
            right: 0,
            minHeight:40,
            maxHeight:250,
            padding: 0,
            marginLeft:5,
            marginRight:15,
            marginBottom:5,
            marginTop:8,
            zIndex:2,
          }}
          containerStyle={{
            flex: 1,
            padding: 5,
            zIndex:2,
          }}
          inputContainerStyle={{
            height:40,
            marginLeft:20,
            marginRight:20,
            marginBottom:5,
            marginTop:8,
            borderWidth: 1,
            borderRadius: 7,
            borderColor: inputColorTextPONumber,
          }}
          editable={!isLoadingAutoSearch}
          value={POOrOrderNumberKeyword}
          data={autoSearchData}
          flatListProps={{
            keyboardShouldPersistTaps: 'always',
            keyExtractor: (_, idx) => idx,
            renderItem: ({ item }) => (
              <gestureHandler.TouchableOpacity
                style={{
                  padding:2,
                  borderTopColor:'grey',
                  borderTopWidth:1,
                  borderBottomColor:'grey',
                  borderBottomWidth:1,
                  zIndex:2,
                }}
                onPress={() => {
                  setPOOrOrderNumberKeyword(item);
                  setPOOrOrderNumberKeywordTemporary(item);
                  setAutoSearchData([]);
                }}>
                <Text style={{fontSize: 15,margin: 2,}}>{item}</Text>
              </gestureHandler.TouchableOpacity>
            ),
          }}
          hideResults={false}
          renderTextInput={()=>{
            return (
              <TextInput
                placeholder="Order/PO Number" //12345
                placeholderTextColor="#191E2460"
                keyboardType="default"
                value={POOrOrderNumberKeyword}
                onFocus={setFocusOrderNumber}
                onChangeText={TextInputValue => setPOOrderNumberChange(TextInputValue)}
                onSubmitEditing={Keyboard.dismiss}
                blurOnSubmit={false}
              />
            );
          }}
        />
      </View>
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
        <Text style={{marginBottom:10,fontFamily:'HelveticaNeue'}}>Product Description</Text>
        {isLoadingPicker ? <ActivityIndicator size="large" color="#00ff00"/> : (
          <DropDownPicker
            placeholder="Choose Product Description Category"
            open={pickerOpen}
            value={pickerValue}
            items={pickerItems}
            setOpen={setPickerOpen}
            setValue={setPickerValue}
            setItems={setPickerItems}
            listMode="SCROLLVIEW"
            containerProps={{
              marginLeft: -2,
              ...(pickerOpen ? {zIndex:2} : {zIndex:1})
            }}
            onChangeValue={(ProductDescription) => {
              setDropdownChange(ProductDescription)
            }}
            />
        )}
      </View>
      <View
        style={{
          flex:1,
          flexDirection: 'row',
          alignItems:'center',
          height:40,
          marginLeft:20,
          marginRight:20,
          marginBottom:5,
          marginTop:16,
          borderWidth: 1,
          borderRadius: 7,
          borderStyle:'solid',
          borderColor: inputColorProductDescription,
        }}>
        <TextInput
          style={{
            flex: 1,
            paddingLeft: 5,
            paddingRight: 15,
          }}
          placeholder="Enter Product Description" //12345
          placeholderTextColor="#191E2460"
          keyboardType="default"
          onFocus={setFocusProductDesription}
          value={productDescriptionKeyword}
          onChangeText={TextInputValue => setProductDescriptionKeywordChange(TextInputValue)}
          onSubmitEditing={Keyboard.dismiss}
          blurOnSubmit={false}
        />
      </View>
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
        <Text style={{marginBottom:10,fontFamily:'HelveticaNeue'}}>Final Destination</Text>
        {isLoadingLocPicker ? <ActivityIndicator size="large" color="#00ff00"/> : (
          <DropDownPicker
            placeholder="Choose Final Destination"
            open={pickerLocOpen}
            value={pickerLocValue}
            items={pickerLocItems}
            setOpen={setPickerLocOpen}
            setValue={setPickerLocValue}
            setItems={setPickerLocItems}
            listMode="SCROLLVIEW"
            containerProps={{
              marginLeft: -2,
              ...(pickerLocOpen ? {zIndex:2} : {zIndex:1})
            }}
            onChangeValue={(Location) => {
              setDropdownLocChange(Location);
            }}
            />
        )}
      </View>
      <View style={{alignItems:'stretch',justifyContent:'flex-start'}}>
        <Text style={{marginLeft:20, marginBottom:10, marginTop:20,fontWeight:'bold',fontSize:15}}>Estimated Time Arrival</Text>
      </View>
      <View style={{alignItems:'center',justifyContent:'center',resizeMode:'contain'}}>
        <MyInputSpinner max={2050} min={2000} value={year} onChange={(num) => setSpinnerChange(num)}/>
      </View>
      <View style={{marginTop:8, alignItems:'stretch',justifyContent:'flex-start', flexDirection:'row'}}>
      <TouchableOpacity style={[styles.monthFirstRow, {backgroundColor:colourOne}]} onPress={handleClick.bind(this,'1')}><Text style={{color:'#c97d7d', fontFamily:'HelveticaNeue'}}>January</Text></TouchableOpacity>
        <TouchableOpacity style={[styles.monthSecondRow, {backgroundColor:colourTwo}]} onPress={handleClick.bind(this,'2')}><Text style={{color:'#c97d7d', fontFamily:'HelveticaNeue'}}>February</Text></TouchableOpacity>
        <TouchableOpacity  style={[styles.monthThirdRow, {backgroundColor:colourThree}]} onPress={handleClick.bind(this,'3')}><Text style={{color:'#c97d7d', fontFamily:'HelveticaNeue'}}>March</Text></TouchableOpacity>
      </View>
      <View style={{marginTop:0, alignItems:'stretch',justifyContent:'flex-start', flexDirection:'row'}}>
        <TouchableOpacity style={[styles.monthFirstRow, {backgroundColor:colourFour}]} onPress={handleClick.bind(this,'4')}><Text  style={{color:'#c97d7d', fontFamily:'HelveticaNeue'}}>April</Text></TouchableOpacity>
        <TouchableOpacity style={[styles.monthSecondRow, {backgroundColor:colourFive}]} onPress={handleClick.bind(this,'5')}><Text  style={{color:'#c97d7d', fontFamily:'HelveticaNeue'}}>May</Text></TouchableOpacity>
        <TouchableOpacity style={[styles.monthThirdRow, {backgroundColor:colourSix}]} onPress={handleClick.bind(this,'6')}><Text  style={{color:'#c97d7d', fontFamily:'HelveticaNeue'}}>June</Text></TouchableOpacity>
      </View>
      <View style={{marginTop:0, alignItems:'stretch',justifyContent:'flex-start', flexDirection:'row'}}>
        <TouchableOpacity style={[styles.monthFirstRow, {backgroundColor:colourSeven}]} onPress={handleClick.bind(this,'7')}><Text  style={{color:'#c97d7d', fontFamily:'HelveticaNeue'}}>July</Text></TouchableOpacity>
        <TouchableOpacity style={[styles.monthSecondRow, {backgroundColor:colourEight}]} onPress={handleClick.bind(this,'8')}><Text  style={{color:'#c97d7d', fontFamily:'HelveticaNeue'}}>August</Text></TouchableOpacity>
        <TouchableOpacity style={[styles.monthThirdRow, {backgroundColor:colourNine}]} onPress={handleClick.bind(this,'9')}><Text  style={{color:'#c97d7d', fontFamily:'HelveticaNeue'}}>September</Text></TouchableOpacity>
      </View>
      <View style={{marginTop:0, alignItems:'stretch',justifyContent:'flex-start', flexDirection:'row'}}>
        <TouchableOpacity style={[styles.monthFirstRow, {backgroundColor:colourTen}]} onPress={handleClick.bind(this,'10')}><Text  style={{color:'#c97d7d', fontFamily:'HelveticaNeue'}}>October</Text></TouchableOpacity>
        <TouchableOpacity style={[styles.monthSecondRow, {backgroundColor:colourEleven}]} onPress={handleClick.bind(this,'11')}><Text  style={{color:'#c97d7d', fontFamily:'HelveticaNeue'}}>November</Text></TouchableOpacity>
        <TouchableOpacity style={[styles.monthThirdRow, {backgroundColor:colourTwelve}]} onPress={handleClick.bind(this,'12')}><Text  style={{color:'#c97d7d', fontFamily:'HelveticaNeue'}}>December</Text></TouchableOpacity>
      </View>
      <View style={{marginTop:0, alignItems:'stretch',justifyContent:'flex-start'}}>
        <TouchableOpacity
          style={styles.buttonStyle}
          activeOpacity={0.5}
          onPress={handleSubmitPress}
        >
          <Text style={styles.buttonTextStyle}>SUBMIT</Text>
        </TouchableOpacity>
      </View>
      </KeyboardAvoidingView>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  mainBody: {
    flex: 1,
    backgroundColor: '#fdfdfd',
  },
  SectionStyle: {
  },
  container: {
    height : 100,
    width : '50%',
    transform : [ { scaleX : 0.5 } ],
    borderBottomStartRadius : 1000,
    borderBottomEndRadius : 1000,
    overflow : 'hidden',
  },
  background: { // this shape is a circle
    flex : 1,
    transform : [ { scaleX : 2 } ],
    backgroundColor : '#061368',
    alignItems : 'center',
    justifyContent : 'center'
  },
  textStyle: {
    marginTop: 10,
  },
  titleStyle: {
    textAlign: 'center',
    fontSize: 20,
    margin: 20,
  },
  buttonStyle: {
    backgroundColor: '#2E8B57',
    fontWeight:'bold',
    borderWidth: 0,
    color: '#000000',
    borderColor: '#228B22',
    fontFamily:'HelveticaNeue-Bold',
    height: 40,
    alignItems: 'center',
    borderRadius: 40,
    marginLeft: 35,
    marginRight: 35,
    marginTop: 20,
    marginBottom: 20,
  },
  buttonTextStyle: {
    fontFamily:'HelveticaNeue-Bold',
    color: '#FFFFFF',
    paddingVertical: 10,
    fontSize: 13,
  },
  monthFirstRow: {
      borderStyle:'solid',
      marginLeft:'5%',
      justifyContent:'center',
      alignItems:'center',
      textAlign:'center',
      fontFamily:'HelveticaNeue-Bold',
      width:'30%',
      height:40,
      borderRadius:5,
      borderWidth:1,
      borderColor:'#e3ecf2',
      borderBottomColor:'#f5dddd',
      marginTop:8,
      color:'#000102',
  },
  monthSecondRow: {
    borderStyle:'solid',
    marginLeft:2,
    textAlign:'center',
    justifyContent:'center',
    alignItems:'center',
    fontFamily:'HelveticaNeue-Bold',
    width:'30%',
    height:40,
    borderRadius:5,
    marginTop:8,
    color:'#000102',
    borderWidth:1,
    borderColor:'#e3ecf2',
    borderBottomColor:'#f5dddd',
  },
  monthThirdRow:{
    borderStyle:'solid',
    marginLeft:2,
    marginRight:'5%',
    justifyContent:'center',
    alignItems:'center',
    fontFamily:'HelveticaNeue-Bold',
    textAlign:'center',
    width:'30%',
    height:40,
    borderRadius:5,
    marginTop:8,
    color:'#000102',
    borderWidth:1,
    borderColor:'#e3ecf2',
    borderBottomColor:'#f5dddd',
  }
});
export default SearchScreen;