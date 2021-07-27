// import React in our code
import React, {useState, useEffect} from 'react';

// import all the components we are going to use
import {
  SafeAreaView,
  View,
  StyleSheet,
  Image,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Dimensions
} from 'react-native';
import {API_URL} from '@env';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';

import Moment from 'moment';
import AsyncStorage from '@react-native-community/async-storage';

const { width } = Dimensions.get('window');
const widthMultiplier = width / 400;
import AESEncryption from './../Components/AESEncryption';

const ProductCatalogueSearchScreen = ({route, navigation}) => {

    const [ productSearchText, setProductSearchText ] = useState('');
    const [ totalSelectedProduct, setTotalSelectedProduct ] = useState('0');
    const [ multipleCategories, setMultipleCategories] = useState([]);

    const goBackToPage = () => { navigation.goBack(); };

    const clearAll = () => {
      setProductSearchText('');
      
      let counter=0;
      let multipleCategoriesTemp = [];
      while(true){
        multipleCategoriesTemp.push({ Name:multipleCategories[counter].Name,selected: false })
        counter++;
        if(counter >= multipleCategories.length)
            break;
      }
      // setTotalSelectedProduct(counter);
      setTotalSelectedProduct(0);
      setMultipleCategories(multipleCategoriesTemp);
    }    

    const handleSelectType = (paperTypeName) => {
        let counter=0;
        let counterSelected=0;
        let multipleCategoriesTemp = [];
        while(true){
            if(multipleCategories[counter].Name == paperTypeName){
                multipleCategoriesTemp.push({ Name:multipleCategories[counter].Name,selected: (!multipleCategories[counter].selected) })
            }else{
                multipleCategoriesTemp.push({ Name:multipleCategories[counter].Name,selected:multipleCategories[counter].selected })
            }
            counterSelected = counterSelected + ((multipleCategoriesTemp[counter].selected) ? 1 : 0);

            counter++;
            if(counter >= multipleCategories.length)
                break;
        }
        setTotalSelectedProduct(counterSelected);
        setMultipleCategories(multipleCategoriesTemp);
    }

    // Force Load
    const handleSubmitPress = () => {
        navigation.push('ProductCatalogueDetail', {ProductCategories:multipleCategories, SearchText:productSearchText, PaperType:route.params.PaperType})
    }

    useEffect(() => 
    {
      AsyncStorage.getItem('user_id').then(
        (value) =>
        {
          AESEncryption("decrypt",value).then((respp)=>{
				var dataToSend = {Token: ''+JSON.parse(respp).data.Token, PaperType:route.params.PaperType};

				var formBody = [];
				for (let key in dataToSend){
					var encodedKey = encodeURIComponent(key);
					var encodedValue = encodeURIComponent(dataToSend[key]);
					formBody.push(encodedKey + '=' + encodedValue);
				}
				formBody = formBody.join('&');
        let url = `${API_URL}/WebApi1/access/api/productcategories`;
				fetch(url, {
				  method: 'POST',
				  body: formBody, 
				  headers: {
					'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
				  },
				})
				.then((response) => response.json())
				.then(json => {
              
				let multipleCategoriesTemp = [];
				for(let key in json){
					multipleCategoriesTemp.push({Name:json[key],selected:false})
				}
  
				setMultipleCategories(multipleCategoriesTemp);
				// setTotalSelectedProduct(multipleCategoriesTemp.length);
				})
			.catch((error) => console.error(error))            
		  });// End of encryption/decryption
        }
      );
    }, []);

    Moment.locale('en');  
  
    return (
      <SafeAreaView style={styles.mainBody}>
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
            <Text style={{ marginTop:7,color:'#FDFDFD',fontSize:19, fontFamily:'HelveticaNeue-Bold',}}>Product Catalogue</Text>
        </View>
      <TouchableOpacity  style={{marginTop:0, marginLeft:20, marginRight:20, alignItems:'stretch',justifyContent:'flex-start'}} onPress={() => clearAll()}>
        <Text style={{alignSelf:'center',alignItems:'center',textDecorationLine:'underline', color:'#00854F'}}>Clear All</Text>
      </TouchableOpacity>      
      <View
        style={{
          flex:1,
          flexDirection: 'row',
          alignItems:'center',
        }}
      >
        <Text style={{fontWeight:'bold', fontSize:15, color:'#000000',marginLeft:30, marginTop:15, marginBottom:15, flex:1}}>Search Product</Text>
      </View>
      <View style={styles.SectionStyle}>
        <MaterialIcons raised name="search" size={30} color="#000" style={styles.searchIcon}/>
        <TextInput
          style={{position:'absolute',left:40,right:0, width:'100%', opacity:(productSearchText != "" ? 1 : 0.6)}}
          onChangeText={productSearch => setProductSearchText(productSearch)}
          underlineColorAndroid="#FFFFFF"
          keyboardType="default"
          placeholder="Search Product"
          placeholderTextColor="#191E24"
          autoCapitalize="none"
          returnKeyType="next"
          value={productSearchText}
          onSubmitEditing={() =>
            this._passwordinput && this._passwordinput.focus()
          }
          blurOnSubmit={false}
        />
      </View>      
      <View
        style={{
          flex:1,
          height:50,
          flexDirection: 'row',
          alignItems:'center',
          borderBottomWidth:1, 
          borderBottomColor:'#e4c2c2'          
        }}
      >
        <Text style={{fontWeight:'bold', fontSize:13, color:'#191E24', marginBottom:5, left:30, position:'absolute'}}>Filter By Category</Text>
        <Text style={{fontSize:13, color:'#00854F', marginBottom:5, right:30, position:'absolute'}}>{totalSelectedProduct} Selected</Text>
      </View>
        <ScrollView>
            {
                multipleCategories.map((item, key) => (
                  <View key={key} style={{marginTop:0, minHeight:45, borderBottomWidth:1, borderBottomColor:'#e4c2c2', flex:2, flexDirection:'row'}}>
                    <View style={{left:35, justifyContent:'center', width:'70%' }}>
                      <Text style={{ fontSize:15, color:'#000000', textAlign:'left'}}>{item.Name}</Text> 
                    </View>
                    <TouchableOpacity 
                        style={{position:'absolute',top:10,right:35}}
                        onPress={() => {
                            handleSelectType(item.Name)
                        }}
                    >
                        {item.selected == true ? (<AntDesign name="check" size={24} color="#00854F"/>) : (<AntDesign name="check" size={18} color="#000000"/>) }
                    </TouchableOpacity>
                  </View>
              ))
            }
        </ScrollView>
        <View style={{marginTop:0, alignItems:'stretch',justifyContent:'flex-start'}}>
        <TouchableOpacity
          style={styles.buttonStyle}
          activeOpacity={0.5}
          onPress={ () => { handleSubmitPress() } }
        >
          <Text style={styles.buttonTextStyle}>CONFIRM</Text>
        </TouchableOpacity>
      </View>              
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
    fontFamily:'sans-serif-light',
    backgroundColor: '#2E8B57',
    fontWeight:'bold',
    borderWidth: 0,
    color: '#000000',
    borderColor: '#228B22',
    height: 50,
    alignItems: 'center',
    borderRadius: 40,
    marginLeft: 35,
    marginRight: 35,
    marginTop: 20,
    marginBottom: 20,
  },
  buttonTextStyle: {
    color: '#FFFFFF',
    paddingVertical: 12,
    fontSize: 16,
  },  
});
export default ProductCatalogueSearchScreen;