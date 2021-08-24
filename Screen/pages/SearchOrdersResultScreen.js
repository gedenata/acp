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

const SearchOrdersResultScreen = ({route, navigation}) => {

    const [loading, setLoading] = useState(false);
    const [isListEnd, setIsListEnd] = useState(false);

    const [searchDataResult, setSearchDataResult] = useState([]);
    const [skipValue, setSkipValue] = useState(0);
  
    const showDetailOrder = (SalesOrderID, category) => {
        navigation.navigate('Details', {SalesOrderID:SalesOrderID,Category:category,TokenValue:route.params.TokenValue})
    };    

    Moment.locale('en');  
  
    useEffect(() => getData(), []);    

    const [ fontScale, setFontScale ] = useState(1);

    DeviceInfo.getFontScale().then((fontScaleTemp) => {
      setFontScale(fontScaleTemp)
    });

    const getData = () => { 

        var APITarget = "";
        let dataToSend;
        if(route.params.POOrOrderNumber == "" || route.params.POOrOrderNumber == "0"){ // zero means Order Number
          APITarget = `${ACCESS_API}/outstanding`;
          dataToSend = { SalesOrderID: route.params.POOrOrderNumberKeyword, Token: route.params.TokenValue /* route.params.SalesOrderID */ };                
        }
        else{
          APITarget = `${ACCESS_API}/po`;      
          dataToSend = { POnumber: route.params.POOrOrderNumberKeyword, Token: route.params.TokenValue /* route.params.SalesOrderID */ };        
        }

        var formBody = [];
        for (let key in dataToSend){
          var encodedKey = encodeURIComponent(key);
          var encodedValue = encodeURIComponent(dataToSend[key]);
          formBody.push(encodedKey + '=' + encodedValue);
        }
        formBody = formBody.join('&');

        if (!loading && !isListEnd) 
        {
            setLoading(true);

            fetch(APITarget,{
                method: 'POST',
                body: formBody,      
                headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
                },
            })
            .then((response) => response.json())
            .then(json => {
                setSkipValue((skipValue+((json.Header) ? 1 : 0)));
                var jsonTemp = [];

                if(json.Header){
                    jsonTemp[0] = json;

                    var orderNumber = "" + jsonTemp[0].Header.OrderNumber;
                    dataToSend = { SalesOrderID: ''+orderNumber, Token: ''+route.params.TokenValue };
                    var formBodyLocal = [];
                    for (let key in dataToSend) {
                      var encodedKeyOutstanding = encodeURIComponent(key);
                      var encodedValueOutstanding = encodeURIComponent(dataToSend[key]);
                      formBodyLocal.push(encodedKeyOutstanding + '=' + encodedValueOutstanding);
                    }
                    formBodyLocal = formBodyLocal.join('&'); 
                    let url = `${ACCESS_API}/outstanding`;
                    fetch(url,{ method: 'POST', body: formBodyLocal, headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8', },})
                    .then((responseAgain) => responseAgain.json())
                    .then(responseAgainJSON => {
                      var totalItemValueOutstanding = responseAgainJSON.Body.length;
                      var totalQuantity = 0;
                      for(var j = 0; j < responseAgainJSON.Body.length; j++){
                        totalQuantity += parseFloat(responseAgainJSON.Body[0].ProductQty.split(" ")[0]);
                      }

                      if(jsonTemp[0].Header.OrderNumber == responseAgainJSON.Header.OrderNumber){
                        jsonTemp[0].Header.TotalItem = totalItemValueOutstanding;
                        jsonTemp[0].Header.ProductQty = totalQuantity;
                        jsonTemp[0].Header.FinalDestination = responseAgainJSON.Body[0].FinalDestination;
                      }

                      setSearchDataResult([...searchDataResult, ...jsonTemp]);
                      setIsListEnd(true);
                    })
                }
                else
                {
                    if(skipValue == 0){ var notFoundData = []; notFoundData.push("notFound=true"); setSearchDataResult(notFoundData);}
                    setIsListEnd(true);
                }
                setLoading(false);                     
            })
            .catch((error) => console.error(error))
        }
    };
  
    const renderFooter = () => {
      return (<View style={styles.footer}>{loading?(<ActivityIndicator color="black" style={{margin: 15}}/>) : null}</View> );
    };
  
    const ItemView = ({item}) => {
        if(item == "notFound=true"){ 
          return ( <View><LOGOSVG style={{marginTop:20,alignSelf:'center',alignItems:'center'}} width={300} height={140}/><Text style={{alignSelf:'center', alignItems:'center'}}>No Result Found</Text></View>)
        }
        else
        {
          return (
            <View 
              style={{
                overflow: "hidden",
                marginRight:(fontScale > 1.2 ? 4 : 20), 
                marginLeft:(fontScale > 1.2 ? 4 : 20),              
              }} 
              key={item.Header.OrderNumber}
            >
              <TouchableOpacity 
                key="outstanding{item.OrderNumber}"
                style={{
                  borderRadius:12,
                  backgroundColor:'#FFFFFF',
                  minHeight:190,
                  borderColor:'#ccc',
                  borderWidth:1,
                  color:'#000000',
                  marginBottom:5, 
                  marginTop:5,
                  paddingLeft:8,
                }}
                onPress={showDetailOrder.bind(this,item.Header.OrderNumber, 'outstanding')}
              >
                <View style={{position:'absolute',left:0,height:30,width:3, borderBottomRightRadius:2,borderTopRightRadius:2,  backgroundColor:'#00854F',marginTop:8}}/>                              
                <View style={{flex:2,flexDirection:'column',top:0}}>
                  <Text style={{color:'#000000',paddingLeft:5,paddingTop:5,fontSize:13,fontWeight:'bold'}}>Order Number {item.Header.OrderNumber}</Text>
                  <Text style={{color:'#b58e8e',paddingLeft:5,paddingTop:2,fontSize:11,}}>{item.Header.CustomerName}</Text>
                </View>
                <View 
                    style={{
                      flexDirection:'column',
                      flex:1,
                      minHeight:50,
                      width:'100%', 
                    }}
                >
                  <View style={{ flex:2, flexDirection:'row',}}>
                    <View style={{flex:1, paddingLeft:2,}}>
                      <Text style={{marginTop:1,color:'#000000',fontWeight:'bold',fontSize:13, textAlign:'left'}}>PO Number</Text>
                    </View>
                    <View style={{flex:1, paddingRight:10,}}>
                      <Text style={{marginTop:1,color:'#000000',fontSize:13, textAlign:'right'}}>{item.Header.PONumber}</Text>
                    </View>
                  </View>
                  <View style={{ flex:2, flexDirection:'row',}}>
                    <View style={{flex:1, paddingLeft:2,}}>
                      <Text style={{marginTop:1,color:'#000000',fontWeight:'bold',fontSize:13, textAlign:'left'}}>ETA</Text>
                      <Text style={{marginTop:1,color:'#000000',fontWeight:'bold',fontSize:13, textAlign:'left'}}>Order Taken</Text>
                      <Text style={{marginTop:1,color:'#000000',fontWeight:'bold',fontSize:13, textAlign:'left'}}>Total Quantity</Text>
                    </View>
                    <View style={{flex:1, paddingRight:10,marginBottom:5}}>
                      <Text style={{marginTop:1,color:'#000000',fontSize:13, textAlign:'right'}}>{(item.Body[0].TargetDelivered != "") ? Moment(item.Body[0].TargetDelivered).format('D MMMM YYYY') : ""}</Text>
                      <Text style={{marginTop:1,color:'#000000',fontSize:13, textAlign:'right'}}>{(item.Body[0].OrderTaken != "") ? Moment(item.Body[0].OrderTaken).format('D MMMM YYYY') : ""}</Text>
                      <Text style={{marginTop:1,color:'#000000',fontSize:13, textAlign:'right'}}>{item.Header.ProductQty}</Text>
                    </View>
                  </View>                
                </View>
                <View style={{minHeight:30,borderTopWidth:1,borderColor:'#efdddd',alignItems:'center', flex:2, flexDirection:'row'}}>
                  <View style={{flex:1}}>
                    <Text style={{color:'#865959',marginTop:4, fontSize:14, fontWeight:'bold', textAlign:'left',paddingLeft:12}}>{item.Header.TotalItem} ITEM(s)</Text>
                  </View>
                  <View style={{flex:1}}>
                    <Text style={{color:'#b09b9b',marginTop:4, fontSize:14, fontWeight:'bold', textAlign:'right',paddingRight:12}}>{item.Body[0].FinalDestination}</Text>
                  </View>
                </View>              
              </TouchableOpacity>                     
            </View>
          )
        }
    };
  
    const ItemSeparatorView = () => { return ( <></> ); };
  
    useEffect(() => { getData(); }, [])    

    return (
      <SafeAreaView style={{flex: 1}}>
        <FlatList data={searchDataResult} keyExtractor={(item, index) => index.toString()} ItemSeparatorComponent={ItemSeparatorView} renderItem={ItemView} ListFooterComponent={renderFooter} onEndReached={getData} onEndReachedThreshold={0.5}/>
      </SafeAreaView>
    );
};
  
  const styles = StyleSheet.create({
    footer: {
      padding: 10,
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'row',
    },
  });

export default SearchOrdersResultScreen;