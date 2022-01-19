// import React in our code
import React, {useState, useEffect} from 'react';

// import all the components we are going to use
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity
} from 'react-native';
import {ACCESS_API} from '@env';
import Moment from 'moment';
import LOGOSVG from 'AnRNApp/Image/svg_logo/emptystate_noresults.svg';

import DeviceInfo from 'react-native-device-info';

const SearchOrdersResultETAProductDescScreen = ({route, navigation}) => {

    const [loading, setLoading] = useState(false);
    const [isListEnd, setIsListEnd] = useState(false);

    const [searchDataResult, setSearchDataResult] = useState([]);
    const [skipValue, setSkipValue] = useState(0);

    const showDetailOrder = (SalesOrderID, category) => {
        navigation.navigate('Details', {SalesOrderID:SalesOrderID,Category:category,TokenValue:route.params.TokenValue})
    };

    Moment.locale('en');

    const [ fontScale, setFontScale ] = useState(1);

    DeviceInfo.getFontScale().then((fontScaleTemp) => {
      setFontScale(fontScaleTemp)
    });

    const getData = () => {

        var APITarget = `${ACCESS_API}/prodec`;
        var dataToSend = {
            ProductType: route.params.productDescriptionCategory,
            ProductDes:route.params.productDescriptionKeyword,
            Token: route.params.TokenValue,
            Skip:skipValue /* route.params.SalesOrderID */
        };

        if(route.params.SearchedLocation && route.params.SearchedLocation !== ""){ // zero means Order Number
          APITarget = `${ACCESS_API}/locsearch`;
          dataToSend = { LocationName: route.params.SearchedLocation, Token: route.params.TokenValue };
        } else if (route.params.year != "" && route.params.month != ""){
            APITarget = `${ACCESS_API}/eta`;
            dataToSend = { month: ((route.params.month.length == 1) ? "0" + route.params.month : route.params.month), year: route.params.year, Token: route.params.TokenValue, Skip:skipValue /* route.params.SalesOrderID */ };
        }

        var formBody = [];
        for (let key in dataToSend) {
            var encodedKey = encodeURIComponent(key);
            var encodedValue = encodeURIComponent(dataToSend[key]);
            formBody.push(encodedKey + '=' + encodedValue);
        }
        formBody = formBody.join('&');

        if (!loading && !isListEnd) {
            setLoading(true);
            fetch(APITarget,{ method: 'POST', body: formBody, headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8', },})
            .then((response) => response.json())
            .then(json => {
                setSkipValue((skipValue+((json.length) ? json.length : 0)))
                if(json.length > 0){ setSearchDataResult([...searchDataResult, ...json]);}
                else{
                    if(skipValue == 0){ var notFoundData = []; notFoundData.push("notFound=true"); setSearchDataResult(notFoundData); }
                    setIsListEnd(true);
                }
                setLoading(false);
            })
            .catch((error) => console.error(error))
        }
    };

    const renderFooter = () => { return (
      <View style={styles.footer}>{loading?(<ActivityIndicator color="black" style={{margin: 15}} />):<></>}</View>);
    };

    const ItemView = ({item}) => {
        var ETA = "" + Moment(item.ETA).format('DD MMMM YYYY');
        var orderTaken = "" + Moment(item.OrderTaken).format('DD MMMM YYYY');

        if(item == "notFound=true"){
          return ( <View><LOGOSVG style={{marginTop:20,alignSelf:'center',alignItems:'center'}} width={300} height={140}/><Text style={{alignSelf:'center', alignItems:'center'}}>No Result Found</Text></View>)
        }

        return (
            <View style={{overflow: "hidden"}} key={item.OrderNumber}>
              <TouchableOpacity
                  key="Touchable{item.OrderNumber}"
                  style={{
                    borderRadius:12,
                    backgroundColor:'#FFFFFF',
                    height:190,
                    borderColor:'#ccc',
                    borderWidth:1,
                    marginRight:(fontScale > 1.2 ? 4 : 25),
                    marginLeft:(fontScale > 1.2 ? 4 : 25),
                    color:'#000000',
                    marginBottom:5,
                    marginTop:5,
                    paddingLeft:20,
                  }}
                  onPress={showDetailOrder.bind(this,item.OrderNumber, 'outstanding')}
                >
                <View style={{position:'absolute',left:0,height:30,width:3,borderBottomRightRadius:2,borderTopRightRadius:2,  backgroundColor:'#00854F', marginTop:8}}/>
                <Text style={{color:'#000000',paddingLeft:5,paddingTop:5,fontSize:13,fontWeight:'bold'}}>Order Number {item.OrderNumber}</Text>
                <Text style={{color:'#b58e8e',paddingLeft:5,paddingTop:2,fontSize:11,}}>PO Number: {item.PONumber}</Text>
                <Text style={{color:'#b58e8e',paddingLeft:5,paddingTop:2,fontSize:11,}}>Total Quantity: {item.Quantity}</Text>
                <View
                    style={{
                    justifyContent:'flex-start',
                    flexDirection:'row',
                    marginTop:80,
                    position:'absolute',
                    color:'#FDFDFD',
                    left:0,
                    right:0,
                    alignItems:'center',
                    }}
                >
                <View style={{ left:0,right:0,bottom:0,marginLeft:'7%',marginRight:'7%', position:'absolute',top:0, height:100,}}>
                    <View style={{  left:0,  position:'absolute', }} >
                      <Text style={{marginTop:1,color:'#000000',fontWeight:'bold',fontSize:13}}>ETA</Text>
                      <Text style={{marginTop:1,color:'#000000',fontWeight:'bold',fontSize:13}}>Order Taken</Text>
                    </View>
                    <View style={{ right:0,  position:'absolute', }} >
                      <Text style={{marginTop:1,color:'#000000',fontSize:13, textAlign:'right'}}>{ETA}</Text>
                      <Text style={{marginTop:1,color:'#000000',fontSize:13, textAlign:'right'}}>{orderTaken}</Text>
                    </View>
                </View>
                </View>
            </TouchableOpacity>
            </View>
        );
    };

    const ItemSeparatorView = () => { return ( <></> ); };

    useEffect(() => { getData(); }, [])

    return (
      <SafeAreaView style={{flex: 1}}>
        <FlatList data={searchDataResult} keyExtractor={(item, index) => index.toString()} ItemSeparatorComponent={ItemSeparatorView} renderItem={ItemView} ListFooterComponent={renderFooter} onEndReached={getData} onEndReachedThreshold={0.5}/>
      </SafeAreaView>
    );
};

const styles = StyleSheet.create({ footer: { padding: 10, justifyContent: 'center', alignItems: 'center', flexDirection: 'row', }, });

export default SearchOrdersResultETAProductDescScreen;