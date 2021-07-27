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
  Modal,
  ScrollView,
  TouchableOpacity,
  PermissionsAndroid,
  Dimensions,
  ToastAndroid,
  Alert,
  Platform
} from 'react-native';
import {API_URL} from '@env';
import Loader from './../Components/loader';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Moment from 'moment';
import AsyncStorage from '@react-native-community/async-storage';

import Pdf from 'react-native-pdf';
import DeviceInfo from 'react-native-device-info';

const { width } = Dimensions.get('window');
const widthMultiplier = width / 400;

import LOGOSVG from 'AnRNApp/Image/svg_logo/emptystate_noresults.svg';

import {decode} from 'html-entities';

import AESEncryption from './../Components/AESEncryption';

import RNFetchBlob from 'rn-fetch-blob';

var RNFS = require('react-native-fs');

const ProductCatalogueDetailScreen = ({route, navigation}) => {
    const [tokenValue, setTokenValue] = useState('');
    const [itemList, setItemList] = useState([]);

    const [ totalShownProduct, setTotalShownProduct ] = useState('');
    const [ isLoadingPopupSendConfirmation, setLoadingPopupSendConfirmation ] = useState(false);
    const [ selectedPaperType, setSelectedPaperType ] = useState([]);
    const [ pdfProductName, setPdfProductName ] = useState('');
    const [ pdfString, setPdfString ] = useState('');

    const [ fontScale, setFontScale ] = useState(1);

    const isPlatformAndroid = (Platform.OS === 'android');
    const path = isPlatformAndroid ? RNFS.DownloadDirectoryPath : RNFS.LibraryDirectoryPath;    

    DeviceInfo.getFontScale().then((fontScaleTemp) => {
      setFontScale(fontScaleTemp)
    });        

    const goBackToPage = () => { navigation.goBack(); };

    const handleStartSearch = () => {
      navigation.navigate('ProductCatalogueSearch', {PaperType:route.params.PaperType})
    }

    const [ pdfSource, setPdfSource ] = useState({});

    const handleOpenFile = (idProduct,productName) => {
      setPdfProductName(productName);
      setLoading(true);
      var dataToSend = {Token: ''+tokenValue};

      var formBody = [];
      for (let key in dataToSend){
          var encodedKey = encodeURIComponent(key);
          var encodedValue = encodeURIComponent(dataToSend[key]);
          formBody.push(encodedKey + '=' + encodedValue);
          formBody.push('ID' + '=' + idProduct);
      }

      formBody = formBody.join('&');
      let url = `${API_URL}/WebApi1/access/api/productcataloguefile`;
      fetch(url, {
        method: 'POST',
        body: formBody, 
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        },
      })
      .then((response) => response.json())
      .then(json => {
        // console.log("Check source : " + json[0].FileData);
        setPdfString(json[0].FileData);
        setPdfSource({uri : "data:application/pdf;base64," + json[0].FileData});
        setLoadingPopupSendConfirmation(true);
        setLoading(false);
      })
      .catch((error) => console.error(error))
    }

    const buildItemProductCatalogueList = ({item}) => {
      return (
        <View
          style={{
            flex: 1,
            flexDirection: "column",
            borderRadius:12,
            backgroundColor:'#FFFFFF',
            minHeight: 156,
            borderWidth:1,
            marginRight:((width <= 360 || fontScale > 1.2) ? 7 : 15),
            marginLeft:((width <= 360 || fontScale > 1.2) ? 7 : 15), 
            color:'#000000',
            borderColor:'#ccc',
            marginBottom:5, 
            marginTop:5,
            paddingLeft:5,
            paddingTop:5,
          }}
          key="outstanding{item.OrderNumber}"
        >
          <View style={{position:'absolute',left:0,height:30,width:3,borderBottomRightRadius:2,borderTopRightRadius:2, backgroundColor:'#00854F',marginTop:8}}/>          
          <View style={{flex: 3 }}>
            <View style={{flex: 1, flexDirection: "row"}}>
              <View style={{flex: 1}}>
                <Image 
                  style={{
                    width: '100%',
                    height: '100%',
                    resizeMode: 'contain',
                  }}
                  source={{ uri: `data:image/jpg;base64,${ item.ImageIconData }`}}
                />
              </View>
              <View style={{flex: 2}}>
                <View style={{flex: 1, paddingLeft: 5}}>
                  <Text style={{fontWeight:'bold', fontSize:13, color:'#000000', fontFamily:'HelveticaNeue', }}>{decode(item.Name)}</Text>
                </View>
                <View style={{flex: 3, }}>
                  <View style={{flex: 1, flexDirection: "row"}}>
                    <View style={{flex: 1, paddingLeft: 5}}>
                      <Text style={{ fontSize:13, color:'#000000', fontFamily:'HelveticaNeue', }}>Category</Text>
                    </View>
                    <View style={{flex: 1}}>
                      <Text style={{color:'#191E24', fontSize:13, opacity:0.6, fontFamily:'HelveticaNeue',  }}>{item.ProductCategory}</Text>
                    </View>
                  </View>
                  <View style={{flex: 3, flexDirection: "row", marginBottom:3}}>
                    <View style={{flex: 1, paddingLeft: 5}}>
                      <Text style={{fontSize:13, color:'#000000', fontFamily:'HelveticaNeue', }}>Paper Type</Text>
                    </View>
                    <View style={{flex: 1}}>
                      <Text style={{color:'#191E24', fontSize:13, opacity:0.6, fontFamily:'HelveticaNeue',  }}>{item.PaperType}</Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          </View>
          <View style={{flex: 1}}>
            <TouchableOpacity
              style={{
                borderTopWidth:1,
                borderTopColor:'#e8d5d5', 
                height:30,
                left:0,
                right:0,
                bottom:0,
                flexDirection: 'row',
                alignItems:'center',
                justifyContent: 'center'
              }}
              onPress={() => {
                  handleOpenFile(item.ID, decode(item.Name))
              }}
            >
              <Ionicons raised name="md-open-outline" size={18} color="#00854F" />
              <Text style={{fontWeight:'bold', fontSize:(fontScale < 1.2 ? 13 : 13/fontScale), color:'#00854F', marginTop: 3, marginLeft: 2, fontFamily:'HelveticaNeue',  }}>View PDF</Text> 
            </TouchableOpacity>
          </View>
        </View>
      )
    }

    const [ numberOfCategory, setNumberOfCategory ] = useState(0);
    useEffect(() => 
    {
      setLoading(true);
      AsyncStorage.getItem('user_id').then(
        (value) =>
        {
          AESEncryption("decrypt",value).then((respp)=>
          {
            setTokenValue("" + JSON.parse(respp).data.Token);
            var dataToSend = {Token: ''+JSON.parse(respp).data.Token,PaperType:route.params.PaperType};
  
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
  
              let productCategory = "";
  
              let numberOfCategoryTemp = 0;
              let selectedPaperTypeTemp = [];
  
              if((route.params.ProductCategories)){
                if(route.params.ProductCategories.length > 0){
                  for(let key in route.params.ProductCategories){
  
                    if(route.params.ProductCategories[key].selected){
                      numberOfCategoryTemp++;
                      selectedPaperTypeTemp.push(route.params.ProductCategories[key].Name);
                      productCategory += (productCategory !== "" ? "," : "") + "'" + route.params.ProductCategories[key].Name + "'";
                    }
                  }
                }
              }
  
              if((!route.params.ProductCategories) || (route.params.ProductCategories.length == 0) || (selectedPaperTypeTemp.length == 0) ){
                route.params.ProductCategories = [];
                for(let key in json){
                  productCategory += (productCategory !== "" ? "," : "") + "'" + json[key] + "'";
                  route.params.ProductCategories.push(json[key]);
                  numberOfCategoryTemp++;
                }
              }
  
              setSelectedPaperType(selectedPaperTypeTemp);
              setNumberOfCategory(numberOfCategoryTemp);
  
              var formBody2 = "";
              formBody2 = "{" + 
                '"Token":"' + JSON.parse(respp).data.Token + '",' + 
                '"PaperType":"' + route.params.PaperType + '",' + 
                '"ProductName":"' + ((route.params.SearchText) ? route.params.SearchText : "") + '",' + 
                '"ProductCategories":[' + productCategory + ']' + 
              "}";
  
              // console.log("ya=>" + formBody2);
              let prodCatalogDetailURL = `${API_URL}/WebApi1/access/api/productcataloguedetails`;
              fetch(prodCatalogDetailURL, {
                method: 'POST',
                body: formBody2, 
                headers: {
                  'Content-Type': 'application/json',
                },
              })
              .then((response) => response.json())
              .then(json2 => {
                // console.log(json2.length + "::" + JSON.stringify(json2));                      
                setTotalShownProduct(json2.length);
                setItemList(json2);
                setLoading(false);
              })
              .catch((error) => console.error(error))
              .finally()
            })
            .catch((error) => console.error(error))            
          });          

        }
      );
    }, []);

    Moment.locale('en');  
  
    let [loading, setLoading] = useState(false);  
	
	const processSaveFileIOS = async () => {
    		const file = RNFetchBlob.fs.dirs.DocumentDir + '/' + pdfProductName + '.pdf';
    		RNFetchBlob.fs.writeFile(file, pdfString, 'base64')
		      .then((len) => {
			Alert.alert("Download", "Download Successful", [{text: 'OK', onPress: () => {}}]);
		      })
		      .catch((err) => {
			console.log('Download error');
		      })
  	}
  
	const processSaveFile = async () => {
		  try {
			const granted = await PermissionsAndroid.request(
			  PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
			  {
				title: "April Connect Permission",
				message: "April Connect needs permission.",
				buttonNeutral: "Ask Me Later",
				buttonNegative: "Cancel",
				buttonPositive: "OK"
			  }
			);
			if (granted === PermissionsAndroid.RESULTS.GRANTED) {

			  // write the file
			  RNFS.writeFile(path + "/" + pdfProductName + ".pdf", pdfString, 'base64')
			  .then((success) => {
				ToastAndroid.show("File " + pdfProductName + ".pdf" +  " successfully save to Folder " + path + " !", ToastAndroid.LONG);
			  })
			  .catch((err) => {
				ToastAndroid.show("Failed to save file", ToastAndroid.LONG);
			  });                  

			  return true;
			} else {
			  console.log("Camera permission denied");
			  return false;
			}
		  } catch (err) {
			  return false;
		  }
	}	

    return (
      <SafeAreaView style={styles.mainBody}>      
      <Loader loading={loading} />        
      <ScrollView>
      <Modal
        transparent={true}
        animationType={'none'}
        visible={isLoadingPopupSendConfirmation}
        onRequestClose={() => {
          setLoadingPopupSendConfirmation(false);
        }}
      >
      <View 
        style={{
          height:'94%',
          left:0,
          right:0,
          bottom:0,
          position:'absolute',
          alignItems: 'center',
          flexDirection: 'column',
          flex:2,
          justifyContent: 'space-around',
          backgroundColor:'#f9f4f4',
          borderWidth:1,
          borderColor:'#e7cccc',
          borderTopRightRadius:14,
          borderTopLeftRadius:14,
          borderBottomWidth:0,
        }}
      >
        <TouchableOpacity 
          style={{
            position:'absolute',              
            paddingTop:5,
            left:5,
          }}
        >
          <Ionicons
            raised 
            name="chevron-down"
            size={30}
            color="#000000" 
            onPress={() => {
              setLoadingPopupSendConfirmation(false)
            }}
          />
        </TouchableOpacity>        
        <View
          style={{
            height:27,
            width:'80%',            
            top:0,
            flex:1,          
            justifyContent:'center'
          }}
        >
          <Text
            style={{
              fontWeight:'bold',
              fontSize:13/fontScale,
              color:'#000000',
              alignItems:'center',
              textAlign:'center',              
              alignSelf:'center',
              flexWrap:'wrap',
            }}>
            {pdfProductName} (Pdf File)
          </Text>            
        </View>
          <TouchableOpacity 
            style={{
              position:'absolute',              
              paddingTop:10,
              right:8,
            }}
          >
            <Feather
              raised 
              name="download"
              size={22}
              color="#00854F" 
              onPress={()=>
        {
          (Platform.OS == "android") ? processSaveFile() :  processSaveFileIOS();
        }}
            />
          </TouchableOpacity>          
        <View 
          style={{
            backgroundColor:'#FDFDFD',
            height:'92%',
            width:'100%',
          }}
        >
          <Pdf 
            source={pdfSource}
            onLoadComplete={(numberOfPages,filePath)=>{
            }}
            onPageChanged={(page,numberOfPages)=>{
            }}
            onError={(error)=>{
                console.log(error);
            }}
            onPressLink={(uri)=>{
                console.log(`Link presse: ${uri}`)
            }}
            style={{
              flex:1,
              width:Dimensions.get('window').width,
              height:Dimensions.get('window').height,
            }}
          />          
        </View>
      </View>
      </Modal>          
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
            <Text style={{ marginTop:7,color:'#FDFDFD',fontSize:(fontScale < 1.2 ? 19 : 20/fontScale), fontFamily:'HelveticaNeue-Bold', }}>Product Catalogue</Text>
        </View>
      <TouchableOpacity 
        style={styles.SectionStyle}
        onPress={handleStartSearch}
      >
        <MaterialIcons raised name="search" size={20} color="#000" style={styles.searchIcon}/>
        <Text
          style={{
            fontFamily:'HelveticaNeue',
            fontSize:14,
          }}
          underlineColorAndroid="#FFFFFF"
          keyboardType="default"
          placeholderTextColor="#3CB371"
          autoCapitalize="none"
          returnKeyType="next"
          blurOnSubmit={false}
        >
          {(route.params.SearchText) ?  route.params.SearchText : "Search & Filter"}
        </Text>
      </TouchableOpacity>      
      <View
        style={{
          alignSelf:'center',
          alignItems:'center',
          flex:1,
          flexDirection:'row'
        }}
      >
        {
          (route.params.ProductCategories) 
          ? 
            (route.params.ProductCategories.length == numberOfCategory)
            ? 
            (
              <View style={{flexDirection:'row',alignItems:'center',alignSelf:'center'}}>
              <Text style={{fontWeight:'bold', fontSize:13, color:'#00854F', fontFamily:'HelveticaNeue', }}>Filtering by:</Text>
              <View style={{backgroundColor:'#00854F',height:22,borderRadius:12, paddingLeft:10, paddingRight:10, marginLeft:10,}}>
                <Text style={{color:'#FFFFFF',fontSize:(fontScale < 1.2 ? 13 : 13/fontScale), fontFamily:'HelveticaNeue'}}>All Category</Text>
              </View>
              </View>
            )
            : 
            (
              <View
                style={{
                  alignSelf:'center',
                  alignItems:'center',
                  flexDirection:'row',
                  flexWrap:'wrap',
                  alignContent:'center',
                  marginLeft:30,
                  marginRight:30,
                  paddingLeft:0,
                  paddingRight:0,
                }}            
              >
                <View style={{backgroundColor:'#00854F',height:22,borderRadius:12, paddingLeft:10, paddingRight:10, marginLeft:10,}}>
                  <Text style={{color:'#FFFFFF',marginTop:1,fontSize:(fontScale < 1.2 ? 13 : 13/fontScale)}}>{selectedPaperType[0]}</Text>
                </View>
                {
                  (selectedPaperType[1]) 
                  ? 
                  (
                    <View style={{backgroundColor:'#00854F',height:22,borderRadius:12, paddingLeft:10, paddingRight:10, marginLeft:2,}}>
                      <Text style={{color:'#FFFFFF',marginTop:1,fontSize:(fontScale < 1.2 ? 13 : 13/fontScale)}}>{selectedPaperType[1]}</Text>
                    </View>
                  )
                  :
                  (<></>)
                }
                {
                  (selectedPaperType[2])
                  ? 
                  (
                    <View style={{backgroundColor:'#00854F',height:22,borderRadius:12, paddingLeft:10, paddingRight:10, marginLeft:2,}}>
                      <Text style={{color:'#FFFFFF',marginTop:1,fontSize:(fontScale < 1.2 ? 13 : 13/fontScale)}}>{selectedPaperType.length-2}+</Text>
                    </View>
                  )
                  :
                  (<></>)
                }
              </View>                
            )
          :
          (<></>)
        }
      </View>      
      <View
        style={{
          flex:1,
          flexDirection: 'row',
          alignItems:'center',
          marginTop:20,
        }}
      >
      </View>
      {
        totalShownProduct > 0 
        ? 
        (
          <View>
            <View style={{flex:1,  marginLeft:25, width:'100%', flexDirection:'row'}}>
              <Text style={{ fontSize:13,}}>Total </Text><Text style={{ fontSize:13, fontWeight:'bold', color:'#00854F'}}>{totalShownProduct}</Text><Text style={{fontSize:13}}> Product(s) Are Shown </Text>
            </View>
            <FlatList
              data={itemList}
              keyExtractor={(item, index) => "ItemList_" + index.toString()}
              renderItem={buildItemProductCatalogueList}
            />
          </View>
        )
        :
        (
          (loading)
          ?
          (<></>)
          :
          (
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
            >No Result Found</Text>
            </View>
          )
        )
      }
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
});

const s = StyleSheet.create({
  content__header: {
    padding: 15,
    paddingBottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },

  content__heading: {
    alignSelf:'center',
    marginBottom: 5,
    fontFamily:'Rubik-Bold',
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
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
    fontWeight: '200',
    lineHeight: 22,
    color: '#666',
  },

  content__scrollview: {
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

export default ProductCatalogueDetailScreen;