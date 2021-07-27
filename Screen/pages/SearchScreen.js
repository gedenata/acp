import React, {useState} from 'react';
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
import {API_URL} from '@env';
import AsyncStorage from '@react-native-community/async-storage';
import InputSpinner from "react-native-input-spinner";

import RadioForm from 'react-native-simple-radio-button';
import DropDownPicker from 'react-native-dropdown-picker';

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

  const [productDescriptionKeyword, setProductDescriptionKeyword] = useState('');
  const [productDescriptionKeywordTemporary, setProductDescriptionKeywordTemporary] = useState('');
  
  const [isLoadingPicker, setLoadingPicker] = useState(true);  
  const [pickerItems, setPickerItems] = useState(true);  

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
          let url = `${API_URL}/WebApi1/access/api/producttype`;
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

    if(controller)
      controller.selectItem('Choose Product Description Category');    
  }

  const handleSubmitPress = () => {
    // console.log("year => " + year + "::month => " + month + ":: POOrOrderNumber => " + POOrOrderNumber + ":: POOrOrderNumberKeyword => " + POOrOrderNumberKeyword + ":: productDescriptionCategory => " + productDescriptionCategory + ":: productDescriptionKeyword => " + productDescriptionKeyword);
    props.navigation.navigate((productDescriptionCategory == "" && year == "" && month == "") ? 'SearchResult' : 'SearchResultETAProductDesc', {
        year:year, 
        month:month, 
        POOrOrderNumber:POOrOrderNumber,
        POOrOrderNumberKeyword:POOrOrderNumberKeyword, 
        productDescriptionCategory:productDescriptionCategory,
        productDescriptionKeyword:productDescriptionKeyword,
        TokenValue:tokenValue
      }
    )
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
      <View style={{
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
            style={{
              borderStyle:'solid',
              borderColor:inputColorProductDescription,
            }}
            items={pickerItems}
            containerStyle={{
              height: 40,
            }}
            controller={instance => controller = instance}
            placeholder="Choose Product Description Category"
            style={{
              backgroundColor: '#fafafa',
              color:inputColorDropdown
            }}
            onFocus={setFocusProductDesription}
            itemStyle={{
              justifyContent: 'flex-start',
              color:inputColorDropdown
            }}
            dropDownStyle={{
              backgroundColor: '#fafafa',
              borderColor:inputColorDropdown,
              borderStyle:'solid',
              borderWidth:1,
              borderRaidus:7,
            }}
            onChangeItem={
              (ProductDescription) => setDropdownChange(ProductDescription.value)
            }
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
          marginTop:8,
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
      <View style={{alignItems:'stretch',justifyContent:'flex-start'}}>
        <Text style={{marginLeft:20, marginBottom:10, marginTop:20,fontWeight:'bold',fontSize:15}}>Estimated Time Arrival</Text>
      </View>
      <View style={{alignItems:'center',justifyContent:'center',resizeMode:'contain'}}>
        <InputSpinner
          max={2050}
          min={2000}
          editable={false}
          step={1}
          rounded={false}
          buttonLeftText={"<"}
          buttonRightText={">"}
          style={{
            width:'95%',
            borderRadius:5,
          }}
          buttonStyle={{transform:[
            {scale:0.75}
          ]}}
          fontSize={18}
          colorMax={"#f04048"}
          colorMin={"#40c5f4"}
          fontWeight={"bold"}
          textColor={inputColorSpinner}
          value={ new Date().getFullYear() } // {this.state.number}
          onChange={(num) => {
            setSpinnerChange(num);
          }}
        />
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